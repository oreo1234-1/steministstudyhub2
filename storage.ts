import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as schema from "@shared/schema";
import type { 
  Profile, InsertProfile,
  StudyMaterial, InsertStudyMaterial,
  ForumPost, InsertForumPost,
  Workshop, InsertWorkshop,
  Quiz, InsertQuiz,
  Opportunity, InsertOpportunity,
  UserPoint, Badge, UserActivity
} from "@shared/schema";
import { eq, desc } from "drizzle-orm";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

export interface IStorage {
  // Profile methods
  getProfile(id: string): Promise<Profile | undefined>;
  getProfileByEmail(email: string): Promise<Profile | undefined>;
  createProfile(profile: InsertProfile): Promise<Profile>;
  updateProfile(id: string, profile: Partial<InsertProfile>): Promise<Profile>;
  
  // Study material methods
  getStudyMaterials(): Promise<StudyMaterial[]>;
  getStudyMaterialsBySubject(subject: string): Promise<StudyMaterial[]>;
  createStudyMaterial(material: InsertStudyMaterial): Promise<StudyMaterial>;
  
  // Forum methods
  getForumPosts(): Promise<ForumPost[]>;
  getForumPostsByCategory(category: string): Promise<ForumPost[]>;
  createForumPost(post: InsertForumPost): Promise<ForumPost>;
  
  // Workshop methods
  getWorkshops(): Promise<Workshop[]>;
  getUpcomingWorkshops(): Promise<Workshop[]>;
  createWorkshop(workshop: InsertWorkshop): Promise<Workshop>;
  
  // Quiz methods
  getQuizzes(): Promise<Quiz[]>;
  createQuiz(quiz: InsertQuiz): Promise<Quiz>;
  
  // Opportunity methods
  getOpportunities(): Promise<Opportunity[]>;
  createOpportunity(opportunity: InsertOpportunity): Promise<Opportunity>;
  
  // User points and badges
  getUserPoints(userId: string): Promise<UserPoint | undefined>;
  getUserBadges(userId: string): Promise<Badge[]>;
  getUserActivity(userId: string): Promise<UserActivity[]>;
  
  // Chat session methods
  getChatSessions(userId: string): Promise<any[]>;
  createChatSession(userId: string, title: string, subject?: string): Promise<any>;
  getChatMessages(sessionId: string): Promise<any[]>;
  addChatMessage(sessionId: string, role: string, content: string): Promise<any>;
}

export class DatabaseStorage implements IStorage {
  // Profile methods
  async getProfile(id: string): Promise<Profile | undefined> {
    const result = await db.select().from(schema.profiles).where(eq(schema.profiles.id, id));
    return result[0];
  }

  async getProfileByEmail(email: string): Promise<Profile | undefined> {
    const result = await db.select().from(schema.profiles).where(eq(schema.profiles.email, email));
    return result[0];
  }

  async createProfile(profile: InsertProfile): Promise<Profile> {
    const result = await db.insert(schema.profiles).values(profile).returning();
    return result[0];
  }

  async updateProfile(id: string, profile: Partial<InsertProfile>): Promise<Profile> {
    const result = await db.update(schema.profiles).set(profile).where(eq(schema.profiles.id, id)).returning();
    return result[0];
  }

  // Study material methods
  async getStudyMaterials(): Promise<StudyMaterial[]> {
    return await db.select().from(schema.studyMaterials).where(eq(schema.studyMaterials.isApproved, true));
  }

  async getStudyMaterialsBySubject(subject: string): Promise<StudyMaterial[]> {
    return await db.select().from(schema.studyMaterials)
      .where(eq(schema.studyMaterials.subject, subject));
  }

  async createStudyMaterial(material: InsertStudyMaterial): Promise<StudyMaterial> {
    const result = await db.insert(schema.studyMaterials).values(material).returning();
    return result[0];
  }

  // Forum methods
  async getForumPosts(): Promise<ForumPost[]> {
    return await db.select().from(schema.forumPosts).orderBy(desc(schema.forumPosts.createdAt));
  }

  async getForumPostsByCategory(category: string): Promise<ForumPost[]> {
    return await db.select().from(schema.forumPosts)
      .where(eq(schema.forumPosts.category, category))
      .orderBy(desc(schema.forumPosts.createdAt));
  }

  async createForumPost(post: InsertForumPost): Promise<ForumPost> {
    const result = await db.insert(schema.forumPosts).values(post).returning();
    return result[0];
  }

  // Workshop methods
  async getWorkshops(): Promise<Workshop[]> {
    return await db.select().from(schema.workshops).orderBy(desc(schema.workshops.scheduledAt));
  }

  async getUpcomingWorkshops(): Promise<Workshop[]> {
    return await db.select().from(schema.workshops)
      .where(eq(schema.workshops.scheduledAt, new Date()))
      .orderBy(schema.workshops.scheduledAt);
  }

  async createWorkshop(workshop: InsertWorkshop): Promise<Workshop> {
    const result = await db.insert(schema.workshops).values(workshop).returning();
    return result[0];
  }

  // Quiz methods
  async getQuizzes(): Promise<Quiz[]> {
    return await db.select().from(schema.quizzes).orderBy(desc(schema.quizzes.createdAt));
  }

  async createQuiz(quiz: InsertQuiz): Promise<Quiz> {
    const result = await db.insert(schema.quizzes).values(quiz).returning();
    return result[0];
  }

  // Opportunity methods
  async getOpportunities(): Promise<Opportunity[]> {
    return await db.select().from(schema.opportunities).orderBy(desc(schema.opportunities.createdAt));
  }

  async createOpportunity(opportunity: InsertOpportunity): Promise<Opportunity> {
    const result = await db.insert(schema.opportunities).values(opportunity).returning();
    return result[0];
  }

  // User points and badges
  async getUserPoints(userId: string): Promise<UserPoint | undefined> {
    const result = await db.select().from(schema.userPoints).where(eq(schema.userPoints.userId, userId));
    return result[0];
  }

  async getUserBadges(userId: string): Promise<Badge[]> {
    const result = await db.select({
      badge: schema.badges
    })
    .from(schema.userBadges)
    .innerJoin(schema.badges, eq(schema.userBadges.badgeId, schema.badges.id))
    .where(eq(schema.userBadges.userId, userId));
    
    return result.map(r => r.badge);
  }

  async getUserActivity(userId: string): Promise<UserActivity[]> {
    return await db.select().from(schema.userActivity)
      .where(eq(schema.userActivity.userId, userId))
      .orderBy(desc(schema.userActivity.createdAt));
  }

  // Chat session methods
  async getChatSessions(userId: string): Promise<any[]> {
    return await db.select().from(schema.chatSessions)
      .where(eq(schema.chatSessions.userId, userId))
      .orderBy(desc(schema.chatSessions.updatedAt));
  }

  async createChatSession(userId: string, title: string, subject?: string): Promise<any> {
    const result = await db.insert(schema.chatSessions).values({
      userId,
      title,
      subject
    }).returning();
    return result[0];
  }

  async getChatMessages(sessionId: string): Promise<any[]> {
    return await db.select().from(schema.chatMessages)
      .where(eq(schema.chatMessages.sessionId, sessionId))
      .orderBy(schema.chatMessages.createdAt);
  }

  async addChatMessage(sessionId: string, role: string, content: string): Promise<any> {
    const result = await db.insert(schema.chatMessages).values({
      sessionId,
      role,
      content
    }).returning();
    return result[0];
  }
}

export const storage = new DatabaseStorage();
