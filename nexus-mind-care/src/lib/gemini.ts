// src/lib/gemini.ts - Mental Health AI Service
// Complete rebuild with crisis detection and direct Gemini API calls

import { GoogleGenerativeAI, GenerativeModel } from '@google/generative-ai';

// Get API keys from environment
const PRIMARY_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const FALLBACK_API_KEY = import.meta.env.VITE_GEMINI_FALLBACK_API_KEY;
const API_KEY = PRIMARY_API_KEY || FALLBACK_API_KEY;

// Mental Health System Prompt
const SYSTEM_PROMPT = `You are Manas Svasthya, a compassionate AI mental health companion designed for college students in India.

## Your Role:
- Provide supportive, empathetic, and understanding responses
- Help with academic stress, anxiety, relationships, sleep issues, loneliness
- Always prioritize safety and crisis intervention
- Be culturally sensitive to Indian student experiences

## Response Guidelines:
1. **Validate feelings first** - "I understand that must be really difficult..."
2. **Be warm and conversational** - Use friendly, supportive language
3. **Offer practical advice** - Specific coping strategies when appropriate
4. **Keep responses concise** - 2-4 sentences typically, unless the situation needs more
5. **Encourage professional help** when needed - "Have you considered talking to a counselor?"

## Topics You Help With:
- Academic stress and exam anxiety
- Social anxiety and making friends
- Relationship challenges
- Sleep problems and wellness
- Career and future planning worries
- Financial stress
- Homesickness and adjustment
- General emotional support

## What NOT to Do:
- Never diagnose medical or psychiatric conditions
- Never recommend specific medications
- Never minimize serious concerns
- Never delay crisis intervention`;

// Crisis keywords for immediate detection
const CRISIS_KEYWORDS = [
  'want to die', 'kill myself', 'end my life', 'suicide',
  'hurt myself', 'don\'t want to live', 'ending it all',
  'want to disappear', 'wish i was dead', 'better off dead',
  'no reason to live', 'can\'t go on', 'want it to end',
  'harm myself', 'cut myself', 'overdose'
];

// Crisis response with emergency contacts
const CRISIS_RESPONSE = `I'm really concerned about what you're sharing with me. Your life has value and there are people who want to help you right now.

🚨 **PLEASE REACH OUT IMMEDIATELY:**

**India Helplines:**
• **iCall**: 9152987821 (Mon-Sat, 8am-10pm)
• **Vandrevala Foundation**: 1860-2662-345 (24/7)
• **KIRAN Mental Health**: 1800-599-0019 (24/7, Toll-free)
• **Snehi**: 044-24640050 (24/7)

**Emergency:**
• **112** (India Emergency Number)
• Go to your nearest hospital emergency room

**Campus Resources:**
• Contact your college counseling center
• Reach out to a trusted professor or warden

You are NOT alone. Please call one of these numbers right now. Your safety is the most important thing. ❤️

I'm here to talk, but please also reach out to these professionals who can help you in person.`;

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface MedicineAnalysis {
  name: string;
  uses: string[];
  dosage: {
    adult: string;
    pediatric: string;
  };
  sideEffects: string[];
  warnings: string[];
  safetyVerdict: string;
  confidence: number;
}

export class MentalHealthAI {
  private genAI: GoogleGenerativeAI | null = null;
  private model: GenerativeModel | null = null;
  private chatHistory: ChatMessage[] = [];
  private hasApiKey: boolean = false;

