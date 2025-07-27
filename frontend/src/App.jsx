import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import Messages from "./Messages";

export default function App() {
  const [messages, setMessages] = useState([]);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const submitFunction = async (formData) => {
    setMessages((prev) => [...prev, ["Human", formData.prompt]]);
    reset();
    try {
      // const aiMessage = await axios.get("http://127.0.0.1:5000/chatbot", {
      //   params: { prompt: formData.prompt },
      // });
      setMessages((prev) => [...prev, ["AI", "Hi I am AI"]]);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 flex flex-col">
      <div className="sticky top-0 z-20 bg-gray-800 px-4 py-4 shadow mb-2.5">
        <h1 className="text-2xl font-bold">Job Recommendation System</h1>
      </div>
      <div className="flex-1 overflow-y-auto px-4 pb-32">
        <Messages messages={messages} />
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
        <button
          type="submit"
          className="bg-blue-700 text-white px-6 py-3 rounded-full hover:bg-blue-800"
        >
          <i className="bi bi-arrow-up-circle text-2xl"></i>
        </button>
      </form>
    </div>
  );
}
