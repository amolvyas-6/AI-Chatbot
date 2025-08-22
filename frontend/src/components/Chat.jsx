import { Button } from "@/components/ui/button";
import { Trash } from "lucide-react";
import "./Chat.css";
import { useAuth } from "@/hooks/useAuth";
import api from "@/lib/api";

export default function Chat({ chatId, title = "New Chat", isSelected }) {
  const { currentChat, setCurrentChat, setChatHistory } = useAuth();

  // handle clicking on chat
  const handleChatClick = () => {
    setCurrentChat(chatId);
    if (currentChat === chatId) {
      return;
    }
  };

  // function to run when delete caht is clicked
  const deleteChat = async () => {
    try {
      await api.delete(`/conversation/${chatId}`);
      setChatHistory((prev) => prev.filter((chat) => chat._id !== chatId));
      setCurrentChat(null); // No need to set messages to empty as useEffect in chatArea.jsx takes care of that
      alert("Conversation Deleted");
    } catch (error) {
      console.error("Error deleting chat:", error);
      alert("Failed to delete conversation: " + error.response?.data?.message);
    }
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
