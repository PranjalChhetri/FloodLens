import requests
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

app = FastAPI()

# Enable CORS for frontend communication
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
            "https://api.together.xyz/v1/chat/completions",
            headers={
                "Authorization": "Bearer 25112f184f05d7d039c4e3472f1dee6dc35118064ef687ab3fef827655ae2db0",  # 👈 Replace with your real Together API key
                "Content-Type": "application/json"
            },
            json={
                "model": "mistralai/Mistral-7B-Instruct-v0.2",
                "messages": [
                    {"role": "system", "content": "You are a hydrology expert."},
                    {"role": "user", "content": prompt}
                ]
            },
            timeout=60
        )

        data = response.json()
        explanation = data["choices"][0]["message"]["content"] if "choices" in data else "No explanation generated."
        return {"explanation": explanation}

    except Exception as e:
        return {"explanation": f"Error: {str(e)}"}

@app.get("/status")
def status():
    return {"status": "FloodLens AI using Together API"}
