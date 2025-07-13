from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from openai import OpenAI

import os
load_dotenv()
# ✅ Use the latest OpenAI SDK
client = OpenAI(api_key=os.getenv("sk-proj-REPLACE_WITH_YOUR_KEY"))

app = FastAPI()

# ✅ Allow frontend to access backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class FloodRequest(BaseModel):
    elevation: float
    rainfall: float

@app.post("/explain-flood-risk")
async def explain_flood(req: FloodRequest):
    try:
        prompt = f"""
You are an expert hydrologist. Based on the following inputs:

- Elevation: {req.elevation} meters
- Rainfall: {req.rainfall} mm

Explain whether the area is at flood risk using a Chain-of-Thought reasoning style.
"""

        response = client.chat.completions.create(
            model="gpt-3.5-turbo",  # You can use "gpt-4" if your key supports it
            messages=[{"role": "user", "content": prompt}],
            temperature=0.7,
        )

        explanation_text = response.choices[0].message.content.strip()
        return {"explanation": explanation_text}

    except Exception as e:
        print("❌ OpenAI Error:", e)
        return {"explanation": f"Error: {str(e)}"}
