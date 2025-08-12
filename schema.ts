import { pgTable, text, uuid, integer, boolean, timestamp, date, jsonb, pgEnum } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Create app_role enum
export const appRoleEnum = pgEnum('app_role', ['student', 'mentor', 'admin']);

// Profiles table
export const profiles = pgTable("profiles", {
  id: uuid("id").primaryKey(),
  email: text("email").notNull(),
  fullName: text("full_name"),
  avatarUrl: text("avatar_url"),
  bio: text("bio"),
  role: appRoleEnum("role").default('student'),
  interests: text("interests").array(),
  stemGoals: text("stem_goals"),
  portfolioData: jsonb("portfolio_data").default({}),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow()
});

// Study materials table
export const studyMaterials = pgTable("study_materials", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description"),
  fileUrl: text("file_url"),
  fileType: text("file_type"),
  subject: text("subject").notNull(),
  difficultyLevel: text("difficulty_level").default('beginner'),
  tags: text("tags").array(),
  uploadedBy: uuid("uploaded_by"),
  downloadsCount: integer("downloads_count").default(0),
  viewsCount: integer("views_count").default(0),
  isApproved: boolean("is_approved").default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow()
});

// Forum posts table
export const forumPosts = pgTable("forum_posts", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  authorId: uuid("author_id"),
  category: text("category").notNull(),
  tags: text("tags").array(),
  upvotesCount: integer("upvotes_count").default(0),
  commentsCount: integer("comments_count").default(0),
  isPinned: boolean("is_pinned").default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow()
});

// Forum comments table
export const forumComments = pgTable("forum_comments", {
  id: uuid("id").primaryKey().defaultRandom(),
  postId: uuid("post_id"),
  authorId: uuid("author_id"),
  content: text("content").notNull(),
  upvotesCount: integer("upvotes_count").default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow()
});

// User points table
export const userPoints = pgTable("user_points", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id"),
  points: integer("points").default(0),
  currentLevel: integer("current_level").default(1),
  totalEarned: integer("total_earned").default(0),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow()
});

// Chat sessions table for AI tutor
export const chatSessions = pgTable("chat_sessions", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  title: text("title").notNull(),
  subject: text("subject"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow()
});

// Chat messages table
export const chatMessages = pgTable("chat_messages", {
  id: uuid("id").primaryKey().defaultRandom(),
  sessionId: uuid("session_id").notNull(),
  role: text("role").notNull(), // 'user' or 'assistant'
  content: text("content").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow()
});

// Badges table
export const badges = pgTable("badges", {
  id: uuid("id").primaryKey().defaultRandom(),
  name: text("name").notNull().unique(),
  description: text("description"),
  icon: text("icon"),
  rarity: text("rarity").default('common'),
  pointsRequired: integer("points_required").default(0),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow()
});

// User badges table
export const userBadges = pgTable("user_badges", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id"),
  badgeId: uuid("badge_id"),
  earnedAt: timestamp("earned_at", { withTimezone: true }).defaultNow()
});

// Quizzes table
export const quizzes = pgTable("quizzes", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description"),
  subject: text("subject").notNull(),
  difficultyLevel: text("difficulty_level").default('beginner'),
  questions: jsonb("questions").notNull(),
  passingScore: integer("passing_score").default(70),
  createdBy: uuid("created_by"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow()
});

// User quiz results table
export const userQuizResults = pgTable("user_quiz_results", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id"),
  quizId: uuid("quiz_id"),
  score: integer("score").notNull(),
  answers: jsonb("answers"),
  completedAt: timestamp("completed_at", { withTimezone: true }).defaultNow()
});

// Workshops table
export const workshops = pgTable("workshops", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description"),
  instructorName: text("instructor_name"),
  scheduledAt: timestamp("scheduled_at", { withTimezone: true }).notNull(),
  durationMinutes: integer("duration_minutes").default(60),
  maxParticipants: integer("max_participants"),
  currentParticipants: integer("current_participants").default(0),
  meetingLink: text("meeting_link"),
  tags: text("tags").array(),
  isRecorded: boolean("is_recorded").default(false),
  recordingUrl: text("recording_url"),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow()
});

// Workshop registrations table
export const workshopRegistrations = pgTable("workshop_registrations", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id"),
  workshopId: uuid("workshop_id"),
  attended: boolean("attended").default(false),
  registeredAt: timestamp("registered_at", { withTimezone: true }).defaultNow()
});

// Opportunities table
export const opportunities = pgTable("opportunities", {
  id: uuid("id").primaryKey().defaultRandom(),
  title: text("title").notNull(),
  description: text("description"),
  type: text("type").notNull(),
  deadline: date("deadline"),
  eligibility: text("eligibility").array(),
  tags: text("tags").array(),
  externalUrl: text("external_url"),
  amount: text("amount"),
  organization: text("organization"),
  isFeatured: boolean("is_featured").default(false),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow()
});

// User activity table
export const userActivity = pgTable("user_activity", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id"),
  activityType: text("activity_type").notNull(),
  pointsEarned: integer("points_earned").default(0),
  metadata: jsonb("metadata").default({}),
  createdAt: timestamp("created_at", { withTimezone: true }).defaultNow()
});

// Insert schemas
export const insertProfileSchema = createInsertSchema(profiles).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export const insertChatSessionSchema = createInsertSchema(chatSessions).omit({
  id: true,
  createdAt: true,
  updatedAt: true
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({
  id: true,
  createdAt: true
});

export const insertStudyMaterialSchema = createInsertSchema(studyMaterials).omit({
  id: true,
  createdAt: true,
  downloadsCount: true,
  viewsCount: true,
  isApproved: true
});

export const insertForumPostSchema = createInsertSchema(forumPosts).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  upvotesCount: true,
  commentsCount: true,
  isPinned: true
});

export const insertQuizSchema = createInsertSchema(quizzes).omit({
  id: true,
  createdAt: true
});

export const insertWorkshopSchema = createInsertSchema(workshops).omit({
  id: true,
  createdAt: true,
  currentParticipants: true
});

export const insertOpportunitySchema = createInsertSchema(opportunities).omit({
  id: true,
  createdAt: true,
  isFeatured: true
});

// Types
export type InsertProfile = z.infer<typeof insertProfileSchema>;
export type Profile = typeof profiles.$inferSelect;

export type InsertStudyMaterial = z.infer<typeof insertStudyMaterialSchema>;
export type StudyMaterial = typeof studyMaterials.$inferSelect;

export type InsertForumPost = z.infer<typeof insertForumPostSchema>;
export type ForumPost = typeof forumPosts.$inferSelect;

export type InsertQuiz = z.infer<typeof insertQuizSchema>;
export type Quiz = typeof quizzes.$inferSelect;

export type InsertWorkshop = z.infer<typeof insertWorkshopSchema>;
export type Workshop = typeof workshops.$inferSelect;

export type InsertOpportunity = z.infer<typeof insertOpportunitySchema>;
export type Opportunity = typeof opportunities.$inferSelect;

export type UserPoint = typeof userPoints.$inferSelect;
export type Badge = typeof badges.$inferSelect;
export type UserActivity = typeof userActivity.$inferSelect;
