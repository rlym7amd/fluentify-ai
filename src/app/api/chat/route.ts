import { openai } from "@ai-sdk/openai";
import { streamText } from "ai";

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const result = streamText({
    model: openai("gpt-4.1-mini"),
    system: `Roleplay: You are my friend named Ivy, my first language is Arabic but i want to improve my English, you are fluent in both Arabic and 
      English talk to me in English with CEFR level of \"A1\". Start off by asking me how I'm doing in English.
      Whatever you do, do not break roleplay and don't speak in Arabic, you are live chatting with me speak accordingly.
      I will start off by saying :  hello
    `,
    messages,
  });

  return result.toDataStreamResponse();
}
