import { 
  users, type User, type InsertUser,
  analyzedSites, type AnalyzedSite, type InsertAnalyzedSite,
  type MetaTagAnalysis, type Issue, type Recommendation
} from "@shared/schema";

// Extend the interface with CRUD methods for analyzed sites
export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Add methods for analyzed sites
  getAnalyzedSite(id: number): Promise<AnalyzedSite | undefined>;
  getAnalyzedSiteByUrl(url: string): Promise<AnalyzedSite | undefined>;
  createAnalyzedSite(site: InsertAnalyzedSite): Promise<AnalyzedSite>;
  listRecentAnalyzedSites(limit: number): Promise<AnalyzedSite[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private analyzedSites: Map<number, AnalyzedSite>;
  currentUserId: number;
  currentSiteId: number;

  constructor() {
    this.users = new Map();
    this.analyzedSites = new Map();
    this.currentUserId = 1;
    this.currentSiteId = 1;
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentUserId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  // Analyzed Sites methods
  async getAnalyzedSite(id: number): Promise<AnalyzedSite | undefined> {
    return this.analyzedSites.get(id);
  }

  async getAnalyzedSiteByUrl(url: string): Promise<AnalyzedSite | undefined> {
    return Array.from(this.analyzedSites.values()).find(
      (site) => site.url === url,
    );
  }

  async createAnalyzedSite(insertSite: InsertAnalyzedSite): Promise<AnalyzedSite> {
    const id = this.currentSiteId++;
    
    // Ensure all required properties are present with proper types
    const site: AnalyzedSite = { 
      id,
      url: insertSite.url,
      title: insertSite.title || null,
      description: insertSite.description || null,
      canonical: insertSite.canonical || null,
      ogTitle: insertSite.ogTitle || null,
      ogDescription: insertSite.ogDescription || null,
      ogImage: insertSite.ogImage || null,
      ogUrl: insertSite.ogUrl || null,
      ogType: insertSite.ogType || null,
      ogSiteName: insertSite.ogSiteName || null,
      twitterCard: insertSite.twitterCard || null,
      twitterTitle: insertSite.twitterTitle || null,
      twitterDescription: insertSite.twitterDescription || null,
      twitterImage: insertSite.twitterImage || null,
      metaTags: insertSite.metaTags || null,
      issues: insertSite.issues || [],
      recommendations: insertSite.recommendations || [],
      scoreTitle: insertSite.scoreTitle || "missing",
      scoreDescription: insertSite.scoreDescription || "missing",
      scoreOpenGraph: insertSite.scoreOpenGraph || "missing",
      scoreTwitter: insertSite.scoreTwitter || "missing",
      analyzedAt: insertSite.analyzedAt
    };
    
    this.analyzedSites.set(id, site);
    return site;
  }

  async listRecentAnalyzedSites(limit: number): Promise<AnalyzedSite[]> {
    const sites = Array.from(this.analyzedSites.values());
    return sites
      .sort((a, b) => {
        // Sort by analyzedAt in descending order (newest first)
        const dateA = a.analyzedAt instanceof Date ? a.analyzedAt : new Date(a.analyzedAt as string);
        const dateB = b.analyzedAt instanceof Date ? b.analyzedAt : new Date(b.analyzedAt as string);
        return dateB.getTime() - dateA.getTime();
      })
      .slice(0, limit);
  }
}

export const storage = new MemStorage();
