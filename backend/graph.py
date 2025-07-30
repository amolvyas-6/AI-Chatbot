from langgraph.graph import StateGraph, START, END
from typing import Annotated, TypedDict
from langgraph.graph.message import add_messages
from langchain_ollama import ChatOllama
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import BaseMessage, HumanMessage, AIMessage
import os
from dotenv import load_dotenv 

load_dotenv("..")

class State(TypedDict):
    messages: Annotated[list, add_messages]

# model = ChatOllama(model="qwen3:4b")
model = ChatGoogleGenerativeAI(model="gemini-2.5-flash", google_api_key = os.getenv("GEMINI_API_KEY"))

def chatbot(state:State):
    return {"messages": model.invoke(state["messages"])}

graph = StateGraph(State)
graph.add_node("chatbot", chatbot)
graph.add_edge(START, "chatbot")
graph.add_edge("chatbot", END)

agent = graph.compile()