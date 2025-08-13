import axios from "axios";

export const getResponseFromChatbot = async (req, res, next) => {
  const prompt = req.body();
  console.log(prompt);
};
