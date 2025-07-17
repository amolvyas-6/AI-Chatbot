import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";

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
      const aiMessage = await axios.get("http://127.0.0.1:5000/chatbot", {
        params: { prompt: formData.prompt },
      });
      setMessages((prev) => [...prev, ["AI", aiMessage.data]]);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <h1>Job Recommendation System</h1>

      <ul>
        {messages.map(([role, text], idx) => (
          <li key={idx}>
            <strong>{role}: </strong> {text}
          </li>
        ))}
      </ul>

      <form onSubmit={handleSubmit(submitFunction)}>
        <input
          type="text"
          placeholder="Enter prompt"
          {...register("prompt", { required: true })}
        />
        <button type="submit">Submit Prompt</button>
      </form>
    </>
  );
}
