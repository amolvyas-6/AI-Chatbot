from fastapi import FastAPI
from pydantic import BaseModel
from typing import List
from src.graph import graph, State

class Messages(BaseModel):
    role: str
    content: str

class ChatHistory(BaseModel):
    chatHistory: List[Messages]

app = FastAPI()

@app.post("/chatbot")
async def func(req: ChatHistory):
    chatHistory = []
    for message in req.chatHistory:
        chatHistory.append({"role": message.role, "content": message.content})
    
    response = graph.invoke(State(messages=chatHistory))
    messages = response["messages"]
    lastMessage = messages[-1]
    print("Last Message:", lastMessage)

    return {"role": "assistant", "content": lastMessage.content}