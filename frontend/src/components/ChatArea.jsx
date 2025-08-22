import Welcome from "@/components/Welcome.jsx";
import { useAuth } from "@/hooks/useAuth";
import api from "@/lib/api";
import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function ChatArea({}) {
  const { currentChat, messages, setMessages } = useAuth();
  useEffect(() => {
    const loadChatMessages = async () => {
      if (!currentChat) return;
      const response = await api.get(`/conversation/${currentChat}`);
      const receivedMessages = response.data.data;
      setMessages(receivedMessages);
    };
    loadChatMessages();
  }, [currentChat]);
  if (!currentChat) {
    return (
      <div className="flex-grow mr-4 mt-4 flex items-center justify-center">
        <Welcome />
      </div>
    );
  } else {
    return (
      <div className="flex-grow mr-4 mt-4 flex flex-col">
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
