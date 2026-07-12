
import faiss
import pickle
import numpy as np
import google.generativeai as genai
from sentence_transformers import SentenceTransformer

# -----------------------------
# Configure Gemini API
# -----------------------------
genai.configure(api_key="api key")

gemini = genai.GenerativeModel("gemini-2.5-flash")

# -----------------------------
# Load Embedding Model
# -----------------------------
embedding_model = SentenceTransformer("all-MiniLM-L6-v2")

# -----------------------------
# Load FAISS Index
# -----------------------------
index = faiss.read_index("assetflow.index")

# -----------------------------
# Load Knowledge Base Chunks
# -----------------------------
with open("chunks.pkl", "rb") as f:
    chunks = pickle.load(f)

# -----------------------------
# Chat Function
# -----------------------------
def ask_assetflow(question):

    query_embedding = embedding_model.encode([question])

    distances, indices = index.search(
        np.array(query_embedding),
        3
    )

    context = ""

    for idx in indices[0]:
        context += chunks[idx]
        context += "\n\n"

    prompt = f"""
You are AssetFlow AI Assistant.

You only answer questions related to AssetFlow.

Use ONLY the information below.

Context:
{context}

Question:
{question}

If the answer is not available, reply:
'I can only answer AssetFlow-related questions.'

Answer:
"""

    response = gemini.generate_content(prompt)

    return response.text