  constructor() {
    console.log('🔧 MentalHealthAI Constructor - Checking API keys...');
    console.log('  - PRIMARY_API_KEY exists:', !!PRIMARY_API_KEY);
    console.log('  - FALLBACK_API_KEY exists:', !!FALLBACK_API_KEY);
    console.log('  - API_KEY exists:', !!API_KEY);

    if (API_KEY) {
      try {
        this.genAI = new GoogleGenerativeAI(API_KEY);
        this.model = this.genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        this.hasApiKey = true;
        console.log('✅ MentalHealthAI initialized successfully with Gemini 2.0 Flash');
      } catch (initError) {
        console.error('❌ Failed to initialize Gemini:', initError);
      }
    } else {
      console.warn('⚠️ No Gemini API key found - AI responses will be limited');
      console.warn('  Make sure VITE_GEMINI_API_KEY is set in .env file');
    }
  }

  // Check if message contains crisis indicators
  private isCrisisMessage(message: string): boolean {
    const lowerMessage = message.toLowerCase();
    return CRISIS_KEYWORDS.some(keyword => lowerMessage.includes(keyword));
  }

  // Check if last response was a crisis response
  isLastResponseCrisis(): boolean {
    if (this.chatHistory.length === 0) return false;
    const lastMessage = this.chatHistory[this.chatHistory.length - 1];
    return lastMessage.role === 'assistant' && lastMessage.content.includes('🚨');
  }

  // Get API key status for debugging
  getApiKeyStatus() {
    return {
      hasKey: this.hasApiKey,
      keyType: PRIMARY_API_KEY ? 'primary' : (FALLBACK_API_KEY ? 'fallback' : 'none')
    };
  }

  // Main chat method - simple and reliable
  async chat(userMessage: string): Promise<string> {
    console.log('📨 User message:', userMessage);

    // Add user message to history
    this.chatHistory.push({
      role: 'user',
      content: userMessage,
      timestamp: new Date()
    });

    // CRISIS CHECK FIRST - Always prioritize safety
    if (this.isCrisisMessage(userMessage)) {
      console.log('🚨 Crisis detected - returning emergency response');
      this.chatHistory.push({
        role: 'assistant',
        content: CRISIS_RESPONSE,
        timestamp: new Date()
      });
      return CRISIS_RESPONSE;
    }

    // No API key - return helpful fallback
    if (!this.model) {
      const fallbackResponse = "I'm here to support you, but I'm having trouble connecting to my AI service right now. Please try again in a moment, or if you're in crisis, please call KIRAN at 1800-599-0019.";
      this.chatHistory.push({
        role: 'assistant',
        content: fallbackResponse,
        timestamp: new Date()
      });
      return fallbackResponse;
    }

    try {
      // Build conversation context
      const recentHistory = this.chatHistory.slice(-6);
      let context = SYSTEM_PROMPT + "\n\n--- Conversation ---\n";

      for (const msg of recentHistory) {
        const role = msg.role === 'user' ? 'Student' : 'Manas Svasthya';
        context += `${role}: ${msg.content}\n`;
      }

      context += "\nRespond as Manas Svasthya (warm, supportive, 2-4 sentences):";

      // Call Gemini API
      console.log('🤖 Calling Gemini API...');
      const result = await this.model.generateContent(context);
      const response = result.response.text();
      console.log('✅ AI Response received');

      // Add AI response to history
      this.chatHistory.push({
        role: 'assistant',
        content: response,
        timestamp: new Date()
      });

      // Trim history if too long
      if (this.chatHistory.length > 20) {
        this.chatHistory = this.chatHistory.slice(-20);
      }

      return response;

    } catch (error) {
      console.error('❌ AI Error - Full details:', error);

      // Log more specific error info
      if (error instanceof Error) {
        console.error('  - Error name:', error.name);
        console.error('  - Error message:', error.message);

        // Try fallback model on quota errors (429)
        if (error.message.includes('429') || error.message.includes('quota') || error.message.includes('exhausted')) {
          console.log('🔄 Trying fallback model (gemini-2.0-flash-lite)...');
          try {
            const fallbackModel = this.genAI!.getGenerativeModel({ model: "gemini-2.0-flash-lite" });
            const recentHistory = this.chatHistory.slice(-6);
            let context = SYSTEM_PROMPT + "\n\n--- Conversation ---\n";
            for (const msg of recentHistory) {
              const role = msg.role === 'user' ? 'Student' : 'Manas Svasthya';
              context += `${role}: ${msg.content}\n`;
            }
            context += "\nRespond as Manas Svasthya (warm, supportive, 2-4 sentences):";

            const result = await fallbackModel.generateContent(context);
            const response = result.response.text();
            console.log('✅ Fallback model succeeded!');

            this.chatHistory.push({
              role: 'assistant',
              content: response,
              timestamp: new Date()
            });
            return response;
          } catch (fallbackError) {
            console.error('❌ Fallback model also failed:', fallbackError);
          }
        }
      }

      // User-friendly error messages
      let errorMessage = "I'm sorry, I'm having trouble responding right now. Please try again in a moment.";

      if (error instanceof Error) {
        const msg = error.message.toLowerCase();
        if (msg.includes('quota') || msg.includes('limit') || msg.includes('rate') || msg.includes('429')) {
          errorMessage = "I'm experiencing high demand right now. Please try again in a few minutes, or use a different Google account to create a new API key.";
        } else if (msg.includes('api_key') || msg.includes('api key') || msg.includes('invalid')) {
          errorMessage = "There's a configuration issue with the API key. Please contact support.";
        } else if (msg.includes('network') || msg.includes('fetch') || msg.includes('connect')) {
          errorMessage = "I'm having trouble connecting. Please check your internet connection.";
        }
      }

      this.chatHistory.push({
        role: 'assistant',
        content: errorMessage,
        timestamp: new Date()
      });

      return errorMessage;
    }
  }

