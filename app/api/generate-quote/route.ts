//app/api/generate-quote/route.ts
  
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
try {
const body = await request.json();
const { occasion, language, isForSelf, subcategory, targetName, years, age, occasionName, previousQuotes = [], timestamp } = body;

console.log('📥 AI Request received:', { occasion, language, subcategory, timestamp });

// --- NVIDIA API CONFIGURATION (from .env.local) ---
const apiKey = process.env.NVIDIA_API_KEY;
const apiUrl = process.env.NVIDIA_API_URL;
const modelName = process.env.NVIDIA_MODEL;

if (!apiKey) {
  console.error('[NVIDIA] NVIDIA_API_KEY is not set in .env.local');
  throw new Error('NVIDIA_API_KEY is not set in environment variables. Add it to .env.local');
}
if (!apiUrl) {
  console.error('[NVIDIA] NVIDIA_API_URL is not set in .env.local');
  throw new Error('NVIDIA_API_URL is not set in environment variables. Add it to .env.local');
}
if (!modelName) {
  console.error('[NVIDIA] NVIDIA_MODEL is not set in .env.local');
  throw new Error('NVIDIA_MODEL is not set in environment variables. Add it to .env.local');
}

// DEBUG LOG
console.log(`🔑 [Quote API] Using API Key starting with: ${apiKey.substring(0, 15)}...`);

let prompt = '';
const lang = language === 'hindi' ? 'Hindi (Devanagari script)' : 'English';
const avoidInstruction = previousQuotes.length > 0
? `\n\nIMPORTANT: Generate a UNIQUE quote. Do NOT repeat or closely resemble these previous quotes:\n${previousQuotes.map((q: string, i: number) => `${i + 1}. ${q}`).join('\n')}\n\nGenerate something completely different with different words, tone, and structure.`
: '';

if (isForSelf) {
if (occasion === 'BIRTHDAY') {
const ageNum = age || years || '';
prompt = language === 'hindi'
? `${ageNum ? `${ageNum}वाँ ` : ''}जन्मदिन पर खुद के लिए 1-2 पंक्तियाँ लिखें जो हिंदी (देवनागरी) में हों। संदेश में: आज ${ageNum ? `${ageNum}वाँ` : ''} जन्मदिन है, भगवान से पिछली गलतियों की क्षमा मांगें, आगे अच्छा करने का संकल्प लें। केवल संदेश लिखें।${avoidInstruction}`
: `Write exactly 1-2 lines in English for someone writing about themselves on their${ageNum ? ` ${ageNum}th` : ''} birthday. Ask God for forgiveness, pray for good things ahead. Only the message.${avoidInstruction}`;
} else if (occasion === 'RELATIONSHIP' || occasion === 'MARRIAGE') {
prompt = language === 'hindi'
? `एनिवर्सरी पर खुद के लिए 1-2 पंक्तियाँ हिंदी (देवनागरी) में लिखें। भगवान का धन्यवाद इतने अच्छे साथी के लिए। केवल संदेश लिखें।${avoidInstruction}`
: `Write exactly 1-2 lines in English for someone writing about themselves and their partner on their anniversary. Thank God for such a wonderful partner. Only the message.${avoidInstruction}`;
} else {
prompt = `Write exactly 2 lines message for ${subcategory} in ${lang}. First-person tone. No extra text.${avoidInstruction}`;
}
} else {
prompt = `Write exactly 2 lines wish/message for ${occasion || subcategory} in ${lang}. Use placeholders like [Name] or [Date] if needed. Third-person tone. No extra text.${avoidInstruction}`;
}

const systemPromptText = 'You are a professional quote and message writer. Write heartfelt, concise celebration messages as requested. Return your response as a JSON object with a single "quote" field containing only the message text. Example: {"quote": "Your message here"}';

console.log('[NVIDIA] Calling API with model from env...');

const nvidiaResponse = await fetch(apiUrl, {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${apiKey}`,
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  body: JSON.stringify({
    model: modelName,
    messages: [
      {
        role: 'system',
        content: systemPromptText
      },
      {
        role: 'user',
        content: prompt
      }
    ],
    temperature: 0.9,
    top_p: 0.9,
    max_tokens: 150,
    response_format: { type: 'json_object' },
    stream: false,
  }),
});

if (!nvidiaResponse.ok) {
  const errBody = await nvidiaResponse.text();
  console.error('❌ API Error [Quote]:', errBody);
  console.error(`[NVIDIA] API call failed: Status ${nvidiaResponse.status}, Body: ${errBody}`);
  throw new Error(`NVIDIA API call failed with status ${nvidiaResponse.status}: ${errBody}`);
}

const nvidiaData = await nvidiaResponse.json();
console.log('[NVIDIA] API response received successfully');

const aiContent = nvidiaData?.choices?.[0]?.message?.content;

if (!aiContent) {
  console.error('[NVIDIA] No content in API response:', JSON.stringify(nvidiaData).substring(0, 500));
  return NextResponse.json({ quote: getFallbackQuote(occasion, subcategory, language, isForSelf), fallback: true });
}

console.log('[NVIDIA] AI content preview:', aiContent.substring(0, 200));

// Parse JSON response (response_format guarantees valid JSON) to extract the quote string
let quote = '';
try {
  const parsed = JSON.parse(aiContent);
  quote = parsed.quote || parsed.message || parsed.text || parsed.content || '';
} catch {
  // Extra safety: if parse fails despite response_format, use content directly
  quote = aiContent.trim();
}

if (!quote) {
  return NextResponse.json({ quote: getFallbackQuote(occasion, subcategory, language, isForSelf), fallback: true });
}

quote = quote.replace(/^[\"']|[\"']$/g, '').replace(/^\d+\.\s*/gm, '').replace(/^[-•]\s*/gm, '').trim();
const lines = quote.split('\n').filter((l: string) => l.trim());
if (lines.length > 2) quote = lines.slice(0, 2).join('\n');

return NextResponse.json({ quote, fallback: false });

} catch (error: any) {
console.error('💥 Server error:', error.message);
try {
const reqBody = await request.json();
return NextResponse.json({ quote: getFallbackQuote(reqBody.occasion, reqBody.subcategory, reqBody.language, reqBody.isForSelf), fallback: true });
} catch {
return NextResponse.json({ quote: getFallbackQuote('', '', 'english'), fallback: true });
}
}
}

function getFallbackQuote(occasion: string, subcategory: string, language: string, isForSelf?: boolean): string {
const isHindi = language === 'hindi';
if (isForSelf) {
if (occasion === 'BIRTHDAY') return isHindi ? 'आज मेरा जन्मदिन है। हे प्रभु, मेरी गलतियों को माफ करें और आगे मुझे अच्छे मार्ग पर चलने की शक्ति दें।' : 'Today is my birthday. Dear God, please forgive my mistakes and give me the strength to walk on the right path.';
if (occasion === 'RELATIONSHIP') return isHindi ? 'आज हमारी रिलेशनशिप एनिवर्सरी है। हे भगवान, इतने अच्छे साथी के लिए धन्यवाद, हमारा रिश्ता सदा प्रेम से भरा रहे।' : 'Today is our relationship anniversary. Thank you, God, for such a wonderful partner — may our bond always be filled with love.';
if (occasion === 'MARRIAGE') return isHindi ? 'आज हमारी विवाह वर्षगांठ है। हे ईश्वर, इतने अच्छे जीवनसाथी के लिए धन्यवाद, हमारा वैवाहिक जीवन सदा सुखी रहे।' : 'Today is our wedding anniversary. Thank you, God, for such a wonderful life partner — may our marriage always remain happy.';
}
if (occasion === 'BIRTHDAY') return isHindi ? '[Name] को जन्मदिन की हार्दिक शुभकामनाएं।\nआपका जीवन खुशियों से भरा रहे।' : 'Warmest birthday wishes to [Name].\nMay your life be filled with happiness.';
if (occasion === 'MARRIAGE' || occasion === 'RELATIONSHIP') return isHindi ? '[Name] को [Years] वर्षों की यात्रा पर बधाई।\nयह प्यार हमेशा बना रहे।' : 'Congratulations to [Name] on [Years] years together.\nMay this love last forever.';
if (subcategory === 'JYANTI') return isHindi ? '[Naam] की जयंती पर उनके आदर्शों को नमन।\nउनका जीवन हमारे लिए प्रेरणा है।' : 'Salutations to [Naam] on their Jayanti.\nTheir life is an inspiration for us.';
if (subcategory === 'DIVAS') return isHindi ? '[Divas ka Naam] पर जागरूकता का संदेश।\nआइए इसे सार्थक बनाएं।' : 'Awareness message on [Divas ka Naam].\nLet us make it meaningful.';
if (subcategory === 'FESTIVALS') return isHindi ? '[Festival Name] की हार्दिक शुभकामनाएं।\nयह त्योहार खुशियां लाए।' : 'Heartfelt wishes on [Festival Name].\nMay this festival bring joy.';
if (subcategory === 'MARRIAGE_DATE_FIX') return isHindi ? '[Name 1] और [Name 2] के विवाह की तिथि [Date] निश्चित हुई।\nहार्दिक शुभकामनाएं।' : 'Wedding date of [Name 1] and [Name 2] fixed on [Date].\nBest wishes.';
if (subcategory === 'NEW_MEMBERS') return isHindi ? '[Date] को [Time] पर एक नए सदस्य का स्वागत।\nपरिवार को बधाई।' : 'Welcoming a new member on [Date] at [Time].\nCongratulations to the family.';
return isHindi ? 'इस खास अवसर पर ढेर सारी शुभकामनाएं।\nखुशियां हमेशा बनी रहें।' : 'Warmest wishes on this special occasion.\nMay happiness always remain.';
}
