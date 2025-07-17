from langgraph.graph import StateGraph, START, END
from typing import Annotated, TypedDict
from langgraph.graph.message import add_messages
from langchain_ollama import ChatOllama
from langchain_core.messages import BaseMessage, HumanMessage, AIMessage 

class State(TypedDict):
    messages: Annotated[list, add_messages]

model = ChatOllama(model="qwen3:4b")

def chatbot(state:State):
    return {"messages": model.invoke(state["messages"])}

graph = StateGraph(State)
graph.add_node("chatbot", chatbot)
graph.add_edge(START, "chatbot")
graph.add_edge("chatbot", END)

agent = graph.compile()