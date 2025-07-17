from flask import Flask, jsonify, request
from flask_cors import CORS
from graph import agent, State
from langchain_core.messages import BaseMessage, HumanMessage, AIMessage

app = Flask(__name__)
CORS(app)

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"

@app.route("/chatbot")
def get_response():
    prompt = request.args.get("prompt")
    initState = State(messages=[])
    initState["messages"].append(HumanMessage(content=prompt))
    initState = agent.invoke(initState)
    responseContent = initState["messages"][-1].content
    responseContent = responseContent.split("</think>")[-1]
    return jsonify(responseContent)