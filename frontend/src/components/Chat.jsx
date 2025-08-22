import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import "./Chat.css";
import { useAuth } from "@/hooks/useAuth";
import api from "@/lib/api";

export default function Chat({
  chatId,
  title = "New Chat",
  isSelected,
  onClick,
}) {
  const { currentChat, setCurrentChat, setChatHistory } = useAuth();
  const handleChatClick = () => {
    onClick();
    if (currentChat === chatId) {
      return;
    }
    setCurrentChat(chatId);
    console.log(currentChat);
  };

  const deleteChat = async () => {
    const response = await api.delete(`/conversation/${chatId}`);
    setChatHistory((prev) => prev.filter((chat) => chat._id !== chatId));
    setCurrentChat(null);

    alert("Conversation Deleted");
  };
  return (
    <div
      className={`relative flex bg-button-primary px-3 rounded-md p-2 w-full items-center chat-item mb-0 hover:bg-accent ${
        isSelected ? "bg-accent" : ""
      }`}
      onClick={handleChatClick}
    >
      <p className="text-base truncate chat-title">{title}</p>
      <Button
        variant="secondary"
        className="absolute right-1 opacity-0 chat-delete"
        onClick={deleteChat}
      >
        <Trash className="text-red-500" />
      </Button>
    </div>
  );
}
