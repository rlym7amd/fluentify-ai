import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, language, level, topic } = await req.json();

  // Create a system prompt based on the selected options
  const systemPrompt = `You are a helpful language tutor for ${language}. 
  The user is at a ${level} level and wants to practice a conversation about ${topic}.
  
  Your goal is to:
  1. Help them practice ${language} in a natural conversation
  2. Correct major mistakes gently
  3. Introduce new vocabulary appropriate for their ${level} level
  4. Keep the conversation focused on the ${topic} scenario
  5. Be encouraging and patient
  
  If the user is a beginner, use simple sentences and basic vocabulary.
  If the user is intermediate, you can use more complex sentences and introduce some idioms.
  If the user is advanced, challenge them with sophisticated vocabulary and complex grammatical structures.
  
  Always respond in ${language}, but for beginners, you can provide translations for difficult words.`;

  const result = streamText({
    model: openai("gpt-4o"),
    system: systemPrompt,
    messages,
  });

  return result.toDataStreamResponse();
}
