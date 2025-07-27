import { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";

export default function Messages({ messages }) {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <ul className="space-y-4">
      {messages.map(([role, text], idx) => (
        <li
          key={idx}
          className={`flex ${
            role === "AI" ? "flex-row" : "flex-row-reverse"
          } items-start`}
        >
          <span className="mt-1">
            <span
              className={`flex items-center justify-center rounded-full w-10 h-10 -mt-1
                ${role === "AI" ? "bg-blue-900" : "bg-green-900"}`}
            >
              {role === "AI" && (
                <i className="bi bi-robot text-2xl text-white"></i>
              )}
              {role === "Human" && (
                <i className="bi bi-person-fill text-2xl text-white"></i>
              )}
            </span>
          </span>
          <div
            className={`max-w-xs ml-2 mr-2 px-4 py-2 rounded-lg shadow
              ${
                role === "AI"
                  ? "bg-blue-100 text-blue-900 rounded-tl-none dark:bg-blue-900 dark:text-blue-100"
                  : "bg-green-100 text-green-900 rounded-tr-none dark:bg-green-900 dark:text-green-100"
              }`}
          >
            {role === "Human" && <p className="break-words">{text}</p>}
            {role === "AI" && <ReactMarkdown>{text}</ReactMarkdown>}
          </div>
        </li>
      ))}
      <div ref={messagesEndRef} />
    </ul>
  );
}
