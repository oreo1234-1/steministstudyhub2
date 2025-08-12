import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, FileText, MessageCircle, Calendar, Loader2, Bot } from "lucide-react";
import { useState } from "react";

import { useToast } from "@/components/ui/use-toast";
import { EnhancedTutorChat } from "@/components/EnhancedTutorChat";

const AIStudyTools = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState<string | null>(null);
  const [results, setResults] = useState<any>({});

  const tools = [
    {
      title: "AI Flashcard Generator",
      description: "Paste your notes and get instant flashcards",
      icon: <Brain className="h-8 w-8" />,
      example: "Input: Photosynthesis notes → Output: 10 flashcards with Q&A"
    },
    {
      title: "AI Summarizer", 
      description: "Upload text and get summaries with key points",
      icon: <FileText className="h-8 w-8" />,
      example: "Input: 5-page chapter → Output: 1-page summary + bullet points"
    },
    {
      title: "AI STEM Chatbot",
      description: "Ask questions and get STEM-specific answers",
      icon: <MessageCircle className="h-8 w-8" />,
      example: "Ask: 'Explain Newton's laws' → Get detailed, student-friendly answer"
    },
    {
      title: "Study Plan Builder",
      description: "Enter exam date and topics for AI-built study schedule",
      icon: <Calendar className="h-8 w-8" />,
      example: "Input: Chemistry exam in 2 weeks → Output: Daily study plan"
    }
  ];

  const handleFlashcardGeneration = async (notes: string) => {
    if (!notes.trim()) {
      toast({
        title: "Error",
        description: "Please enter some notes to generate flashcards",
        variant: "destructive",
      });
      return;
    }

    setLoading('flashcards');
    try {
      const response = await fetch('/api/ai/flashcards', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ notes }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate flashcards');
      }

      const data = await response.json();
      setResults((prev: any) => ({ ...prev, flashcards: data.flashcards }));
      toast({
        title: "Success! ✨",
        description: `Generated ${data.flashcards.length} flashcards from your notes`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate flashcards. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  const handleSummarization = async (text: string) => {
    if (!text.trim()) {
      toast({
        title: "Error",
        description: "Please enter text to summarize",
        variant: "destructive",
      });
      return;
    }

    setLoading('summarizer');
    try {
      const response = await fetch('/api/ai/summarizer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate summary');
      }

      const data = await response.json();
      setResults((prev: any) => ({ ...prev, summary: data.summary }));
      toast({
        title: "Success! 📝",
        description: "Generated summary of your text",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate summary. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  const handleChatbot = async (question: string) => {
    if (!question.trim()) {
      toast({
        title: "Error",
        description: "Please enter a question",
        variant: "destructive",
      });
      return;
    }

    setLoading('chatbot');
    try {
      const response = await fetch('/api/ai/chatbot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question }),
      });

      if (!response.ok) {
        throw new Error('Failed to get AI response');
      }

      const data = await response.json();
      setResults((prev: any) => ({ ...prev, chatbotResponse: data.answer }));
      toast({
        title: "Success! 💬",
        description: "Your STEM study buddy has answered your question",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get answer. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  const handleStudyPlan = async (examDate: string, topics: string) => {
    if (!examDate || !topics.trim()) {
      toast({
        title: "Error",
        description: "Please enter both exam date and topics",
        variant: "destructive",
      });
      return;
    }

    setLoading('studyplan');
    try {
      const response = await fetch('/api/ai/study-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ examDate, topics }),
      });

      if (!response.ok) {
        throw new Error('Failed to generate study plan');
      }

      const data = await response.json();
      setResults((prev: any) => ({ ...prev, studyPlan: data.studyPlan }));
      toast({
        title: "Success! 📅",
        description: "Created your personalized study plan",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create study plan. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="font-playfair text-4xl md:text-5xl font-bold text-foreground mb-4">
            AI Study Tools 🤖
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Supercharge your STEM learning with AI-powered study tools designed just for you
          </p>
        </div>

        <Tabs defaultValue="tools" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="tools" data-testid="tab-study-tools">Study Tools</TabsTrigger>
            <TabsTrigger value="tutor" data-testid="tab-ai-tutor">
              <Bot className="h-4 w-4 mr-2" />
              AI Tutor Chat
            </TabsTrigger>
          </TabsList>

          <TabsContent value="tools">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {tools.map((tool, index) => (
                <Card key={index} className="group hover:shadow-lg transition-all duration-300 bg-card border-2 hover:border-accent">
              <CardHeader className="text-center pb-4">
                <div className="mx-auto mb-4 p-4 bg-secondary/20 rounded-full w-fit group-hover:bg-accent/30 transition-colors">
                  <div className="text-primary">
                    {tool.icon}
                  </div>
                </div>
                <CardTitle className="font-playfair text-xl text-foreground">
                  {tool.title}
                </CardTitle>
                <CardDescription className="text-muted-foreground">
                  {tool.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted/50 p-4 rounded-lg">
                  <p className="text-sm text-muted-foreground font-medium mb-2">Example:</p>
                  <p className="text-sm">{tool.example}</p>
                </div>
                
                {tool.title === "AI Flashcard Generator" && (
                  <div className="space-y-3">
                    <Textarea 
                      id="flashcard-notes"
                      placeholder="Paste your notes here..."
                      className="min-h-[100px]"
                    />
                    <Button 
                      className="w-full bg-primary hover:bg-primary/90"
                      onClick={() => {
                        const notes = (document.getElementById('flashcard-notes') as HTMLTextAreaElement)?.value;
                        handleFlashcardGeneration(notes);
                      }}
                      disabled={loading === 'flashcards'}
                    >
                      {loading === 'flashcards' ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        'Generate Flashcards ✨'
                      )}
                    </Button>
                    {results.flashcards && (
                      <div className="mt-4 p-4 bg-secondary/20 rounded-lg">
                        <h4 className="font-semibold mb-2">Generated Flashcards:</h4>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                          {results.flashcards.map((card: any, i: number) => (
                            <div key={i} className="text-sm border rounded p-2">
                              <div className="font-medium">Q: {card.question}</div>
                              <div className="text-muted-foreground">A: {card.answer}</div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {tool.title === "AI Summarizer" && (
                  <div className="space-y-3">
                    <Textarea 
                      id="summarizer-text"
                      placeholder="Paste text to summarize..."
                      className="min-h-[100px]"
                    />
                    <Button 
                      className="w-full bg-primary hover:bg-primary/90"
                      onClick={() => {
                        const text = (document.getElementById('summarizer-text') as HTMLTextAreaElement)?.value;
                        handleSummarization(text);
                      }}
                      disabled={loading === 'summarizer'}
                    >
                      {loading === 'summarizer' ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Summarizing...
                        </>
                      ) : (
                        'Create Summary 📝'
                      )}
                    </Button>
                    {results.summary && (
                      <div className="mt-4 p-4 bg-secondary/20 rounded-lg">
                        <h4 className="font-semibold mb-2">Summary:</h4>
                        <div className="text-sm whitespace-pre-wrap max-h-40 overflow-y-auto">
                          {results.summary}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {tool.title === "AI STEM Chatbot" && (
                  <div className="space-y-3">
                    <Input 
                      id="chatbot-question"
                      placeholder="Ask me anything about STEM..."
                    />
                    <Button 
                      className="w-full bg-primary hover:bg-primary/90"
                      onClick={() => {
                        const question = (document.getElementById('chatbot-question') as HTMLInputElement)?.value;
                        handleChatbot(question);
                      }}
                      disabled={loading === 'chatbot'}
                    >
                      {loading === 'chatbot' ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Thinking...
                        </>
                      ) : (
                        'Ask Question 💬'
                      )}
                    </Button>
                    {results.chatAnswer && (
                      <div className="mt-4 p-4 bg-secondary/20 rounded-lg">
                        <h4 className="font-semibold mb-2">Study Buddy Says:</h4>
                        <div className="text-sm whitespace-pre-wrap max-h-40 overflow-y-auto">
                          {results.chatAnswer}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {tool.title === "Study Plan Builder" && (
                  <div className="space-y-3">
                    <Input 
                      id="exam-date"
                      type="date"
                      placeholder="Exam date"
                    />
                    <Input 
                      id="study-topics"
                      placeholder="Enter topics (e.g., Chemistry, Biology)"
                    />
                    <Button 
                      className="w-full bg-primary hover:bg-primary/90"
                      onClick={() => {
                        const examDate = (document.getElementById('exam-date') as HTMLInputElement)?.value;
                        const topics = (document.getElementById('study-topics') as HTMLInputElement)?.value;
                        handleStudyPlan(examDate, topics);
                      }}
                      disabled={loading === 'studyplan'}
                    >
                      {loading === 'studyplan' ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Creating Plan...
                        </>
                      ) : (
                        'Build Study Plan 📅'
                      )}
                    </Button>
                    {results.studyPlan && (
                      <div className="mt-4 p-4 bg-secondary/20 rounded-lg">
                        <h4 className="font-semibold mb-2">Your Study Plan:</h4>
                        <div className="text-sm max-h-40 overflow-y-auto">
                          {results.studyPlan.studyPlan ? (
                            <div className="space-y-2">
                              {results.studyPlan.studyPlan.slice(0, 3).map((day: any, i: number) => (
                                <div key={i} className="border rounded p-2">
                                  <div className="font-medium">Day {day.day}: {day.topic}</div>
                                  <div className="text-xs text-muted-foreground">{day.estimatedTime}</div>
                                </div>
                              ))}
                              {results.studyPlan.studyPlan.length > 3 && (
                                <div className="text-xs text-muted-foreground">
                                  ... and {results.studyPlan.studyPlan.length - 3} more days
                                </div>
                              )}
                            </div>
                          ) : (
                            <div className="whitespace-pre-wrap">{results.studyPlan.rawResponse}</div>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="tutor">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-6">
                <h2 className="font-playfair text-2xl font-bold text-foreground mb-2">
                  Enhanced AI Tutor with Memory
                </h2>
                <p className="text-muted-foreground">
                  Start persistent chat sessions that remember your conversation history and learning progress
                </p>
              </div>
              <EnhancedTutorChat />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AIStudyTools;