from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
import requests
import threading

app = FastAPI()

# Enable frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class FloodRequest(BaseModel):
    elevation: float
    rainfall: float

@app.post("/explain-flood-risk")
async def explain_flood_risk(req: FloodRequest):
    prompt = f"""
You are a hydrology expert. Analyze the following:

Elevation: {req.elevation} meters
Rainfall: {req.rainfall} mm

Using step-by-step reasoning, assess the flood risk in this area.
"""
    try:
        response = requests.post(
            "http://localhost:11434/api/generate",
            json={
                "model": "gemma:2b",
                "prompt": prompt,
                "stream": False
            },
            timeout=60
        )
        data = response.json()
        return {"explanation": data.get("response", "No explanation generated.")}
    except Exception as e:
        return {"explanation": f"Error: {str(e)}"}

@app.get("/status")
def status():
    return {"status": "FloodLens AI active with Ollama (Gemma 2B)"}

# 🔥 Warm up Ollama on startup
@app.on_event("startup")
def warmup_ollama():
    def preload_model():
        try:
            requests.post(
                "http://localhost:11434/api/generate",
                json={
                    "model": "gemma:2b",
                    "prompt": "Warm up.",
                    "stream": False
                },
                timeout=60
            )
            print("✅ Ollama model warmed up.")
        except Exception as e:
            print(f"⚠️ Ollama warmup failed: {e}")

    # Run in background thread so server starts immediately
    threading.Thread(target=preload_model).start()
