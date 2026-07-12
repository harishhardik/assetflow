

from flask import Flask, request, jsonify
from chatbot import ask_assetflow

app = Flask(__name__)

@app.route("/chat", methods=["POST"])
def chat():

    data = request.get_json()

    question = data["question"]

    answer = ask_assetflow(question)

    return jsonify({
        "answer": answer
    })

@app.route("/")
def home():
    return "AssetFlow AI API Running"

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
