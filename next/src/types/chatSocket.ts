export type MsgPayload = {
  room: string;
  userId: string;
  message: string;
  color: string;
  timestamp: string;
};
export interface Message {
  room: string;
  userId: string;
  message: string;
  color: string;
  timestamp: string;
  role: "user" | "assistant";
}
export interface UserJoined {
  userId: string;
  color: string;
  firstName: string;
  lastName: string;
}

export interface UserLeft {
  userId: string;
}