  // Streaming version for real-time typing effect
  async sendMessageStream(
    userMessage: string,
    onChunk: (text: string) => void,
    onDone?: (fullText: string) => void,
    onError?: (err: Error) => void
  ): Promise<void> {
    try {
      const response = await this.chat(userMessage);

      // Simulate streaming by splitting into words
      const words = response.split(' ');
      let accumulated = '';

      for (let i = 0; i < words.length; i++) {
        accumulated += (i === 0 ? '' : ' ') + words[i];
        onChunk(accumulated);
        await new Promise(resolve => setTimeout(resolve, 30)); // 30ms per word
      }

      if (onDone) onDone(response);
    } catch (error) {
      if (onError) onError(error as Error);
    }
  }

  // Clear chat history
  clearHistory(): void {
    this.chatHistory = [];
    console.log('🗑️ Chat history cleared');
  }

  // Get chat history
  getHistory(): ChatMessage[] {
    return [...this.chatHistory];
  }

  // Simple message method for non-chat purposes like mood analysis
  async sendMessage(prompt: string): Promise<string> {
    console.log('📤 Sending message to Gemini for analysis...');

    if (!this.model) {
      console.warn('⚠️ API not available');
      return JSON.stringify({
        primary_mood: "neutral",
        confidence: 0.3,
        emotions: [{ emotion: "unknown", score: 0.5 }],
        insights: "AI analysis temporarily unavailable. Your entry has been saved."
      });
    }

    try {
      const result = await this.model.generateContent(prompt);
      const response = result.response.text();
      console.log('✅ Analysis response received');
      return response;
    } catch (error) {
      console.error('❌ Analysis error:', error);

      // Try fallback model
      if (error instanceof Error && (error.message.includes('429') || error.message.includes('quota'))) {
        console.log('🔄 Trying fallback model...');
        try {
          const fallbackModel = this.genAI!.getGenerativeModel({ model: "gemini-2.0-flash-lite" });
          const result = await fallbackModel.generateContent(prompt);
          return result.response.text();
        } catch {
          console.error('❌ Fallback also failed');
        }
      }

      return JSON.stringify({
        primary_mood: "neutral",
        confidence: 0.3,
        emotions: [{ emotion: "unknown", score: 0.5 }],
        insights: "Could not analyze mood. Please try again later."
      });
    }
  }
}

