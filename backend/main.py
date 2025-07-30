from flask import Flask, jsonify, request, session
from flask_cors import CORS
from graph import agent, State
from langchain_core.messages import BaseMessage, HumanMessage, AIMessage
from werkzeug.utils import secure_filename
import os

app = Flask(__name__)
app.secret_key = 'secret-key'
CORS(app, origins="http://localhost:5173", supports_credentials=True)
upload_dir = "./uploads"
os.makedirs(upload_dir, exist_ok=True)
app = Flask(__name__)
app.secret_key = 'secret-key'

app.config.update(
    SESSION_COOKIE_HTTPONLY=False,
)

CORS(app, origins="http://localhost:5173", supports_credentials=True) # Adjust port if needed

def messages_to_dict(messages: list[BaseMessage]) -> list[dict]:
    """Converts a list of LangChain message objects to a list of dictionaries."""
    return [{"type": m.type, "content": m.content} for m in messages]

def dict_to_messages(messages_dict: list[dict]) -> list[BaseMessage]:
    """Converts a list of dictionaries back to LangChain message objects."""
    messages = []
    for m in messages_dict:
        if m.get("type") == "human":
            messages.append(HumanMessage(content=m.get("content")))
        elif m.get("type") == "ai":
            messages.append(AIMessage(content=m.get("content")))
    return messages

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"

@app.route("/chatbot", methods=["POST"])
def get_response():
    prompt = request.form.get("prompt")
    resume = None
    if 'resume' in request.files:
        resume = request.files['resume']
        filename = secure_filename(resume.filename)
        save_path = os.path.join(upload_dir, filename)
        resume.save(save_path)
        session['resume'] = save_path
        prompt += ". I have uploaded my resume."
    
    print(prompt)

    messages_dict = session.get("messages", [])
    messages = dict_to_messages(messages_dict)

    currentState = State(messages=messages)
    currentState["messages"].append(HumanMessage(content=prompt))

    finalState = agent.invoke(currentState)
    
    session["messages"] = messages_to_dict(finalState["messages"])

    responseContent = finalState["messages"][-1].content

    if "</think>" in responseContent:
        responseContent = responseContent.split("</think>")[-1].strip()

    return jsonify(responseContent)

@app.route("/clear_session")
def clear_chat_session():
    """An optional endpoint to clear the conversation history."""
    session.pop("messages", None)
    session.pop("resume", None)
    return jsonify({"status": "session cleared"})