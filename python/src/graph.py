from typing import Annotated, TypedDict
from langgraph.graph import StateGraph, START, END
from langgraph.graph.message import add_messages
from langchain_google_genai import ChatGoogleGenerativeAI
from langgraph.prebuilt import ToolNode, tools_condition
from src.helper import tools 
import os
import dotenv

dotenv.load_dotenv()

### Define State to be used in the Graph
class State(TypedDict):
    messages: Annotated[list, add_messages]

### Initialize LLM
model = ChatGoogleGenerativeAI(model="gemini-2.5-flash", google_api_key = os.getenv("GEMINI_API_KEY"))
model = model.bind_tools(tools)

### Define the define the nodes of the Graph
def chatbot(state:State):
    response = model.invoke(state["messages"])
    return {"messages": response}

### Define the tool node
tool_node = ToolNode(tools)

### Build the Graph
graph_builder = StateGraph(State)
graph_builder.add_node("tools", tool_node)  # Add tool node
graph_builder.add_node("chatbot", chatbot)  # Add chatbot node
graph_builder.add_conditional_edges(    # Add conditional edge between tool and chatbot node
    "chatbot",
    tools_condition,
    {
        "tools": "tools",
        "__end__": END
    }

)
graph_builder.add_edge(START, "chatbot")    # Set entry point of graph as chatbot node
graph_builder.add_edge("tools", "chatbot")  # Add edge from tools to chatbot so that chatbot can see tool output
graph_builder.add_edge("chatbot", END)  # Set exit point as chatbot node

graph = graph_builder.compile() 