// Medicine Analysis Service - Updated for Gemini 2.0
export class MedicineImageAnalysisService {
  private genAI: GoogleGenerativeAI | null = null;
  private model: GenerativeModel | null = null;
  private hasApiKey: boolean = false;

  constructor() {
    console.log('🔧 MedicineAnalysisService - Initializing...');
    if (API_KEY) {
      try {
        this.genAI = new GoogleGenerativeAI(API_KEY);
        this.model = this.genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
        this.hasApiKey = true;
        console.log('✅ MedicineAnalysisService initialized with gemini-2.0-flash');
      } catch (error) {
        console.error('❌ Failed to initialize MedicineAnalysisService:', error);
      }
    } else {
      console.warn('⚠️ No API key for MedicineAnalysisService');
    }
  }

  async analyzeMedicineImage(imageData: string): Promise<MedicineAnalysis> {
    console.log('📷 Analyzing medicine image...');

    if (!this.model || !this.genAI) {
      console.warn('⚠️ API not available for image analysis');
      return this.getFallbackResponse('Unknown Medicine');
    }

    try {
      // Extract base64 data from data URL
      const base64Data = imageData.split(',')[1];
      const mimeType = imageData.split(';')[0].split(':')[1] || 'image/jpeg';

      // Use Gemini Vision to analyze the image
      const prompt = `Analyze this medicine/pill image. Identify the medicine and provide information in this exact JSON format:
{
  "name": "Medicine Name",
  "uses": ["Primary use 1", "Use 2"],
  "dosage": {
    "adult": "Typical adult dosage",
    "pediatric": "Pediatric dosage or 'Consult pediatrician'"
  },
  "sideEffects": ["Side effect 1", "Side effect 2"],
  "warnings": ["Warning 1", "Warning 2"],
  "safetyVerdict": "Brief safety assessment",
  "confidence": 85
}

If you cannot identify the medicine clearly, set confidence to a low value and indicate uncertainty in the name. Always include appropriate medical disclaimers.`;

      const result = await this.model.generateContent([
        prompt,
        {
          inlineData: {
            data: base64Data,
            mimeType: mimeType
          }
        }
      ]);

      const text = result.response.text();
      console.log('📷 Image analysis response:', text);

      // Parse JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          name: parsed.name || 'Unknown Medicine',
          uses: parsed.uses || ['Please consult a healthcare provider'],
          dosage: parsed.dosage || { adult: 'Consult physician', pediatric: 'Consult pediatrician' },
          sideEffects: parsed.sideEffects || ['Check package insert'],
          warnings: parsed.warnings || ['Always consult healthcare provider before use'],
          safetyVerdict: parsed.safetyVerdict || 'Please verify with a healthcare professional',
          confidence: parsed.confidence || 50
        };
      }

