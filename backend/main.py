from flask import Flask, jsonify
from graph import agent, State
from langchain_core.messages import BaseMessage, HumanMessage, AIMessage

app = Flask(__name__)

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"

@app.route("/chatbot")
def get_response():
    initState = State(messages=[HumanMessage(content="Hi! My name is Amol. What can you do?")])
    response = agent.invoke(initState)
    print(response)
    return f"<p> {response["messages"][-1]} </p>"