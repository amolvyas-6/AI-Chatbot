import Welcome from "@/components/Welcome.jsx";
import { useAuth } from "@/hooks/useAuth";
import api from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useEffect, useRef } from "react";

export default function ChatArea({}) {
  const { currentChat, messages, setMessages } = useAuth(); // get current chat id and messages
  const messagesEndRef = useRef(null); // Create a ref

  // Always update messages whenever chatID changes
  useEffect(() => {
    const loadChatMessages = async () => {
      if (!currentChat) return;
      const response = await api.get(`/conversation/${currentChat}`);
      const receivedMessages = response.data.data;
      setMessages(receivedMessages);
    };
    loadChatMessages();
  }, [currentChat]);

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // return welcome if no chat selected
  if (!currentChat) {
    return (
      <div className="flex-grow mr-4 mt-4 flex items-center justify-center">
        <Welcome />
      </div>
    );
  } else {
    // Return Active Chat

    // Return empty message
    if (messages.length === 0) {
      return (
        <div className="flex-grow mr-4 mt-4 flex items-center justify-center flex-col">
          <h2 className="text-2xl font-semibold mb-2">Conversation is empty</h2>
          <p className="text-muted-foreground">
            Get started by typing your first query.
          </p>
        </div>
      );
    }

    // return messages if it is present
    return (
      <div
        ref={messagesEndRef}
        className="flex-grow mr-4 mt-4 flex flex-col overflow-y-auto"
      >
        {" "}
        {/* Added ref and overflow-y-auto */}
        {messages.map((message, index) => (
          <Card
            key={index}
            className={`my-2 ${
              message.role === "user"
                ? "self-end bg-primary text-primary-foreground"
                : "self-start bg-muted"
            }`}
          >
            <CardHeader>
              <CardTitle className="text-base">{message.role}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-base">{message.content}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }
}
