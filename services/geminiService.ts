
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { Post } from "../types";

// Initialize AI
// Note: For Veo and complex tasks, we re-instantiate in the function to ensure we get the latest key if selected via UI.
const getAi = () => {
    const apiKey = process.env.API_KEY;
    return apiKey ? new GoogleGenAI({ apiKey: apiKey }) : null;
};

// Fallback data
const FALLBACK_POSTS: any[] = [
  {
    username: "SarahK_PNG",
    content: "Just finished my coding workshop at UPNG! The digital future of PNG is bright. 🇵🇬💻 #TechPNG #Education",
    category: "Education",
    likes: 1240,
    isVerified: true
  },
  {
    username: "KultureVibes",
    content: "Preparing for the Goroka Show. Our traditions are our strength. See you there! 🌺🥁 #Culture #PNGPride",
    category: "Culture",
    likes: 3500,
    isVerified: true
  },
  {
    username: "SME_Growth",
    content: "New vanilla export regulations explained. Check our bio for the full guide for local farmers. 📈🌱",
    category: "Business",
    likes: 890,
    isVerified: false
  },
  {
    username: "NCD_Updates",
    content: "Road works completing on Hubert Murray Highway next week. Drive safe wantoks! 🚧🚗",
    category: "Development",
    likes: 560,
    isVerified: true
  }
];

export const generateInitialFeed = async (): Promise<Post[]> => {
  const ai = getAi();
  if (!ai) {
    console.warn("No API_KEY found. Using fallback data.");
    return mapToPostObjects(FALLBACK_POSTS);
  }

  const modelId = 'gemini-2.5-flash';
  
  const prompt = `
    Generate 4 distinct social media posts for "Wantok", a PNG-first app.
    The posts must focus on: Education, National Development, PNG Culture, or Small Business.
    
    Style: Short, punchy, inspirational, or educational. Max 20 words per post.
    Include a mix of English and Tok Pisin.
    
    Output JSON format:
    Array of objects with:
    - username (realistic PNG names)
    - content (the post text)
    - category ('Education', 'Culture', 'Development', 'Business')
    - likes (number between 50 and 5000)
    - isVerified (boolean)
  `;

  try {
    const response = await ai.models.generateContent({
      model: modelId,
      contents: prompt,
      config: {
        maxOutputTokens: 8192,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              username: { type: Type.STRING },
              content: { type: Type.STRING },
              category: { type: Type.STRING, enum: ["Education", "Culture", "Development", "Business"] },
              likes: { type: Type.INTEGER },
              isVerified: { type: Type.BOOLEAN },
            }
          }
        }
      },
    });

    let jsonText = response.text || "[]";
    
    // Robust Extraction: Find the first '[' and the last ']' to ignore any Markdown or preamble
    const firstOpen = jsonText.indexOf('[');
    const lastClose = jsonText.lastIndexOf(']');
    
    if (firstOpen !== -1 && lastClose !== -1 && lastClose > firstOpen) {
        jsonText = jsonText.substring(firstOpen, lastClose + 1);
    } else {
        // If we can't find brackets, try standard strip (though regex below is less robust for complex nesting)
        jsonText = jsonText.replace(/^```json\s*/i, '').replace(/^```\s*/i, '').replace(/\s*```$/, '');
    }

    // Parse
    const data = JSON.parse(jsonText);
    if (!Array.isArray(data) || data.length === 0) throw new Error("Empty or invalid response data");
    return mapToPostObjects(data);

  } catch (error) {
    console.warn("Gemini Feed Generation failed (using fallback). Error:", error instanceof Error ? error.message : error);
    // Return fallback silently to ensure app UI doesn't crash
    return mapToPostObjects(FALLBACK_POSTS);
  }
};

const mapToPostObjects = (rawPosts: any[]): Post[] => {
  const posts: Post[] = rawPosts.map((item: any, index: number) => ({
    id: `post-${index}-${Date.now()}`,
    userId: `user-${index}`,
    username: item.username,
    userAvatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${item.username}`,
    content: item.content,
    category: item.category,
    likes: item.likes,
    comments: Math.floor(item.likes / 10),
    shares: Math.floor(item.likes / 20),
    isVerified: item.isVerified,
    backgroundGradient: getRandomGradient(index),
    isAd: false
  }));

  const adPost: Post = {
    id: 'ad-1',
    userId: 'business-1',
    username: 'Digicel PNG',
    userAvatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=digicel',
    content: 'Get the new 4G LTE Plan today! Stay connected with your Wantoks nationwide.',
    category: 'Sponsored',
    likes: 1200,
    comments: 45,
    shares: 120,
    isVerified: true,
    backgroundGradient: 'from-png-red to-red-900',
    isAd: true,
    ctaText: 'View Plans',
    ctaLink: '#'
  };

  if (posts.length >= 2) {
    posts.splice(2, 0, adPost);
  } else {
    posts.push(adPost);
  }

  return posts;
};

