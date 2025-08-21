import { useAuth } from "@/hooks/useAuth";

export default function Welcome() {
  const { user } = useAuth();
  return (
    <div className="text-center">
      <h1>Welcome to Generic AI Chatbot</h1>
      <h2>Your personal assistant for all your queries</h2>
      {user ? (
        <h3>Get Started by typing your query below</h3>
      ) : (
        <h3>Please log in to start chatting</h3>
      )}
    </div>
  );
}
