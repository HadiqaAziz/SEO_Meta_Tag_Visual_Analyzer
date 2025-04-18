import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertAnalyzedSiteSchema } from "@shared/schema";
import { z } from "zod";
import fetch from "node-fetch";
import * as cheerio from "cheerio";

export async function registerRoutes(app: Express): Promise<Server> {
  // prefix all routes with /api
  
  // Analyze a website route
  app.post("/api/analyze", async (req, res) => {
    try {
      const urlSchema = z.object({
        url: z.string().url()
      });
      
      const validatedData = urlSchema.parse(req.body);
      const { url } = validatedData;
      
      // Check if we already have analyzed this URL recently
      const existingSite = await storage.getAnalyzedSiteByUrl(url);
      if (existingSite) {
        // If the site was analyzed in the last hour, return the existing data
        const analyzedAt = new Date(existingSite.analyzedAt);
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
        
        if (analyzedAt > oneHourAgo) {
          return res.json(existingSite);
        }
      }
      
      // Fetch the webpage HTML with proper headers to avoid being blocked
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5',
          'Referer': 'https://www.google.com/'
        },
        redirect: 'follow',
      });
      
      if (!response.ok) {
        return res.status(400).json({ 
          message: `Failed to fetch URL: ${response.status} ${response.statusText}` 
        });
      }
      
      const html = await response.text();
      
      // Parse HTML to extract meta tags
      const analysisResult = analyzeHtml(html, url);
      
      // Calculate scores based on the analysis
      const { scoreTitle, scoreDescription, scoreOpenGraph, scoreTwitter } = calculateScores(analysisResult);
      
      // Save analysis to storage
      const newSite = await storage.createAnalyzedSite({
        url,
        title: analysisResult.title?.content,
        description: analysisResult.description?.content,
        canonical: analysisResult.canonical?.content,
        ogTitle: analysisResult.openGraph?.title,
        ogDescription: analysisResult.openGraph?.description,
        ogImage: analysisResult.openGraph?.image,
        ogUrl: analysisResult.openGraph?.url,
        ogType: analysisResult.openGraph?.type,
        ogSiteName: analysisResult.openGraph?.siteName,
        twitterCard: analysisResult.twitter?.card,
        twitterTitle: analysisResult.twitter?.title,
        twitterDescription: analysisResult.twitter?.description,
        twitterImage: analysisResult.twitter?.image,
        metaTags: analysisResult,
        issues: getIssues(analysisResult),
        recommendations: getRecommendations(analysisResult),
        scoreTitle,
        scoreDescription,
        scoreOpenGraph,
        scoreTwitter,
        analyzedAt: new Date()
      });
      
      res.json(newSite);
    } catch (error) {
      console.error("Error analyzing URL:", error);
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid URL format", errors: error.errors });
      }
      res.status(500).json({ message: "Failed to analyze website" });
    }
  });
  
  // Get recent analyzed sites
  app.get("/api/sites/recent", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 5;
      const sites = await storage.listRecentAnalyzedSites(limit);
      res.json(sites);
    } catch (error) {
      console.error("Error fetching recent sites:", error);
      res.status(500).json({ message: "Failed to fetch recent sites" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

// Function to analyze HTML and extract meta tags
function analyzeHtml(html: string, url: string) {
  const $ = cheerio.load(html);
  
  // Helper function to resolve relative URLs
  const resolveUrl = (relativeUrl: string | undefined): string | undefined => {
    if (!relativeUrl) return undefined;
    try {
      // Check if it's already an absolute URL
      if (relativeUrl.startsWith('http://') || relativeUrl.startsWith('https://')) {
        return relativeUrl;
      }
      
      // Resolve relative URL against base URL
      const baseUrl = new URL(url);
      if (relativeUrl.startsWith('/')) {
        return `${baseUrl.protocol}//${baseUrl.host}${relativeUrl}`;
      } else {
        // Handle relative path without leading slash
        const path = baseUrl.pathname.endsWith('/') 
          ? baseUrl.pathname 
          : baseUrl.pathname.substring(0, baseUrl.pathname.lastIndexOf('/') + 1);
        return `${baseUrl.protocol}//${baseUrl.host}${path}${relativeUrl}`;
      }
    } catch (e) {
      console.error("Error resolving URL:", e);
      return relativeUrl;
    }
  };
  
  // Get image from multiple potential sources
  const getFirstAvailableImage = (): string | undefined => {
    // Try Open Graph image
    const ogImage = $('meta[property="og:image"]').attr('content') || 
                    $('meta[property="og:image:url"]').attr('content');
    if (ogImage) return resolveUrl(ogImage);
    
    // Try Twitter image
    const twitterImage = $('meta[name="twitter:image"]').attr('content') ||
                        $('meta[name="twitter:image:src"]').attr('content');
    if (twitterImage) return resolveUrl(twitterImage);
    
    // Try looking for a featured image or first image
    const firstImg = $('img[class*="featured"], article img, .post img, .content img').first().attr('src');
    if (firstImg) return resolveUrl(firstImg);
    
    // Last resort: first image on the page
    const anyImg = $('img').first().attr('src');
    if (anyImg) return resolveUrl(anyImg);
    
    return undefined;
  };

  // Get title from multiple sources
  const getTitle = (): string => {
    return $('title').text().trim() || 
           $('h1').first().text().trim() || 
           'No title found';
  };
  
  // Get description from multiple sources
  const getDescription = (): string | undefined => {
    return $('meta[name="description"]').attr('content') ||
           $('meta[property="og:description"]').attr('content') ||
           $('meta[name="twitter:description"]').attr('content');
  };
  
  // Get canonical URL
  const getCanonical = (): string | undefined => {
    return $('link[rel="canonical"]').attr('href') ||
           $('meta[property="og:url"]').attr('content');
  };
  
  // Extract meta information
  const title = getTitle();
  const description = getDescription();
  const titleLength = title ? title.length : 0;
  const descLength = description ? description.length : 0;
  
  // Main image for previews (resolved to absolute URL)
  const mainImage = getFirstAvailableImage();
  
  const result: any = {
    title: {
      content: title,
      length: titleLength,
      score: "missing"
    },
    description: {
      content: description,
      length: descLength,
      score: "missing"
    },
    canonical: {
      content: getCanonical(),
      score: "missing"
    },
    openGraph: {
      title: $('meta[property="og:title"]').attr('content'),
      description: $('meta[property="og:description"]').attr('content'),
      image: resolveUrl($('meta[property="og:image"]').attr('content')),
      url: $('meta[property="og:url"]').attr('content'),
      type: $('meta[property="og:type"]').attr('content'),
      siteName: $('meta[property="og:site_name"]').attr('content'),
      score: "missing"
    },
    twitter: {
      card: $('meta[name="twitter:card"]').attr('content'),
      title: $('meta[name="twitter:title"]').attr('content'),
      description: $('meta[name="twitter:description"]').attr('content'),
      image: resolveUrl($('meta[name="twitter:image"]').attr('content') || $('meta[name="twitter:image:src"]').attr('content')),
      score: "missing"
    },
    other: []
  };
  
  // If Open Graph image is missing but we found an image elsewhere, use it
  if (!result.openGraph.image && mainImage) {
    result.openGraph.image = mainImage;
  }
  
  // If Twitter image is missing but we have OG or another image, use it
  if (!result.twitter.image) {
    result.twitter.image = result.openGraph.image || mainImage;
  }
  
  // Add other meta tags
  $('meta').each((i, elem) => {
    const name = $(elem).attr('name') || $(elem).attr('property');
    const content = $(elem).attr('content');
    
    if (name && content && !name.startsWith('og:') && !name.startsWith('twitter:') && 
        name !== 'description' && name !== 'viewport') {
      result.other.push({ name, content });
    }
  });
  
  return result;
}

// Function to calculate scores based on the analysis
function calculateScores(analysis: any) {
  let scoreTitle = "missing";
  let scoreDescription = "missing";
  let scoreOpenGraph = "missing";
  let scoreTwitter = "missing";
  
  // Title score
  if (analysis.title.content) {
    const titleLength = analysis.title.length;
    if (titleLength >= 30 && titleLength <= 60) {
      scoreTitle = "excellent";
    } else if (titleLength > 0 && titleLength < 30) {
      scoreTitle = "needs-work";
    } else if (titleLength > 60) {
      scoreTitle = "good";
    }
    analysis.title.score = scoreTitle;
  }
  
  // Description score
  if (analysis.description.content) {
    const descLength = analysis.description.length;
    if (descLength >= 120 && descLength <= 160) {
      scoreDescription = "excellent";
    } else if (descLength > 0 && descLength < 120) {
      scoreDescription = "needs-work";
    } else if (descLength > 160) {
      scoreDescription = "good";
    }
    analysis.description.score = scoreDescription;
  }
  
  // Open Graph score
  const ogProps = analysis.openGraph;
  if (ogProps.title || ogProps.description || ogProps.image) {
    const hasMandatory = Boolean(ogProps.title && ogProps.description && ogProps.image);
    const hasOptional = Boolean(ogProps.url && ogProps.type);
    
    if (hasMandatory && hasOptional) {
      scoreOpenGraph = "excellent";
    } else if (hasMandatory) {
      scoreOpenGraph = "good";
    } else {
      scoreOpenGraph = "needs-work";
    }
    analysis.openGraph.score = scoreOpenGraph;
  }
  
  // Twitter Cards score
  const twitterProps = analysis.twitter;
  if (twitterProps.card || twitterProps.title || twitterProps.description || twitterProps.image) {
    const hasMandatory = Boolean(twitterProps.card && twitterProps.title && twitterProps.description);
    const hasImage = Boolean(twitterProps.image);
    
    if (hasMandatory && hasImage) {
      scoreTwitter = "excellent";
    } else if (hasMandatory) {
      scoreTwitter = "good";
    } else {
      scoreTwitter = "needs-work";
    }
    analysis.twitter.score = scoreTwitter;
  }
  
  return {
    scoreTitle,
    scoreDescription,
    scoreOpenGraph,
    scoreTwitter
  };
}

// Function to generate issues based on the analysis
function getIssues(analysis: any) {
  const issues = [];
  
  // Check for missing or problematic meta tags
  
  // Title issues
  if (!analysis.title.content) {
    issues.push({
      severity: "error",
      title: "Missing title tag",
      description: "Your page is missing a title tag, which is critical for SEO and usability.",
      fixLink: "https://moz.com/learn/seo/title-tag"
    });
  } else if (analysis.title.length < 30) {
    issues.push({
      severity: "warning",
      title: "Title tag too short",
      description: `Your title tag is only ${analysis.title.length} characters. For best SEO results, use between 30-60 characters.`,
      fixLink: "https://moz.com/learn/seo/title-tag"
    });
  } else if (analysis.title.length > 60) {
    issues.push({
      severity: "info",
      title: "Title tag may be truncated in search results",
      description: `Your title tag is ${analysis.title.length} characters, which may get truncated in some search results. Consider keeping it under 60 characters.`,
      fixLink: "https://moz.com/learn/seo/title-tag"
    });
  }
  
  // Description issues
  if (!analysis.description.content) {
    issues.push({
      severity: "error",
      title: "Missing meta description",
      description: "Your page is missing a meta description, which helps improve click-through rates from search results.",
      fixLink: "https://moz.com/learn/seo/meta-description"
    });
  } else if (analysis.description.length < 120) {
    issues.push({
      severity: "warning",
      title: "Meta description too short",
      description: `Your meta description is only ${analysis.description.length} characters. For best results, use between 120-160 characters.`,
      fixLink: "https://moz.com/learn/seo/meta-description"
    });
  } else if (analysis.description.length > 160) {
    issues.push({
      severity: "info",
      title: "Meta description may be truncated",
      description: `Your meta description is ${analysis.description.length} characters, which may get truncated in search results. Consider keeping it under 160 characters.`,
      fixLink: "https://moz.com/learn/seo/meta-description"
    });
  }
  
  // Canonical issues
  if (!analysis.canonical.content) {
    issues.push({
      severity: "warning",
      title: "Missing canonical tag",
      description: "Your page is missing a canonical tag, which helps prevent duplicate content issues.",
      fixLink: "https://moz.com/learn/seo/canonicalization"
    });
  }
  
  // Open Graph issues
  const ogProps = analysis.openGraph;
  if (!ogProps.title && !ogProps.description && !ogProps.image) {
    issues.push({
      severity: "error",
      title: "Missing Open Graph meta tags",
      description: "Open Graph meta tags are missing from your page. These tags help optimize how your content appears when shared on social media platforms like Facebook.",
      fixLink: "https://ogp.me/"
    });
  } else {
    if (!ogProps.title) {
      issues.push({
        severity: "warning",
        title: "Missing og:title",
        description: "The og:title tag is missing. This tag defines the title of your content when shared on social media.",
        fixLink: "https://ogp.me/"
      });
    }
    
    if (!ogProps.description) {
      issues.push({
        severity: "warning",
        title: "Missing og:description",
        description: "The og:description tag is missing. This tag defines the description of your content when shared on social media.",
        fixLink: "https://ogp.me/"
      });
    }
    
    if (!ogProps.image) {
      issues.push({
        severity: "warning",
        title: "Missing og:image",
        description: "The og:image tag is missing. This tag defines the image displayed when your content is shared on social media.",
        fixLink: "https://ogp.me/"
      });
    }
  }
  
  // Twitter Cards issues
  const twitterProps = analysis.twitter;
  if (!twitterProps.card && !twitterProps.title && !twitterProps.description && !twitterProps.image) {
    issues.push({
      severity: "error",
      title: "Missing Twitter Card meta tags",
      description: "Twitter Card meta tags are missing from your page. These tags help optimize how your content appears when shared on Twitter.",
      fixLink: "https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards"
    });
  } else if (!twitterProps.card) {
    issues.push({
      severity: "warning",
      title: "Missing twitter:card",
      description: "The twitter:card tag is missing. This tag defines the type of card to be displayed when your content is shared on Twitter.",
      fixLink: "https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards"
    });
  }
  
  return issues;
}

// Function to generate recommendations based on the analysis
function getRecommendations(analysis: any) {
  const recommendations = [];
  const highPriority = [];
  const mediumPriority = [];
  
  // Twitter Card recommendations
  if (analysis.twitter.score === "missing") {
    highPriority.push({
      priority: "high",
      title: "Add Twitter Card Meta Tags",
      description: "Implement Twitter Card meta tags to control how your content appears when shared on Twitter.",
      code: `<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="Your Title Here">
<meta name="twitter:description" content="Your description here">
<meta name="twitter:image" content="https://example.com/image.jpg">`
    });
  }
  
  // Open Graph recommendations
  if (analysis.openGraph.score === "missing") {
    highPriority.push({
      priority: "high",
      title: "Add Open Graph Meta Tags",
      description: "Implement Open Graph meta tags to control how your content appears when shared on social media platforms like Facebook.",
      code: `<meta property="og:title" content="Your Title Here">
<meta property="og:description" content="Your description here">
<meta property="og:image" content="https://example.com/image.jpg">
<meta property="og:url" content="https://example.com/page">
<meta property="og:type" content="website">
<meta property="og:site_name" content="Your Site Name">`
    });
  } else if (analysis.openGraph.score === "needs-work") {
    const missingProps = [];
    if (!analysis.openGraph.title) missingProps.push("og:title");
    if (!analysis.openGraph.description) missingProps.push("og:description");
    if (!analysis.openGraph.image) missingProps.push("og:image");
    if (!analysis.openGraph.url) missingProps.push("og:url");
    if (!analysis.openGraph.type) missingProps.push("og:type");
    
    if (missingProps.length > 0) {
      highPriority.push({
        priority: "high",
        title: "Complete Open Graph Implementation",
        description: `Add missing Open Graph properties (${missingProps.join(", ")}) to improve how your content appears on social media.`,
        code: `<!-- Add these missing Open Graph tags -->
${!analysis.openGraph.title ? '<meta property="og:title" content="Your Title Here">\n' : ''}${!analysis.openGraph.description ? '<meta property="og:description" content="Your description here">\n' : ''}${!analysis.openGraph.image ? '<meta property="og:image" content="https://example.com/image.jpg">\n' : ''}${!analysis.openGraph.url ? '<meta property="og:url" content="https://example.com/page">\n' : ''}${!analysis.openGraph.type ? '<meta property="og:type" content="website">\n' : ''}`
      });
    }
  }
  
  // Meta description recommendations
  if (analysis.description.score === "missing") {
    highPriority.push({
      priority: "high",
      title: "Add Meta Description",
      description: "Add a meta description tag to improve click-through rates from search results. Keep it between 120-160 characters.",
      code: `<meta name="description" content="Your description here - make it compelling and relevant to the page content.">`
    });
  }
  
  // Canonical recommendations
  if (analysis.canonical.score === "missing") {
    mediumPriority.push({
      priority: "medium",
      title: "Add Canonical Tag",
      description: "Add a canonical tag to prevent duplicate content issues and consolidate link signals.",
      code: `<link rel="canonical" href="https://example.com/your-page">`
    });
  }
  
  // Add Structured Data recommendation
  mediumPriority.push({
    priority: "medium",
    title: "Add Structured Data",
    description: "Implement JSON-LD structured data to provide more context about your page content to search engines.",
    code: `<script type="application/ld+json">
{
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Page Title",
  "description": "Page description",
  "url": "https://example.com/page"
}
</script>`
  });
  
  // Image optimization for social
  if (analysis.openGraph.image || analysis.twitter.image) {
    mediumPriority.push({
      priority: "medium",
      title: "Optimize Open Graph Image",
      description: "Resize your Open Graph image to 1200x630 pixels for optimal display across social platforms."
    });
  }
  
  return [...highPriority, ...mediumPriority];
}
