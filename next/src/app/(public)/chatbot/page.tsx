"use client";

import { ChatSidebar } from "@/components/ui/chat/chat-sidebar";
import { ChatHeader } from "@/components/ui/chat/chat-header";
import {
  ChatBubble,
  ChatBubbleAction,
  ChatBubbleAvatar,
  ChatBubbleMessage,
} from "@/components/ui/chat/chat-bubble";
import { ChatInput } from "@/components/ui/chat/chat-input";
import { ChatMessageList } from "@/components/ui/chat/chat-message-list";
import { Button } from "@/components/ui/button";
import {
  CopyIcon,
  CornerDownLeft,
  Mic,
  Paperclip,
  RefreshCcw,
  Send,
  Volume2,
} from "lucide-react";
import { useChat } from "ai/react";
import { useEffect, useRef, useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import CodeDisplayBlock from "@/components/code-display-block";

interface User {
  id: string;
  name: string;
  avatar?: string;
  status: "online" | "offline";
  lastActive: string;
}

const MOCK_USERS: User[] = [
  {
    id: "1",
    name: "Jane Doe",
    status: "online",
    lastActive: "2 mins ago",
  },
  {
    id: "2",
    name: "John Smith",
    status: "offline",
    lastActive: "1 hour ago",
  },
];

interface Message {
  role: "user" | "assistant";
  content: string;
}

export default function ChatPage() {
  const [selectedUser, setSelectedUser] = useState<User>(MOCK_USERS[0]);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const {
    messages,
    setMessages,
    input,
    handleInputChange,
    handleSubmit,
    isLoading,
    reload,
  } = useChat({
    onResponse(response: any) {
      if (response) {
        setIsGenerating(false);
      }
    },
    onError(error: Error) {
      if (error) {
        setIsGenerating(false);
      }
    },
  });

  const messagesRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages]);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsGenerating(true);
    handleSubmit(e);
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (isGenerating || isLoading || !input) return;
      setIsGenerating(true);
      onSubmit(e as unknown as React.FormEvent<HTMLFormElement>);
    }
  };

  const handleActionClick = async (action: string, messageIndex: number) => {
    if (action === "Refresh") {
      setIsGenerating(true);
      try {
        await reload();
      } catch (error) {
        console.error("Error reloading:", error);
      } finally {
        setIsGenerating(false);
      }
    }

    if (action === "Copy") {
      const message = messages[messageIndex];
      if (message && message.role === "assistant") {
        navigator.clipboard.writeText(message.content);
      }
    }
  };

  return (
    <main className="flex h-screen w-full">
      <ChatSidebar
        users={MOCK_USERS}
        selectedUserId={selectedUser.id}
        onSelectUser={(userId) => {
          const user = MOCK_USERS.find((u) => u.id === userId);
          if (user) setSelectedUser(user);
        }}
      />
      
      <div className="flex flex-1 flex-col bg-gray-300">
        <ChatHeader user={selectedUser} />
        
        <div className="flex-1 overflow-y-auto p-4">
          <ChatMessageList>
            {messages.map((message: Message, index: number) => (
              <ChatBubble
                key={index}
                variant={message.role === "user" ? "sent" : "received"}
              >
                <ChatBubbleAvatar
                  src=""
                  fallback={message.role === "user" ? selectedUser.name.charAt(0) : "🤖"}
                />
                <ChatBubbleMessage>
                  {message.content
                    .split("```")
                    .map((part: string, index: number) => {
                      if (index % 2 === 0) {
                        return (
                          <Markdown key={index} remarkPlugins={[remarkGfm]}>
                            {part}
                          </Markdown>
                        );
                      } else {
                        return (
                          <pre className="whitespace-pre-wrap pt-2" key={index}>
                            <CodeDisplayBlock code={part} lang="" />
                          </pre>
                        );
                      }
                    })}
                </ChatBubbleMessage>
              </ChatBubble>
            ))}

            {isGenerating && (
              <ChatBubble variant="received">
                <ChatBubbleAvatar src="" fallback="🤖" />
                <ChatBubbleMessage isLoading />
              </ChatBubble>
            )}
          </ChatMessageList>
        </div>

        <div className="border-t p-4">
          <form
            ref={formRef}
            onSubmit={onSubmit}
            className="flex items-center gap-2"
          >
            <Button variant="ghost" size="icon" type="button">
              <Paperclip className="h-4 w-4" />
            </Button>
            
            <ChatInput
              value={input}
              onKeyDown={onKeyDown}
              onChange={handleInputChange}
              placeholder="Type your message here..."
              className="flex-1"
            />
            
            <Button variant="ghost" size="icon" type="button">
              <Mic className="h-4 w-4" />
            </Button>
            
            <Button 
              disabled={!input || isLoading}
              type="submit"
              size="icon"
            >
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
}