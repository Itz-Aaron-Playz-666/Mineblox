'use server';

import { suggestBuildingTools } from '@/ai/flows/suggest-building-tools';
import { explainToolUsage } from '@/ai/flows/explain-tool-usage';
import { z } from 'zod';
import { generateAudio } from '@/ai/flows/generate-audio-flow';

const SuggestFormSchema = z.object({
  designGoals: z.string().min(10, { message: 'Please describe your design goals in more detail.' }),
  creationHistory: z.string().optional(),
});

export type SuggestionState = {
    suggestedTools?: string[];
    reasoning?: string;
    error?: string | null;
    timestamp?: number;
};

export async function suggestBuildingToolsAction(
  prevState: SuggestionState,
  formData: FormData
): Promise<SuggestionState> {
  const validatedFields = SuggestFormSchema.safeParse({
    designGoals: formData.get('designGoals'),
    creationHistory: formData.get('creationHistory'),
  });

  if (!validatedFields.success) {
    return {
      error: validatedFields.error.flatten().fieldErrors.designGoals?.join(' ') ?? 'Invalid input.',
    };
  }

  try {
    const result = await suggestBuildingTools(validatedFields.data);
    return { ...result, error: null, timestamp: Date.now() };
  } catch (e) {
    console.error(e);
    return {
      error: 'An error occurred while getting suggestions. Please try again.',
    };
  }
}

const ExplainFormSchema = z.object({
    toolName: z.string(),
    designGoal: z.string(),
});

export type ExplanationState = {
    explanation?: string;
    error?: string | null;
};

export async function explainToolUsageAction(
    toolName: string,
    designGoal: string
): Promise<ExplanationState> {

    const validatedFields = ExplainFormSchema.safeParse({ toolName, designGoal });

    if (!validatedFields.success) {
        return { error: 'Invalid input for explanation.' };
    }

    try {
        const result = await explainToolUsage(validatedFields.data);
        return { explanation: result.explanation, error: null };
    } catch (e) {
        console.error(e);
        return {
            explanation: '',
            error: 'An error occurred while getting the explanation.',
        };
    }
}

export async function generateAudioAction(text: string): Promise<{ audioDataUri?: string, error?: string }> {
  if (!text) {
    return { error: 'No text provided for audio generation.' };
  }
  try {
    const result = await generateAudio(text);
    return { audioDataUri: result.audioDataUri };
  } catch (e) {
    console.error(e);
    return { error: 'Failed to generate audio. Please try again.' };
  }
}
