from langgraph.graph import StateGraph, START, END
from typing import Annotated, TypedDict
from langgraph.graph.message import add_messages
from langchain_ollama import ChatOllama
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import BaseMessage, HumanMessage, AIMessage
import os
from dotenv import load_dotenv 
from langgraph.checkpoint.redis import RedisSaver
from langchain.document_loaders import PyPDFLoader
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_redis import RedisConfig, RedisVectorStore
from langchain_text_splitters import RecursiveCharacterTextSplitter

load_dotenv("..")

class State(TypedDict):
    messages: Annotated[list, add_messages]

# model = ChatOllama(model="qwen3:4b")
model = ChatGoogleGenerativeAI(model="gemini-2.5-flash", google_api_key = os.getenv("GEMINI_API_KEY"))
embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-mpnet-base-v2")
config = RedisConfig(
    index_name="resumes",
    redis_url = os.getenv("REDIS_URL"),
    metadata_schema=[{
        "name": "conversation_id",
        "type": "tag"
    }]
)
vector_store = RedisVectorStore.from_documents(
    embeddings=embeddings,
    config=config
)

def embed_resume_as_vectors(file_path, conversation_id):
    """
    Tool to embed user's uploaded resume to vectors so that it can further be used for semantic search.
    This tool is always to be executed if a resume is uploaded by the user and a file path for it is also providied.
    Do not proceed further if this tool returns failure

    Input: 
        file_path: str - this is the path of the resume file uploaded by the user
        conversation_id: str - this is the unique converation id to be used
    
    Output:
        str: return whether embedding was successful or not
    """
    try:
        loader = PyPDFLoader(file_path)
        docs = loader.load()
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size = 1000,
            chunk_overlap=200,
        )
        chunks = text_splitter.split_documents(docs)
        for chunk in chunks:
            chunk.metadata["conversation_id"] = conversation_id

        vector_store.add_documents(chunks)
        return "Embedding Successful"
    except:
        return "Embedding Failed"

def chatbot(state:State):
    return {"messages": model.invoke(state["messages"])}

graph = StateGraph(State)
graph.add_node("chatbot", chatbot)
graph.add_edge(START, "chatbot")
graph.add_edge("chatbot", END)

with RedisSaver.from_conn_string(os.getenv("REDIS_URL")) as checkpointer:
    # Initialize Redis indices (only needed once)
    checkpointer.setup()
    agent = graph.compile(checkpointer=checkpointer)