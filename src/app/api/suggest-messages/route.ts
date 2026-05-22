import { generateText } from 'ai';
import { openai } from '@ai-sdk/openai';
import { NextResponse } from 'next/server';

export const runtime = 'edge';

// Reliable fallback questions if AI is slow or fails
const fallbackQuestions = [
  "What's a hobby you've recently started?",
  "If you could have dinner with any historical figure, who would it be?",
  "What's a simple thing that makes you happy?"
].join('||');

export async function POST() {
  try {
    const prompt = `Create three short, engaging, open-ended questions for anonymous social interaction.
    Formatted as one string: "Q1||Q2||Q3".
    Keep them under 15 words each.
    Focus on universal, friendly themes.`;

    const { text } = await generateText({
      model: openai('gpt-4o-mini'), // Faster and more efficient than gpt-3.5
      prompt,
    });

    return NextResponse.json({ message: text || fallbackQuestions });
  } catch (error) {
    console.error('Suggest messages AI error:', error);
    // NEVER RETURN 500: Always return fallback to keep the UI working
    return NextResponse.json({ message: fallbackQuestions });
  }
}