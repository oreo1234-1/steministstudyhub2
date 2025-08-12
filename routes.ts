import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";
import { insertProfileSchema, insertForumPostSchema, insertStudyMaterialSchema, insertWorkshopSchema } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Profile routes
  app.get("/api/profiles/:id", async (req, res) => {
    try {
      const profile = await storage.getProfile(req.params.id);
      if (!profile) {
        return res.status(404).json({ error: "Profile not found" });
      }
      res.json(profile);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch profile" });
    }
  });

  app.get("/api/profiles/email/:email", async (req, res) => {
    try {
      const profile = await storage.getProfileByEmail(req.params.email);
      if (!profile) {
        return res.status(404).json({ error: "Profile not found" });
      }
      res.json(profile);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch profile" });
    }
  });

  app.post("/api/profiles", async (req, res) => {
    try {
      const validatedData = insertProfileSchema.parse(req.body);
      const profile = await storage.createProfile(validatedData);
      res.status(201).json(profile);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create profile" });
    }
  });

  app.put("/api/profiles/:id", async (req, res) => {
    try {
      const profile = await storage.updateProfile(req.params.id, req.body);
      res.json(profile);
    } catch (error) {
      res.status(500).json({ error: "Failed to update profile" });
    }
  });

  // Study materials routes
  app.get("/api/study-materials", async (req, res) => {
    try {
      const materials = await storage.getStudyMaterials();
      res.json(materials);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch study materials" });
    }
  });

  app.get("/api/study-materials/subject/:subject", async (req, res) => {
    try {
      const materials = await storage.getStudyMaterialsBySubject(req.params.subject);
      res.json(materials);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch study materials" });
    }
  });

  app.post("/api/study-materials", async (req, res) => {
    try {
      const validatedData = insertStudyMaterialSchema.parse(req.body);
      const material = await storage.createStudyMaterial(validatedData);
      res.status(201).json(material);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create study material" });
    }
  });

  // Forum routes
  app.get("/api/forum/posts", async (req, res) => {
    try {
      const { category } = req.query;
      const posts = category 
        ? await storage.getForumPostsByCategory(category as string)
        : await storage.getForumPosts();
      res.json(posts);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch forum posts" });
    }
  });

  app.post("/api/forum/posts", async (req, res) => {
    try {
      const validatedData = insertForumPostSchema.parse(req.body);
      const post = await storage.createForumPost(validatedData);
      res.status(201).json(post);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create forum post" });
    }
  });

  // Workshop routes
  app.get("/api/workshops", async (req, res) => {
    try {
      const workshops = await storage.getWorkshops();
      res.json(workshops);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch workshops" });
    }
  });

  app.get("/api/workshops/upcoming", async (req, res) => {
    try {
      const workshops = await storage.getUpcomingWorkshops();
      res.json(workshops);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch upcoming workshops" });
    }
  });

  app.post("/api/workshops", async (req, res) => {
    try {
      const validatedData = insertWorkshopSchema.parse(req.body);
      const workshop = await storage.createWorkshop(validatedData);
      res.status(201).json(workshop);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ error: "Invalid data", details: error.errors });
      }
      res.status(500).json({ error: "Failed to create workshop" });
    }
  });

  // Quiz routes
  app.get("/api/quizzes", async (req, res) => {
    try {
      const quizzes = await storage.getQuizzes();
      res.json(quizzes);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch quizzes" });
    }
  });

  // Opportunity routes
  app.get("/api/opportunities", async (req, res) => {
    try {
      const opportunities = await storage.getOpportunities();
      res.json(opportunities);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch opportunities" });
    }
  });

  // User data routes
  app.get("/api/users/:userId/points", async (req, res) => {
    try {
      const points = await storage.getUserPoints(req.params.userId);
      res.json(points);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user points" });
    }
  });

  app.get("/api/users/:userId/badges", async (req, res) => {
    try {
      const badges = await storage.getUserBadges(req.params.userId);
      res.json(badges);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user badges" });
    }
  });

  app.get("/api/users/:userId/activity", async (req, res) => {
    try {
      const activity = await storage.getUserActivity(req.params.userId);
      res.json(activity);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch user activity" });
    }
  });

  // AI-powered features routes
  app.post("/api/ai/flashcards", async (req, res) => {
    try {
      const { notes } = req.body;
      
      if (!notes) {
        return res.status(400).json({ error: "Notes content is required" });
      }

      const openAIApiKey = process.env.OPENAI_API_KEY;
      if (!openAIApiKey) {
        return res.status(500).json({ error: "OpenAI API key not configured" });
      }

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o', // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
          messages: [
            {
              role: 'system',
              content: `You are a helpful AI that creates flashcards from study notes. 
              Create 8-12 flashcards from the provided notes. 
              Return the response as a JSON array with objects containing "question" and "answer" fields.
              Focus on key concepts, definitions, formulas, and important facts.
              Make questions clear and answers concise but complete.`
            },
            {
              role: 'user',
              content: `Create flashcards from these notes: ${notes}`
            }
          ],
          temperature: 0.7,
          max_tokens: 2000,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`);
      }

      const data = await response.json();
      const flashcardsText = data.choices[0].message.content;
      
      // Try to parse as JSON, fallback to structured text
      let flashcards;
      try {
        flashcards = JSON.parse(flashcardsText);
      } catch {
        // If not valid JSON, create flashcards from the response
        const lines = flashcardsText.split('\n').filter((line: string) => line.trim());
        flashcards = [];
        for (let i = 0; i < lines.length; i += 2) {
          if (lines[i] && lines[i + 1]) {
            flashcards.push({
              question: lines[i].replace(/^\d+\.?\s*/, '').replace(/^Q:\s*/, ''),
              answer: lines[i + 1].replace(/^A:\s*/, '')
            });
          }
        }
      }

      res.json({ flashcards });
    } catch (error) {
      console.error('Error in AI flashcards:', error);
      res.status(500).json({ error: "Failed to generate flashcards" });
    }
  });

  app.post("/api/ai/summarizer", async (req, res) => {
    try {
      const { text } = req.body;
      
      if (!text) {
        return res.status(400).json({ error: "Text content is required" });
      }

      const openAIApiKey = process.env.OPENAI_API_KEY;
      if (!openAIApiKey) {
        return res.status(500).json({ error: "OpenAI API key not configured" });
      }

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o', // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
          messages: [
            {
              role: 'system',
              content: `You are a helpful AI that creates concise summaries of academic text. 
              Create a well-structured summary with:
              1. A brief overview paragraph
              2. Key points as bullet points
              3. Important concepts or definitions
              4. Any formulas or key facts
              
              Keep the summary clear, organized, and easy to study from.`
            },
            {
              role: 'user',
              content: `Summarize this text: ${text}`
            }
          ],
          temperature: 0.3,
          max_tokens: 1500,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`);
      }

      const data = await response.json();
      const summary = data.choices[0].message.content;

      res.json({ summary });
    } catch (error) {
      console.error('Error in AI summarizer:', error);
      res.status(500).json({ error: "Failed to generate summary" });
    }
  });

  // Enhanced AI tutor chat with memory
  app.get("/api/chat/sessions", async (req, res) => {
    try {
      const userId = req.query.userId as string;
      
      if (!userId) {
        return res.status(400).json({ error: "User ID is required" });
      }

      const sessions = await storage.getChatSessions(userId);
      res.json(sessions);
    } catch (error) {
      console.error('Error fetching chat sessions:', error);
      res.status(500).json({ error: "Failed to fetch chat sessions" });
    }
  });

  app.post("/api/chat/sessions", async (req, res) => {
    try {
      const { userId, title, subject } = req.body;
      
      if (!userId || !title) {
        return res.status(400).json({ error: "User ID and title are required" });
      }

      const session = await storage.createChatSession(userId, title, subject);
      res.json(session);
    } catch (error) {
      console.error('Error creating chat session:', error);
      res.status(500).json({ error: "Failed to create chat session" });
    }
  });

  app.get("/api/chat/sessions/:sessionId/messages", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const messages = await storage.getChatMessages(sessionId);
      res.json(messages);
    } catch (error) {
      console.error('Error fetching chat messages:', error);
      res.status(500).json({ error: "Failed to fetch chat messages" });
    }
  });

  app.post("/api/chat/sessions/:sessionId/messages", async (req, res) => {
    try {
      const { sessionId } = req.params;
      const { message } = req.body;
      
      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      const openAIApiKey = process.env.OPENAI_API_KEY;
      if (!openAIApiKey) {
        return res.status(500).json({ error: "OpenAI API key not configured" });
      }

      // Save user message
      await storage.addChatMessage(sessionId, 'user', message);

      // Get chat history for context
      const chatHistory = await storage.getChatMessages(sessionId);
      
      // Build messages array for OpenAI with context
      const messages = [
        {
          role: 'system',
          content: `You are an encouraging and knowledgeable STEM study buddy for high school and college students, especially focused on supporting women and underrepresented groups in STEM. 

          Your personality:
          - Supportive and encouraging
          - Patient and understanding
          - Explains concepts clearly with examples
          - Breaks down complex topics into digestible parts
          - Celebrates learning progress
          - Relates concepts to real-world applications
          
          Your expertise covers:
          - Mathematics (algebra, calculus, statistics)
          - Physics (mechanics, thermodynamics, electromagnetism)
          - Chemistry (organic, inorganic, biochemistry)
          - Biology (molecular, cellular, ecology)
          - Computer Science (programming, algorithms, data structures)
          - Engineering concepts
          
          Always:
          - Encourage the student
          - Provide step-by-step explanations
          - Use examples and analogies
          - Suggest study strategies
          - Ask follow-up questions to check understanding
          - Remember previous conversations in this session for context`
        },
        // Add chat history for context (limit to last 10 messages to stay within token limits)
        ...chatHistory.slice(-10).map((msg: any) => ({
          role: msg.role,
          content: msg.content
        }))
      ];

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o', // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
          messages,
          temperature: 0.7,
          max_tokens: 1000,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`);
      }

      const data = await response.json();
      const aiResponse = data.choices[0].message.content;

      // Save AI response
      await storage.addChatMessage(sessionId, 'assistant', aiResponse);

      res.json({ response: aiResponse });
    } catch (error) {
      console.error('Error in AI chat:', error);
      res.status(500).json({ error: "Failed to get AI response" });
    }
  });

  // Keep the legacy chatbot endpoint for backward compatibility
  app.post("/api/ai/chatbot", async (req, res) => {
    try {
      const { question } = req.body;
      
      if (!question) {
        return res.status(400).json({ error: "Question is required" });
      }

      const openAIApiKey = process.env.OPENAI_API_KEY;
      if (!openAIApiKey) {
        return res.status(500).json({ error: "OpenAI API key not configured" });
      }

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o', // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
          messages: [
            {
              role: 'system',
              content: `You are an encouraging and knowledgeable STEM study buddy for high school and college students, especially focused on supporting women and underrepresented groups in STEM. 

              Your personality:
              - Supportive and encouraging
              - Patient and understanding
              - Explains concepts clearly with examples
              - Breaks down complex topics into digestible parts
              - Celebrates learning progress
              - Relates concepts to real-world applications
              
              Your expertise covers:
              - Mathematics (algebra, calculus, statistics)
              - Physics (mechanics, thermodynamics, electromagnetism)
              - Chemistry (organic, inorganic, biochemistry)
              - Biology (molecular, cellular, ecology)
              - Computer Science (programming, algorithms, data structures)
              - Engineering concepts
              
              Always:
              - Encourage the student
              - Provide step-by-step explanations
              - Use examples and analogies
              - Suggest study strategies
              - Ask follow-up questions to check understanding`
            },
            {
              role: 'user',
              content: question
            }
          ],
          temperature: 0.7,
          max_tokens: 1000,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`);
      }

      const data = await response.json();
      const answer = data.choices[0].message.content;

      res.json({ answer });
    } catch (error) {
      console.error('Error in AI chatbot:', error);
      res.status(500).json({ error: "Failed to get AI response" });
    }
  });

  app.post("/api/ai/study-plan", async (req, res) => {
    try {
      const { examDate, topics } = req.body;
      
      if (!examDate || !topics) {
        return res.status(400).json({ error: "Exam date and topics are required" });
      }

      const openAIApiKey = process.env.OPENAI_API_KEY;
      if (!openAIApiKey) {
        return res.status(500).json({ error: "OpenAI API key not configured" });
      }

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o', // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
          messages: [
            {
              role: 'system',
              content: `You are a helpful AI that creates personalized study plans for STEM students. 
              Create a detailed, day-by-day study plan with:
              1. Clear daily goals and topics to cover
              2. Time allocation for each topic
              3. Study techniques and resources
              4. Review sessions and practice problems
              5. Self-assessment checkpoints
              
              Make the plan realistic, achievable, and tailored to the exam date and topics provided.`
            },
            {
              role: 'user',
              content: `Create a study plan for an exam on ${examDate} covering these topics: ${topics}`
            }
          ],
          temperature: 0.3,
          max_tokens: 2000,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenAI API error: ${response.statusText}`);
      }

      const data = await response.json();
      const studyPlan = data.choices[0].message.content;

      res.json({ studyPlan });
    } catch (error) {
      console.error('Error in AI study plan:', error);
      res.status(500).json({ error: "Failed to generate study plan" });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
