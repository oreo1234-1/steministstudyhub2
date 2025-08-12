import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { MessageSquare, Plus, Send, Bot, User } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";

interface ChatSession {
  id: string;
  title: string;
  subject?: string;
  createdAt: string;
  updatedAt: string;
}

interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
}

export function EnhancedTutorChat() {
  const { user } = useAuth();
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  const [newMessage, setNewMessage] = useState("");
  const [newSessionTitle, setNewSessionTitle] = useState("");
  const [newSessionSubject, setNewSessionSubject] = useState("");
  const [showNewSession, setShowNewSession] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();

  // Fetch chat sessions
  const { data: sessions = [], isLoading: loadingSessions } = useQuery({
    queryKey: ["/api/chat/sessions", user?.id],
    queryFn: () => apiRequest(`/api/chat/sessions?userId=${user?.id}`),
    enabled: !!user?.id,
  });

  // Fetch messages for selected session
  const { data: messages = [], isLoading: loadingMessages } = useQuery({
    queryKey: ["/api/chat/sessions", selectedSession, "messages"],
    queryFn: () => apiRequest(`/api/chat/sessions/${selectedSession}/messages`),
    enabled: !!selectedSession,
  });

  // Create new session mutation
  const createSession = useMutation({
    mutationFn: (data: { userId: string; title: string; subject?: string }) =>
      apiRequest("/api/chat/sessions", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: (newSession: any) => {
      queryClient.invalidateQueries({ queryKey: ["/api/chat/sessions"] });
      setSelectedSession(newSession.id);
      setShowNewSession(false);
      setNewSessionTitle("");
      setNewSessionSubject("");
    },
  });

  // Send message mutation
  const sendMessage = useMutation({
    mutationFn: (data: { sessionId: string; message: string }) =>
      apiRequest(`/api/chat/sessions/${data.sessionId}/messages`, {
        method: "POST",
        body: JSON.stringify({ message: data.message }),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["/api/chat/sessions", selectedSession, "messages"],
      });
      setNewMessage("");
    },
  });

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Auto-select first session if none selected
  useEffect(() => {
    if (sessions.length > 0 && !selectedSession) {
      setSelectedSession(sessions[0].id);
    }
  }, [sessions, selectedSession]);

  const handleCreateSession = () => {
    if (!newSessionTitle.trim() || !user?.id) return;
    
    createSession.mutate({
      userId: user.id,
      title: newSessionTitle.trim(),
      subject: newSessionSubject || undefined,
    });
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedSession) return;
    
    sendMessage.mutate({
      sessionId: selectedSession,
      message: newMessage.trim(),
    });
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const subjects = [
    "Mathematics",
    "Physics", 
    "Chemistry",
    "Biology",
    "Computer Science",
    "Engineering",
    "General STEM"
  ];

  return (
    <div className="h-[700px] flex border rounded-lg overflow-hidden bg-card">
      {/* Sidebar */}
      <div className="w-80 border-r bg-muted/20 flex flex-col">
        <div className="p-4 border-b">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-lg">AI Tutor Sessions</h3>
            <Button
              size="sm"
              onClick={() => setShowNewSession(true)}
              data-testid="button-new-session"
            >
              <Plus className="h-4 w-4 mr-1" />
              New
            </Button>
          </div>

          {showNewSession && (
            <Card className="mb-4">
              <CardContent className="p-4 space-y-3">
                <Input
                  placeholder="Session title (e.g., 'Calculus Help')"
                  value={newSessionTitle}
                  onChange={(e) => setNewSessionTitle(e.target.value)}
                  data-testid="input-session-title"
                />
                <Select value={newSessionSubject} onValueChange={setNewSessionSubject}>
                  <SelectTrigger data-testid="select-session-subject">
                    <SelectValue placeholder="Select subject (optional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((subject) => (
                      <SelectItem key={subject} value={subject}>
                        {subject}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={handleCreateSession}
                    disabled={!newSessionTitle.trim() || createSession.isPending}
                    data-testid="button-create-session"
                  >
                    Create
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setShowNewSession(false)}
                    data-testid="button-cancel-session"
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        <ScrollArea className="flex-1">
          <div className="p-2 space-y-2">
            {loadingSessions ? (
              <div className="text-center py-8 text-muted-foreground">
                Loading sessions...
              </div>
            ) : sessions.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No chat sessions yet.</p>
                <p className="text-sm">Create your first session!</p>
              </div>
            ) : (
              sessions.map((session: ChatSession) => (
                <Card
                  key={session.id}
                  className={`cursor-pointer transition-colors hover:bg-accent/50 ${
                    selectedSession === session.id ? "bg-accent" : ""
                  }`}
                  onClick={() => setSelectedSession(session.id)}
                  data-testid={`session-${session.id}`}
                >
                  <CardContent className="p-3">
                    <h4 className="font-medium text-sm truncate">{session.title}</h4>
                    {session.subject && (
                      <p className="text-xs text-muted-foreground mt-1">{session.subject}</p>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      {new Date(session.updatedAt).toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </ScrollArea>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedSession ? (
          <>
            <div className="p-4 border-b bg-background">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    <Bot className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">
                    {sessions.find((s: ChatSession) => s.id === selectedSession)?.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    AI STEM Tutor - Ready to help you learn!
                  </p>
                </div>
              </div>
            </div>

            <ScrollArea className="flex-1 p-4">
              <div className="space-y-4">
                {loadingMessages ? (
                  <div className="text-center py-8 text-muted-foreground">
                    Loading messages...
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Bot className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium">Start Your Learning Journey!</p>
                    <p className="text-sm">
                      Ask me anything about STEM topics. I'm here to help you understand
                      complex concepts step by step!
                    </p>
                  </div>
                ) : (
                  messages.map((message: ChatMessage) => (
                    <div
                      key={message.id}
                      className={`flex gap-3 ${
                        message.role === "user" ? "justify-end" : "justify-start"
                      }`}
                      data-testid={`message-${message.role}-${message.id}`}
                    >
                      {message.role === "assistant" && (
                        <Avatar className="h-8 w-8 mt-1">
                          <AvatarFallback className="bg-primary text-primary-foreground">
                            <Bot className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                      <div
                        className={`max-w-[80%] rounded-lg p-3 ${
                          message.role === "user"
                            ? "bg-primary text-primary-foreground ml-auto"
                            : "bg-muted"
                        }`}
                      >
                        <div className="whitespace-pre-wrap text-sm">
                          {message.content}
                        </div>
                        <div
                          className={`text-xs mt-2 opacity-70 ${
                            message.role === "user" ? "text-primary-foreground" : "text-muted-foreground"
                          }`}
                        >
                          {new Date(message.createdAt).toLocaleTimeString()}
                        </div>
                      </div>
                      {message.role === "user" && (
                        <Avatar className="h-8 w-8 mt-1">
                          <AvatarFallback className="bg-accent text-accent-foreground">
                            <User className="h-4 w-4" />
                          </AvatarFallback>
                        </Avatar>
                      )}
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>
            </ScrollArea>

            <div className="p-4 border-t bg-background">
              <div className="flex gap-2">
                <Input
                  placeholder="Ask your STEM question here..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  disabled={sendMessage.isPending}
                  data-testid="input-chat-message"
                  className="flex-1"
                />
                <Button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim() || sendMessage.isPending}
                  data-testid="button-send-message"
                >
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              {sendMessage.isPending && (
                <p className="text-sm text-muted-foreground mt-2">
                  AI is thinking...
                </p>
              )}
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <MessageSquare className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">Select a Chat Session</p>
              <p className="text-sm">Choose a session to start chatting with your AI tutor</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}