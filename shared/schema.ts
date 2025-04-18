import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Keeping the users table as it might be needed later
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

// Create a table for analyzed websites
export const analyzedSites = pgTable("analyzed_sites", {
  id: serial("id").primaryKey(),
  url: text("url").notNull(),
  title: text("title"),
  description: text("description"),
  canonical: text("canonical"),
  ogTitle: text("og_title"),
  ogDescription: text("og_description"),
  ogImage: text("og_image"),
  ogUrl: text("og_url"),
  ogType: text("og_type"),
  ogSiteName: text("og_site_name"),
  twitterCard: text("twitter_card"),
  twitterTitle: text("twitter_title"),
  twitterDescription: text("twitter_description"),
  twitterImage: text("twitter_image"),
  metaTags: jsonb("meta_tags"),
  issues: jsonb("issues"),
  recommendations: jsonb("recommendations"),
  scoreTitle: text("score_title"),
  scoreDescription: text("score_description"),
  scoreOpenGraph: text("score_open_graph"),
  scoreTwitter: text("score_twitter"),
  analyzedAt: timestamp("analyzed_at").notNull(),
});

export const insertAnalyzedSiteSchema = createInsertSchema(analyzedSites).omit({
  id: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertAnalyzedSite = z.infer<typeof insertAnalyzedSiteSchema>;
export type AnalyzedSite = typeof analyzedSites.$inferSelect;

// Define the score types
export type ScoreType = "excellent" | "good" | "needs-work" | "missing";

// Define the structure for meta tag analysis
export interface MetaTagAnalysis {
  title: {
    content: string;
    length: number;
    score: ScoreType;
  };
  description: {
    content: string;
    length: number;
    score: ScoreType;
  };
  canonical: {
    content: string;
    score: ScoreType;
  };
  openGraph: {
    title: string;
    description: string;
    image: string;
    url: string;
    type: string;
    siteName: string;
    score: ScoreType;
  };
  twitter: {
    card: string;
    title: string;
    description: string;
    image: string;
    score: ScoreType;
  };
  other: Record<string, string>[];
}

// Define the structure for issues
export interface Issue {
  severity: "error" | "warning" | "info";
  title: string;
  description: string;
  fixLink?: string;
}

// Define the structure for recommendations
export interface Recommendation {
  priority: "high" | "medium" | "low";
  title: string;
  description: string;
  code?: string;
}
