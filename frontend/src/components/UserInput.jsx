import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Send, Paperclip } from "lucide-react";
import React from "react";
import { useAuth } from "@/hooks/useAuth";
import api from "@/lib/api";

export default function UserInput() {
  // to control text area size
  const textareaRef = React.useRef(null);
  const handleInput = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      const { lineHeight, paddingTop, paddingBottom } =
        getComputedStyle(textarea);
      const rowHeight = parseInt(lineHeight);
      const padding = parseInt(paddingTop) + parseInt(paddingBottom);
      const maxHeight = rowHeight * 5 + padding;
      const newHeight = Math.min(textarea.scrollHeight, maxHeight);
      textarea.style.height = `${newHeight}px`;
      textarea.style.overflowY =
        newHeight < textarea.scrollHeight ? "auto" : "hidden";
    }
  };

  const { currentChat, setMessages } = useAuth(); // get current chat id (to get messages)
  // handle send message
  const handleSendMessage = async () => {
    try {
      const textarea = textareaRef.current;
      if (textarea && textarea.value.trim()) {
        const newMessage = {
          role: "user",
          content: textarea.value.trim(),
        };
        textarea.value = "";
        setMessages((prev) => [...prev, newMessage]);
        const response = await api.post(
          `/conversation/${currentChat}`,
          newMessage
        );
        const aiResponse = {
          role: response.data.data.role,
          content: response.data.data.content,
        };
        setMessages((prev) => [...prev, aiResponse]);
        handleInput();
      }
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  return (
    <div className="flex items-end mr-8 my-4 h-min-[5rem]">
      <Textarea
        ref={textareaRef}
        onInput={handleInput}
        rows={1}
        placeholder="Type your message here..."
        className=" resize-none rounded-sm"
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
          }
        }}
      />
      <Button className="ml-2" size="icon" variant="ghost">
        <Paperclip className="w-5 h-5" />
      </Button>
      <Button
        className="ml-2"
        size="icon"
        variant="ghost"
        onClick={handleSendMessage}
      >
        <Send className="w-5 h-5" />
      </Button>
    </div>
  );
}
