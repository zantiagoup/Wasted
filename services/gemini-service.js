import { GoogleGenAI } from '@google/genai';

// Free models, from best to most available. If one is busy or out of quota, we try the next one.
const MODELS = ['gemini-3.8-flash', 'gemini-3.6-flash', 'gemini-3.5-flash-lite', 'gemini-3.1-flash-lite'];

// Errors that mean "this model cannot answer right now", so the next model is worth a try.
const TRY_NEXT_CODES = [404, 429, 500, 502, 503, 504];

const INSTRUCTIONS = `You help people in Guadalajara, Mexico, throw away their waste the right way.
Identify the single main item in the photo or in the description. Answer in English.
If it is not waste or you cannot tell what it is, use the category "Unknown".`;

// Gemini has to answer with exactly this JSON shape, so the result screen always gets the same fields.
const RESULT_SCHEMA = {
  type: 'object',
  properties: {
    name: { type: 'string', description: 'Short name of the item, for example "Water bottle"' },
    category: {
      type: 'string',
      enum: ['PET', 'Glass', 'Aluminium', 'Cardboard', 'Paper', 'Organic', 'Electronics', 'Hazardous', 'Unknown']
    },
    confidence: { type: 'integer', description: 'How sure you are, from 0 to 100' },
    description: { type: 'string', description: 'One short sentence about the material' },
    steps: {
      type: 'array',
      items: { type: 'string' },
      description: 'Up to three very short steps to get it ready, for example "Rinse it"'
    }
  },
  required: ['name', 'category', 'confidence', 'description', 'steps']
};

// One attempt per model and 15 seconds at most, so a busy model does not keep the user waiting.
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: { timeout: 15000, retryOptions: { attempts: 1 } }
});

export async function classifyWaste(image, text) {
  const parts = [];
  if (image) {
    parts.push({ inlineData: { mimeType: 'image/jpeg', data: image } });
  }
  if (text) {
    parts.push({ text: 'The user describes the item as: ' + text });
  }

  for (const model of MODELS) {
    try {
      const response = await ai.models.generateContent({
        model: model,
        contents: [{ role: 'user', parts: parts }],
        config: {
          systemInstruction: INSTRUCTIONS,
          responseMimeType: 'application/json',
          responseJsonSchema: RESULT_SCHEMA
        }
      });

      const result = JSON.parse(response.text);
      result.model = model;
      return result;
    } catch (error) {
      console.log(`${model} failed (${error.status || 'no status'}): ${error.message.slice(0, 120)}`);

      // A wrong API key or a bad request will fail on every model, so we stop here.
      if (error.status && !TRY_NEXT_CODES.includes(error.status)) {
        throw error;
      }
    }
  }

  throw new Error('No Gemini model could answer');
}
