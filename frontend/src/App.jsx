import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import Messages from "./Messages";
import FileUploadButton from "./FileUploadButton";
import { BACKEND_ENDPOINTS } from "./config";

export default function App() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm();
  const resume = watch("resume");
  const fileName = resume?.[0]?.name;

  const submitFunction = async (formData) => {
    setIsLoading(true);

    const userData = {
      role: "Human",
      text: formData.prompt,
      file: fileName ? { name: fileName } : null,
    };

    setMessages((prev) => [...prev, userData]);
    reset();
    let data = new FormData();
    data.append("prompt", formData.prompt);
    if (formData.resume && formData.resume[0]) {
      data.append("resume", formData.resume[0]);
    }

    try {
      const aiMessage = await axios.post(BACKEND_ENDPOINTS.chatbot, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      });
      const aiData = {
        role: "AI",
        text: aiMessage.data,
        file: null,
      };
      setMessages((prev) => [...prev, aiData]);
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = async () => {
    try {
      console.log("Session is Being Cleared...");
      const response = await axios.get(BACKEND_ENDPOINTS.clearSession, {
        withCredentials: true,
      });
      setMessages([]);
      setIsLoading(false);
      console.log("Response = ", response);
      console.log("Session is cleared");
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
      <div className="sticky top-0 z-20 bg-gray-800 px-4 py-4 shadow mb-2.5 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Job Recommendation System</h1>
        <button
          onClick={clearChat}
          className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 cursor-pointer"
        >
          Clear Chat
        </button>
      </div>
      <div className="flex-1 overflow-y-auto px-4 pb-32">
        <Messages messages={messages} />
        {isLoading && (
          <Messages
            messages={[{ role: "AI", text: "Loading...", file: null }]}
          />
        )}
      </div>
      <form
        onSubmit={handleSubmit(submitFunction)}
        className="w-full px-4 py-4 bg-gray-800 flex gap-2 fixed bottom-0 left-0 right-0"
        style={{ zIndex: 10 }}
      >
        <input
          type="text"
          placeholder="Enter prompt"
          autoComplete="off"
          autoCapitalize="off"
          {...register("prompt", { required: true })}
          className="flex-1 bg-gray-700 text-gray-100 border-none rounded-full px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <FileUploadButton fileName={fileName} register={register} />

        <button
          type="submit"
          disabled={isLoading}
          className="bg-blue-700 text-white px-5 py-3 rounded-full hover:bg-blue-800 cursor-pointer"
        >
          <i className="bi bi-arrow-up-circle text-2xl"></i>
        </button>
      </form>
    </div>
  );
}
