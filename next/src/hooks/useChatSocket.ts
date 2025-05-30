"use client";
import type { Message, UserJoined, UserLeft } from "@/types/chatSocket";
import { useCallback, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

export function useChatSocket() {
  const socketRef = useRef<Socket>(null);

  const connect = useCallback(() => {
    if (!socketRef.current) {
      socketRef.current = io(`${process.env.NEXT_PUBLIC_NEST_API_URL}/chat`, {
        path: "/chat-socket",
        withCredentials: true,
        autoConnect: true,
      });
    }
    return socketRef.current;
  }, []);

  const joinRoom = useCallback(
    (room: string) => {
      connect().emit("joinRoom", room);
    },
    [connect]
  );

  const sendMessage = useCallback(
    (room: string, text: string) => {
      connect().emit("message", { room, message: text });
    },
    [connect]
  );

  const onMessage = useCallback(
    (cb: (msg: Message) => void) => {
      connect().on("message", cb); // listen for "message" now
      return () => connect().off("message", cb);
    },
    [connect]
  );

  const onUserJoined = useCallback(
    (cb: (info: UserJoined) => void) => {
      connect().on("userJoined", cb);
      return () => connect().off("userJoined", cb);
    },
    [connect]
  );

  const onUserLeft = useCallback(
    (cb: (info: UserLeft) => void) => {
      connect().on("userLeft", cb);
      return () => connect().off("userLeft", cb);
    },
    [connect]
  );

  useEffect(() => {
    return () => {
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, []);

  return { joinRoom, sendMessage, onMessage, onUserJoined, onUserLeft };
}
