import React from "react";
import { AnalyzedSite } from "@shared/schema";

interface MetaTagsProps {
  result: AnalyzedSite;
}

export default function MetaTags({ result }: MetaTagsProps) {
  const metaTags = result.metaTags as any || {};
  
  // Core meta tags
  const title = metaTags.title?.content || "";
  const description = metaTags.description?.content || "";
  const canonical = metaTags.canonical?.content || "";
  const otherTags = metaTags.other || [];
  const keywords = otherTags.find((tag: any) => tag.name === "keywords")?.content || "";
  
  // Open Graph tags
  const og = metaTags.openGraph || {};
  const ogTitle = og.title || "";
  const ogDescription = og.description || "";
  const ogUrl = og.url || "";
  const ogType = og.type || "";
  const ogImage = og.image || "";
  const ogSiteName = og.siteName || "";
  
  // Twitter tags
  const twitter = metaTags.twitter || {};
  const twitterCard = twitter.card || "";
  const twitterTitle = twitter.title || "";
  const twitterDesc = twitter.description || "";
  const twitterImage = twitter.image || "";
  
  return (
    <>
      <h2 className="text-xl font-semibold text-slate-800 mb-6">Detected Meta Tags</h2>
      
      <div className="space-y-6">
        {/* Core Meta Tags */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium text-slate-700">Core Meta Tags</h3>
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 overflow-x-auto">
            {title || description || canonical || keywords ? (
              <pre className="font-mono text-sm text-slate-800">
                <code>
                  {title ? `<title>${title}</title>\n` : ""}
                  {description ? `<meta name="description" content="${description}">\n` : ""}
                  {keywords ? `<meta name="keywords" content="${keywords}">\n` : ""}
                  {canonical ? `<link rel="canonical" href="${canonical}">` : ""}
                </code>
              </pre>
            ) : (
              <div className="text-center py-8 text-slate-500">
                <span className="material-icons mb-2 text-warning">warning</span>
                <p>No core meta tags detected</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Open Graph Tags */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium text-slate-700">Open Graph Tags</h3>
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 overflow-x-auto">
            {ogTitle || ogDescription || ogUrl || ogType || ogImage || ogSiteName ? (
              <pre className="font-mono text-sm text-slate-800">
                <code>
                  {ogTitle ? `<meta property="og:title" content="${ogTitle}">\n` : ""}
                  {ogDescription ? `<meta property="og:description" content="${ogDescription}">\n` : ""}
                  {ogUrl ? `<meta property="og:url" content="${ogUrl}">\n` : ""}
                  {ogType ? `<meta property="og:type" content="${ogType}">\n` : ""}
                  {ogImage ? `<meta property="og:image" content="${ogImage}">\n` : ""}
                  {ogSiteName ? `<meta property="og:site_name" content="${ogSiteName}">\n` : ""}
                  {(ogImage && !og.imageWidth && !og.imageHeight) ? "<!-- Missing: og:image:width, og:image:height, og:locale -->" : ""}
                </code>
              </pre>
            ) : (
              <div className="text-center py-8 text-slate-500">
                <span className="material-icons mb-2 text-error">error_outline</span>
                <p>No Open Graph meta tags detected</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Twitter Card Tags */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium text-slate-700">Twitter Card Tags</h3>
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 overflow-x-auto">
            {twitterCard || twitterTitle || twitterDesc || twitterImage ? (
              <pre className="font-mono text-sm text-slate-800">
                <code>
                  {twitterCard ? `<meta name="twitter:card" content="${twitterCard}">\n` : ""}
                  {twitterTitle ? `<meta name="twitter:title" content="${twitterTitle}">\n` : ""}
                  {twitterDesc ? `<meta name="twitter:description" content="${twitterDesc}">\n` : ""}
                  {twitterImage ? `<meta name="twitter:image" content="${twitterImage}">` : ""}
                </code>
              </pre>
            ) : (
              <div className="text-center py-8 text-slate-500">
                <span className="material-icons mb-2 text-error">error_outline</span>
                <p>No Twitter Card meta tags detected</p>
              </div>
            )}
          </div>
        </div>
        
        {/* Other SEO Tags */}
        <div className="space-y-3">
          <h3 className="text-lg font-medium text-slate-700">Other SEO-Related Tags</h3>
          <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 overflow-x-auto">
            {otherTags && otherTags.length > 0 ? (
              <pre className="font-mono text-sm text-slate-800">
                <code>
                  {otherTags.map((tag: any, index: number) => (
                    `<meta name="${tag.name}" content="${tag.content}">${index < otherTags.length - 1 ? '\n' : ''}`
                  ))}
                </code>
              </pre>
            ) : (
              <div className="text-center py-8 text-slate-500">
                <span className="material-icons mb-2">info_outline</span>
                <p>No other SEO-related tags detected</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
