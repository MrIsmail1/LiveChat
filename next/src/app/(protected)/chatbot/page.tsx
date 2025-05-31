"use client";

import { useQuery } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

import CodeDisplayBlock from "@/components/code-display-block";
import { Button } from "@/components/ui/button";
import {
  ChatBubble,
  ChatBubbleAvatar,
  ChatBubbleMessage,
} from "@/components/ui/chat/chat-bubble";
import { ChatHeader } from "@/components/ui/chat/chat-header";
import { ChatInput } from "@/components/ui/chat/chat-input";
import { ChatMessageList } from "@/components/ui/chat/chat-message-list";
import { ChatSidebar } from "@/components/ui/chat/chat-sidebar";
import { useChatSocket } from "@/hooks/useChatSocket";

import { usersList } from "@/lib/api";
import type { User } from "@/types/auth";
import type { Message } from "@/types/chatSocket";

import useAuth from "@/hooks/useAuth";
import { Mic, Paperclip, Send } from "lucide-react";

export default function ChatPage() {
  const { user } = useAuth();
  const {
    joinRoom,
    sendMessage,
    onUserJoined,
    onUserLeft,
    onMessage,
    leaveRoom,
  } = useChatSocket();

  const { data: users, isLoading } = useQuery<User[]>({
    queryKey: ["users"],
    queryFn: usersList,
  });

  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  useEffect(() => {
    if (!isLoading && users && users.length > 0) {
      setSelectedUser(users[0]);
    }
  }, [isLoading, users]);

  const [currentRoom, setCurrentRoom] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [msgText, setMsgText] = useState("");
  const messagesRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    const cleanupJoined = onUserJoined(
      ({ userId, color, firstName, lastName }) => {
        if (!currentRoom.includes(userId)) return;
        setMessages((prev) => [
          ...prev,
          {
            room: currentRoom,
            userId,
            message: `${firstName} joined`,
            color,
            timestamp: new Date().toISOString(),
            role: "user",
          },
        ]);
      }
    );

    const cleanupLeft = onUserLeft(({ userId }) => {
      if (!currentRoom.includes(userId)) return;
      setMessages((prev) => [
        ...prev,
        {
          room: currentRoom,
          userId,
          message: `User left`,
          color: "#888888",
          timestamp: new Date().toISOString(),
          role: "user",
        },
      ]);
    });

    const cleanupMessage = onMessage((payload) => {
      setMessages((prev) => [
        ...prev,
        {
          ...payload,
          role: "user",
        },
      ]);
    });

    return () => {
      cleanupJoined();
      cleanupLeft();
      cleanupMessage();
    };
  }, [currentRoom, onUserJoined, onUserLeft, onMessage]);

  const myId = user?.id ?? "";
  const prevRoomRef = useRef<string>("");

  const handleSelectUser = (userId: string) => {
    if (!users) return;
    const user = users.find((u) => u.id === userId);
    if (!user) return;
    if (!myId) return;

    setSelectedUser(user);

    const roomName = [userId, myId].sort().join("_");
    if (prevRoomRef.current) {
      leaveRoom(prevRoomRef.current);
    }
    setCurrentRoom(roomName);
    setMessages([]);
    joinRoom(roomName);
    prevRoomRef.current = roomName;
  };

  const handleSend = () => {
    if (!msgText.trim() || !currentRoom || !myId) return;
    sendMessage(currentRoom, msgText);
    setMsgText("");
  };

  if (isLoading || !selectedUser) {
    return <div>Loading users…</div>;
  }

  return (
    <main className="flex h-screen w-full">
      <ChatSidebar
        users={
          users?.map((u) => ({
            ...u,
            name: `${u.firstName} ${u.lastName}`,
          })) || []
        }
        selectedUserId={selectedUser.id}
        onSelectUser={handleSelectUser}
      />

      <div className="flex flex-1 flex-col bg-gray-300">
        <ChatHeader
          user={{ name: `${selectedUser.firstName} ${selectedUser.lastName}` }}
        />

        <div className="flex-1 overflow-y-auto p-4" ref={messagesRef}>
          <ChatMessageList>
            {messages.map((msg, idx) => (
              <ChatBubble
                key={idx}
                variant={msg.role === "user" ? "sent" : "received"}
              >
                <ChatBubbleAvatar src="" fallback={"👤"} />
                <ChatBubbleMessage>
                  {msg.message.split("```").map((part, i) =>
                    i % 2 === 0 ? (
                      <Markdown key={i} remarkPlugins={[remarkGfm]}>
                        {part}
                      </Markdown>
                    ) : (
                      <pre className="whitespace-pre-wrap pt-2" key={i}>
                        <CodeDisplayBlock code={part} lang="" />
                      </pre>
                    )
                  )}
                </ChatBubbleMessage>
              </ChatBubble>
            ))}
          </ChatMessageList>
        </div>

        <div className="border-t p-4">
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon">
              <Paperclip className="h-4 w-4" />
            </Button>
            <ChatInput
              value={msgText}
              onChange={(e) => setMsgText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              placeholder="Type your message here..."
              className="flex-1"
            />
            <Button variant="ghost" size="icon">
              <Mic className="h-4 w-4" />
            </Button>
            <Button disabled={!msgText} onClick={handleSend} size="icon">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
