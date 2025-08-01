from langchain_community.document_loaders import PyPDFLoader
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_redis import RedisConfig, RedisVectorStore
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain.tools import tool
from dotenv import load_dotenv
from redisvl.query.filter import Tag
import os
load_dotenv()

### Initialize Embedding Model for Vector DB
embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-mpnet-base-v2")

### Connect to Redis Database for Storage of Vector DB
config = RedisConfig(
    index_name="resumes",
    redis_url = os.getenv("REDIS_URL"),
    metadata_schema=[{
        "name": "conversation_id",
        "type": "tag"
}])
vector_store = RedisVectorStore(
    embeddings=embeddings,
    config=config
)

### System Prompt to be used by the LLM
system_prompt = """
    You are an AI assistant who will assist the user in his queries. You are also provided a set of tools which u can use to further help you.
    One of the tools will allow you to obtain data from the user's resume and use it as context, so whenever the user asks a query regarding their resume,
    try using these tools first. 
    If no valid tools are available for the task, then answer the query normally.
"""

def clearRedisSession(conversation_id):
    """Clear Redis database"""
    config = {"configurable": {"thread_id": conversation_id}}



def embed_resume_as_vectors(file_path: str, conversation_id: str) -> str:
    """
    Function to embed user resume as vectors to be stored in Vector DB
    """
    try:
        ### Load and Prepare the PDF File present at given Path
        loader = PyPDFLoader(file_path)
        docs = loader.load()
        text_splitter = RecursiveCharacterTextSplitter(
            chunk_size = 1000,
            chunk_overlap=200,
        )
        chunks = text_splitter.split_documents(docs)
        for chunk in chunks:
            chunk.metadata["conversation_id"] = conversation_id     # Add conversation_id as metadata to each chunk to enable filtering in future

        vector_store.add_documents(chunks)      # Add the chunks to vector DB
        return "Embedding Successful"
    except Exception as e:
        print("Error occured:", e)      # Print any error if occurred
        return "Embedding Failed"

@tool(response_format="content_and_artifact")
def retreiver(search_query, conversation_id):
    """
    Tool to get relevant documents and information pertaining to a certain query from the user's uploaded resume.
    Input:
        search_query: str - the query whose relevant information needs to be gathered
        converstaion_id: str - the unique ID of the conversation
    """
    filter_condition = Tag("conversation_id") == conversation_id
    filtered_results = vector_store.similarity_search(search_query, k = 4, filter=filter_condition)
    context = "\n".join(doc.page_content for doc in filtered_results) 
    return (context, filtered_results)

tools = [retreiver]