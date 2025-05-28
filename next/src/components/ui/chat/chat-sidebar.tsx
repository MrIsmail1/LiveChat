import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface User {
  id: string;
  name: string;
  avatar?: string;
  status?: "online" | "offline";
  lastActive?: string;
}

interface ChatSidebarProps {
  users: User[];
  selectedUserId?: string;
  onSelectUser: (userId: string) => void;
}

export function ChatSidebar({ users, selectedUserId, onSelectUser }: ChatSidebarProps) {
  return (
    <div className="flex h-full w-[300px] flex-col bg-zinc-950 border-r">
      <div className="p-4 border-b">
        <h2 className="text-xl font-semibold text-zinc-50">Messages</h2>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2">
          {users.map((user) => (
            <Button
              key={user.id}
              variant="ghost"
              className={cn(
                "w-full justify-start gap-2 p-2 h-auto",
                selectedUserId === user.id && "bg-zinc-900"
              )}
              onClick={() => onSelectUser(user.id)}
            >
              <Avatar className="h-8 w-8">
                <AvatarImage src={user.avatar} />
                <AvatarFallback>
                  {user.name.split(" ").map((n) => n[0]).join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start gap-1">
                <span className="text-sm font-medium text-zinc-50">{user.name}</span>
                <span className="text-xs text-zinc-400">
                  {user.status === "online" ? "Active now" : `Active ${user.lastActive}`}
                </span>
              </div>
            </Button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
} 