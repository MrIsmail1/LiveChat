"use client";

import type { Message, UserJoined, UserLeft } from "@/types/chatSocket";
import { useCallback, useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";

export function useChatSocket() {
  const socketRef = useRef<Socket | null>(null);

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
      connect().emit("joinRoom", { room });
    },
    [connect]
  );

  const leaveRoom = useCallback(
    (room: string) => {
      connect().emit("leaveRoom", { room });
    },
    [connect]
  );

  const sendMessage = useCallback(
    (room: string, text: string) => {
      connect().emit("message", { room, message: text });
    },
    [connect]
  );

  const onUserJoined = useCallback(
    (cb: (info: UserJoined) => void) => {
      const socket = connect();
      socket.on("userJoined", cb);
      return () => {
        socket.off("userJoined", cb);
      };
    },
    [connect]
  );

  const onUserLeft = useCallback(
    (cb: (info: UserLeft) => void) => {
      const socket = connect();
      socket.on("userLeft", cb);
      return () => {
        socket.off("userLeft", cb);
      };
    },
    [connect]
  );

  const onMessage = useCallback(
    (cb: (msg: Message) => void) => {
      const socket = connect();
      socket.on("message", cb); // server emits "message"
      return () => {
        socket.off("message", cb);
      };
    },
    [connect]
  );

  // When this hook unmounts, disconnect the socket
  useEffect(() => {
    return () => {
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, []);

  return {
    joinRoom,
    leaveRoom,
    sendMessage,
    onUserJoined,
    onUserLeft,
    onMessage,
  };
}
