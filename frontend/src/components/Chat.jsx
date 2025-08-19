import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import "./Chat.css";
export default function Chat({ title = "New Chat" }) {
  return (
    <div className=" relative flex bg-button-primary px-3 rounded-md p-2 w-full items-center chat-item mb-0 hover:bg-accent">
      <p className="text-base truncate chat-title">{title}</p>
      <Button
        variant="secondary"
        className="absolute right-1 opacity-0 chat-delete"
      >
        <Trash className="text-red-500" />
      </Button>
    </div>
  );
}