      return this.getFallbackResponse('Could not identify medicine');
    } catch (error) {
      console.error('❌ Image analysis error:', error);

      // Try fallback model on quota errors
      if (error instanceof Error && (error.message.includes('429') || error.message.includes('quota'))) {
        console.log('🔄 Trying fallback model for image analysis...');
        try {
          const fallbackModel = this.genAI!.getGenerativeModel({ model: "gemini-2.0-flash-lite" });
          // For lite model, just describe based on text since it might not support images as well
          return this.getFallbackResponse('API quota exceeded - please try again later');
        } catch {
          console.error('❌ Fallback also failed');
        }
      }

      return this.getFallbackResponse('Analysis failed');
    }
  }

  async analyzeMedicineText(medicineName: string): Promise<MedicineAnalysis> {
    console.log('💊 Analyzing medicine by name:', medicineName);

    if (!this.model) {
      console.warn('⚠️ API not available for text analysis');
      return this.getFallbackResponse(medicineName);
    }

    try {
      const prompt = `You are a medical information assistant. Analyze this medicine: "${medicineName}".

Provide accurate medical information in this exact JSON format:
{
  "name": "${medicineName}",
  "uses": ["Primary therapeutic use", "Secondary use if applicable"],
  "dosage": {
    "adult": "Standard adult dosage with frequency",
    "pediatric": "Pediatric dosage or 'Consult pediatrician'"
  },
  "sideEffects": ["Common side effect 1", "Common side effect 2", "Less common side effect"],
  "warnings": ["Important warning 1", "Drug interaction warning", "Contraindication"],
  "safetyVerdict": "Brief overall safety assessment with recommendation to consult healthcare provider",
  "confidence": 90
}

Be medically accurate. Include standard disclaimers. If the medicine name is unclear or you're unsure, lower the confidence score and indicate uncertainty.`;

      const result = await this.model.generateContent(prompt);
      const text = result.response.text();
      console.log('💊 Medicine text analysis response received');

      // Parse JSON from response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[0]);
        return {
          name: parsed.name || medicineName,
          uses: parsed.uses || ['Please consult a healthcare provider'],
          dosage: parsed.dosage || { adult: 'Consult physician', pediatric: 'Consult pediatrician' },
          sideEffects: parsed.sideEffects || ['Check package insert'],
          warnings: parsed.warnings || ['Always consult healthcare provider before use'],
          safetyVerdict: parsed.safetyVerdict || 'Please verify with a healthcare professional',
          confidence: parsed.confidence || 70
        };
      }

      throw new Error('Could not parse response');
    } catch (error) {
      console.error('❌ Text analysis error:', error);

      // Try fallback model on quota errors
      if (error instanceof Error && (error.message.includes('429') || error.message.includes('quota'))) {
        console.log('🔄 Trying fallback model for text analysis...');
        try {
          const fallbackModel = this.genAI!.getGenerativeModel({ model: "gemini-2.0-flash-lite" });
          const prompt = `Briefly describe the medicine "${medicineName}" in JSON format with: name, uses (array), dosage (adult, pediatric), sideEffects (array), warnings (array), safetyVerdict, confidence (1-100).`;

          const result = await fallbackModel.generateContent(prompt);
          const text = result.response.text();
          const jsonMatch = text.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const parsed = JSON.parse(jsonMatch[0]);
            return {
              name: parsed.name || medicineName,
              uses: parsed.uses || ['Consult pharmacist'],
              dosage: parsed.dosage || { adult: 'Consult physician', pediatric: 'Consult pediatrician' },
              sideEffects: parsed.sideEffects || ['Check package insert'],
              warnings: parsed.warnings || ['Consult healthcare provider'],
              safetyVerdict: parsed.safetyVerdict || 'Verify with healthcare professional',
              confidence: parsed.confidence || 60
            };
          }
        } catch (fallbackError) {
          console.error('❌ Fallback also failed:', fallbackError);
        }
      }

      return this.getFallbackResponse(medicineName);
    }
  }

  private getFallbackResponse(medicineName: string): MedicineAnalysis {
    return {
      name: medicineName,
      uses: ['AI analysis temporarily unavailable - please consult a pharmacist or doctor'],
      dosage: { adult: 'Consult physician', pediatric: 'Consult pediatrician' },
      sideEffects: ['Check package insert for complete information'],
      warnings: ['Always consult healthcare provider before taking any medication'],
      safetyVerdict: 'Please verify with a healthcare professional for accurate information',
      confidence: 20
    };
  }
}

// Export singleton instances
export const geminiService = new MentalHealthAI();
export const mentalHealthAI = geminiService; // Alias for clarity
export const medicineAnalysisService = new MedicineImageAnalysisService();

// Test function for debugging
export const testMedicineAPI = async (medicineName: string): Promise<MedicineAnalysis> => {
  return medicineAnalysisService.analyzeMedicineText(medicineName);
};
