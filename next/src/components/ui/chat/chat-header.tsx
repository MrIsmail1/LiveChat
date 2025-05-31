import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Info, Phone, Video } from "lucide-react";

interface ChatHeaderProps {
  user: {
    name: string;
    avatar?: string;
    status?: "online" | "offline";
    lastActive?: string;
  };
}

export function ChatHeader({ user }: ChatHeaderProps) {
  return (
    <div className="flex items-center justify-between p-4 border-b bg-zinc-950">
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarImage src={user.avatar} />
          <AvatarFallback>
            {user.name
              .split(" ")
              .map((n) => n[0])
              .join("")}
          </AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <span className="text-sm font-medium text-zinc-50">{user.name}</span>
          <span className="text-xs text-zinc-400">
            {user.status === "online" ? "Active now" : ``}
          </span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon">
          <Phone className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <Video className="h-4 w-4" />
        </Button>
        <Button variant="ghost" size="icon">
          <Info className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