const getRandomGradient = (index: number) => {
  const gradients = [
    'from-red-900 to-slate-900', 
    'from-amber-700 to-yellow-900',
    'from-emerald-900 to-teal-900',
    'from-slate-900 to-black', 
    'from-indigo-900 to-purple-900'
  ];
  return gradients[index % gradients.length];
};

/**
 * FEATURE: Analyze Images
 * Model: gemini-3-pro-preview
 */
export const analyzeImageForCaption = async (base64Data: string, mimeType: string): Promise<string> => {
    const ai = getAi();
    if (!ai) return "Cool photo!";

    try {
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-preview',
            contents: {
                parts: [
                    { inlineData: { data: base64Data, mimeType: mimeType } },
                    { text: "Write a short, engaging caption for this photo for the 'Wantok' social app. Keep it under 20 words. Use some Tok Pisin slang if appropriate." }
                ]
            }
        });
        return response.text || "Check out this photo!";
    } catch (e) {
        console.error("Image analysis failed", e);
        return "New photo update!";
    }
};

/**
 * FEATURE: Generate Speech (TTS)
 * Model: gemini-2.5-flash-preview-tts
 */
export const generateSpeech = async (text: string): Promise<string | null> => {
    const ai = getAi();
    if (!ai) return null;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-tts",
            contents: { parts: [{ text: text }] },
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } }
                }
            }
        });
        
        // Extract base64 audio
        const audioData = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        return audioData || null;
    } catch (e) {
        console.error("TTS failed", e);
        return null;
    }
};

/**
 * FEATURE: Chatbot
 * Model: gemini-3-pro-preview
 */
export const chatWithWantok = async (message: string, history: any[]): Promise<string> => {
    const ai = getAi();
    if (!ai) return "System offline.";

    try {
        const chat = ai.chats.create({
            model: 'gemini-3-pro-preview',
            history: history,
            config: {
                systemInstruction: "You are 'Wantok Bot', a helpful assistant for a PNG social app. You speak English and Tok Pisin. Be brief and friendly.",
            }
        });
        
        const result = await chat.sendMessage({ message });
        return result.text || "";
    } catch (e) {
        console.error("Chat failed", e);
        return "Sori, mi no kisim dispela. Try again.";
    }
};

/**
 * FEATURE: Google Maps Grounding
 * Model: gemini-2.5-flash
 */
export const findPlaces = async (query: string): Promise<{text: string, chunks: any[]}> => {
    const ai = getAi();
    if (!ai) return { text: "No API Key", chunks: [] };

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: query,
            config: {
                tools: [{ googleMaps: {} }],
                systemInstruction: "You are a local guide in PNG. Find places based on the user request.",
            },
        });
        
        const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
        return { text: response.text || "No places found.", chunks };
    } catch (e) {
        console.error("Maps failed", e);
        return { text: "Map service unavailable.", chunks: [] };
    }
};

/**
 * FEATURE: Generate Video (Veo)
 * Model: veo-3.1-fast-generate-preview
 */
export const generateVeoVideo = async (prompt: string): Promise<string | null> => {
    // Re-check for key specifically for Veo as it might be set via window.aistudio
    const ai = getAi();
    if (!ai) throw new Error("API Key missing");

    try {
        console.log("Starting Veo generation...");
        let operation = await ai.models.generateVideos({
            model: 'veo-3.1-fast-generate-preview',
            prompt: prompt,
            config: {
                numberOfVideos: 1,
                resolution: '720p',
                aspectRatio: '9:16' // Portrait for mobile feed
            }
        });

        // Polling loop
        while (!operation.done) {
            await new Promise(resolve => setTimeout(resolve, 5000)); // Poll every 5s
            console.log("Polling Veo status...");
            operation = await ai.operations.getVideosOperation({ operation: operation });
        }

        const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
        if (!videoUri) return null;

        // Append key for fetching
        return `${videoUri}&key=${process.env.API_KEY}`;
    } catch (e) {
        console.error("Veo generation failed", e);
        throw e;
    }
};
