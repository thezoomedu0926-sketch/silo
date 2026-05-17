import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// JSON Schema for Silo Diagnosis Generation
const analysisSchema = {
  type: Type.OBJECT,
  properties: {
    diagnosisName: { type: Type.STRING },
    purpose: { type: Type.STRING },
    expectedEffects: { type: Type.STRING },
    domains: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          name: { type: Type.STRING },
          description: { type: Type.STRING },
          questions: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                text: { type: Type.STRING },
                isReverse: { type: Type.BOOLEAN }
              }
            }
          }
        }
      }
    },
    workshopPlan: {
      type: Type.OBJECT,
      properties: {
        activityName: { type: Type.STRING },
        duration: { type: Type.STRING },
        materials: { type: Type.STRING },
        process: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        },
        questionCards: {
          type: Type.ARRAY,
          items: { type: Type.STRING }
        }
      }
    },
    qualityGuide: {
      type: Type.ARRAY,
      items: { type: Type.STRING }
    }
  },
  required: ["diagnosisName", "purpose", "expectedEffects", "domains", "workshopPlan", "qualityGuide"]
};

app.post("/api/generate-diagnosis", async (req, res) => {
  const { industry, size, symptoms } = req.body;

  const prompt = `
    당신은 최고 수준의 HRD Prompt Architect입니다. 
    다음 정보를 기반으로 '부서 간 사일로 효과(Silo Effect)' 진단 도구와 워크숍 솔루션을 설계하세요.
    
    [입력 정보]
    - 업종: ${industry}
    - 규모: ${size}
    - 현재 증상: ${symptoms}
    
    [요구사항]
    1. 진단명: 해당 맥락을 반영한 세련된 진단명.
    2. 진단 영역: (1. 정보 흐름, 2. 부서 이기주의, 3. 리더십 및 보상체계, 4. 심리적 안전감) 4개 영역 필수.
    3. 문항: 각 영역당 3문항씩 총 12문항. 리커트 5점 척도용. 구체적이고 행동 중심적이어야 함.
    4. 워크숍 솔루션: 진단 결과를 바탕으로 즉시 실행 가능한 활동 계획.
    5. 품질 검증 가이드: 퍼실리테이터를 위한 유의사항 3가지.
    
    출력은 반드시 한국어로 작성하세요.
  `;

  try {
    const result = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: analysisSchema,
      },
    });

    if (!result.text) {
      throw new Error("Failed to generate content");
    }

    res.json(JSON.parse(result.text));
  } catch (error: any) {
    console.error("Gemini Error:", error);
    res.status(500).json({ error: error.message });
  }
});

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
