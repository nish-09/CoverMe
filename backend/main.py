import os
import json
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from groq import Groq
from dotenv import load_dotenv

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
load_dotenv(os.path.join(BASE_DIR, ".env"))

app = FastAPI(title="CoverMe API", version="1.0.0")

# CORS - allow Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://coverme-excuse-generator.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# OpenAI client
api_key = os.getenv("GROQ_API_KEY")

if not api_key:
    raise Exception("GROQ_API_KEY not loaded. Check .env file")

client = Groq(api_key=os.getenv("GROQ_API_KEY"))

class ExcuseRequest(BaseModel):
    situation: str
    tone: str  # Casual / Formal / Very Formal / Funny / Emotional / Serious
    lie_strength: str  # Low / Medium / High
    context: Optional[str] = None


class ExcuseResponse(BaseModel):
    excuses: list[str]
    best: str
    tip: str


def build_prompt(req: ExcuseRequest) -> str:
    context_part = f"\nAdditional context: {req.context}" if req.context else ""

    return f"""
You are CoverMe AI, an expert excuse generator.

SITUATION: {req.situation}{context_part}
TONE: {req.tone}
LIE STRENGTH: {req.lie_strength}

TASK:
Generate:
1. 3 different excuses
2. 1 best excuse
3. 1 short delivery tip

RULES:
- Must be realistic and human-like
- Keep it short
- No AI mention
- No harmful or illegal content

Return ONLY valid JSON:

{{
  "excuses": ["", "", ""],
  "best": "",
  "tip": ""
}}
"""


@app.post("/api/generate", response_model=ExcuseResponse)
async def generate_excuses(req: ExcuseRequest):
    if not req.situation.strip():
        raise HTTPException(status_code=400, detail="Situation cannot be empty")

    try:
        prompt = build_prompt(req)

        response = client.chat.completions.create(
    model="llama-3.1-8b-instant",
    messages=[
        {"role": "system", "content": "You are CoverMe AI."},
        {"role": "user", "content": prompt}
    ]
)

        raw = response.choices[0].message.content
        data = json.loads(raw)

        return ExcuseResponse(
            excuses=data["excuses"],
            best=data["best"],
            tip=data["tip"],
        )

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/")
def root():
    return {"message": "CoverMe API is running", "docs": "/docs"}


@app.get("/health")
def health():
    return {"status": "ok"}