import { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function Messages({ messages }) {
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  return (
    <ul className="space-y-4">
      {messages.map(({ role, text, file }, idx) => (
        <li
          key={idx}
          className={`flex ${
            role === "AI" ? "flex-row" : "flex-row-reverse"
          } items-start`}
        >
          <span className="mt-1">
            <span
              className={
                "flex items-center justify-center rounded-full w-10 h-10 -mt-1 bg-gray-700"
              }
            >
              {role === "AI" && (
                <i className="bi bi-robot text-2xl text-white"></i>
              )}
              {role === "Human" && (
                <i className="bi bi-person-fill text-2xl text-white"></i>
              )}
            </span>
          </span>
          <div className={`ml-2 mr-2 px-4 py-2 rounded-lg shadow bg-gray-700`}>
            {role === "Human" && <p className="break-words my-2">{text}</p>}
            {role === "Human" && file && (
              <div className="my-4 flex justify-end">
                <i className="bi bi-file-earmark-text text-gray-400"></i>
                <span className="truncate text-gray-300">{file.name}</span>
              </div>
            )}
            {role === "AI" && (
              <ReactMarkdown
                components={{
                  code({ node, inline, className, children, ...props }) {
                    const match = /language-(\w+)/.exec(className || "");
                    return !inline && match ? (
                      <SyntaxHighlighter
                        style={oneDark}
                        language={match[1]}
                        PreTag="div"
                        {...props}
                      >
                        {String(children).replace(/\n$/, "")}
                      </SyntaxHighlighter>
                    ) : (
                      <code {...props}>{children}</code>
                    );
                  },

                  h1: ({ node, ...props }) => (
                    <h1 className="text-3xl font-bold my-5" {...props} />
                  ),
                  h2: ({ node, ...props }) => (
                    <h2 className="text-2xl font-bold my-4" {...props} />
                  ),
                  h3: ({ node, ...props }) => (
                    <h3 className="text-xl font-semibold my-3" {...props} />
                  ),
                  h4: ({ node, ...props }) => (
                    <h4 className="text-lg font-semibold my-2" {...props} />
                  ),

                  // Text formatting
                  p: ({ node, ...props }) => <p className="my-2" {...props} />,
                  strong: ({ node, ...props }) => (
                    <strong className="font-bold" {...props} />
                  ),

                  // Lists
                  ul: ({ node, ...props }) => (
                    <ul className="list-disc list-inside mb-4" {...props} />
                  ),
                  ol: ({ node, ...props }) => (
                    <ol className="list-decimal list-inside mb-4" {...props} />
                  ),
                  li: ({ node, ...props }) => (
                    <li className="mb-1 pl-8" {...props} />
                  ),
                }}
              >
                {text}
              </ReactMarkdown>
            )}
          </div>
        </li>
      ))}
      <div ref={messagesEndRef} />
    </ul>
  );
}
