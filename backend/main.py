from flask import Flask, jsonify, request, session
from flask_cors import CORS
from langchain_core.messages import HumanMessage, SystemMessage
from werkzeug.utils import secure_filename
from helper import embed_resume_as_vectors, system_prompt, clearRedisSession
from graph import graph 
import os
import uuid

### Setup Flask App
app = Flask(__name__)
app.secret_key = 'secret-key'   # secret key for session
CORS(app, origins="http://localhost:5173", supports_credentials=True)   # CORS setup
app.config.update(SESSION_COOKIE_HTTPONLY=False)

### Initialize Directory to temporarily store PDF Files
upload_dir = os.getenv("FILE_UPLOAD_DIR")
os.makedirs(upload_dir, exist_ok=True)


@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"

@app.route("/chatbot", methods=["POST"])
def get_response():
    ### Initialize session
    if "conversation_id" not in session:
        session["conversation_id"] = str(uuid.uuid4())

    ### Parse Data from Request
    prompt = request.form.get("prompt")
    resume = None
    if 'resume' in request.files:
        resume = request.files['resume']
        filename = secure_filename(resume.filename)
        save_path = os.path.join(upload_dir, filename)
        resume.save(save_path)
        session["resume"] = save_path
        print(embed_resume_as_vectors(file_path=save_path, conversation_id=session["conversation_id"]))
    
    ### Include resume path in session data
    if session.get("resume", None):
        prompt += f"\n\nThe path to resume: {session["resume"]}"
    
    ### Invoke AI Agent
    prompt += f"\n\nConversation ID: {session['conversation_id']}"
    config = {"configurable": {"thread_id": str(session["conversation_id"])}}
    finalState = graph.invoke({"messages": [SystemMessage(content=system_prompt), HumanMessage(content=prompt)]}, config=config)
    responseContent = finalState["messages"][-1].content

    ### Respond in JSON Format
    return jsonify(responseContent)

@app.route("/clear_session")
def clear_chat_session():
    ### Clear chat session
    session.pop("conversation_id", None)
    session.pop("resume", None)

    return jsonify({"status": "session cleared"})