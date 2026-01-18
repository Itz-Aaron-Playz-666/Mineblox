'use server';

/**
 * @fileOverview An AI agent that explains why a suggested tool may be valuable for game creation, including customization tips.
 *
 * - explainToolUsage - A function that handles the tool usage explanation process.
 * - ExplainToolUsageInput - The input type for the explainToolUsage function.
 * - ExplainToolUsageOutput - The return type for the explainToolUsage function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExplainToolUsageInputSchema = z.object({
  toolName: z.string().describe('The name of the tool to explain.'),
  designGoal: z.string().describe('The user\'s design goal for their game.'),
  creationHistory: z.string().optional().describe('The user\'s creation history in the game studio.'),
});
export type ExplainToolUsageInput = z.infer<typeof ExplainToolUsageInputSchema>;

const ExplainToolUsageOutputSchema = z.object({
  explanation: z.string().describe('An explanation of why the suggested tool is valuable, including customization tips.'),
});
export type ExplainToolUsageOutput = z.infer<typeof ExplainToolUsageOutputSchema>;

export async function explainToolUsage(input: ExplainToolUsageInput): Promise<ExplainToolUsageOutput> {
  return explainToolUsageFlow(input);
}

const prompt = ai.definePrompt({
  name: 'explainToolUsagePrompt',
  input: {schema: ExplainToolUsageInputSchema},
  output: {schema: ExplainToolUsageOutputSchema},
  prompt: `You are an AI assistant in the Mineblox game creation studio. Your role is to explain the value of suggested tools to game creators, and to provide customization tips so that the game creators can effectively use the suggested tools. 

  The tool to explain is: {{{toolName}}}.
  The game creator\'s design goal is: {{{designGoal}}}.
  The game creator\'s creation history is: {{{creationHistory}}}

  Explain why the suggested tool may be valuable, and include customization tips. Make reasonable assumptions to provide useful customizations.
  `,
});

const explainToolUsageFlow = ai.defineFlow(
  {
    name: 'explainToolUsageFlow',
    inputSchema: ExplainToolUsageInputSchema,
    outputSchema: ExplainToolUsageOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
