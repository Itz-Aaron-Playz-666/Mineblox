'use server';

/**
 * @fileOverview AI tool suggestion flow for the Mineblox Studio game creation.
 *
 * - suggestBuildingTools - A function that suggests appropriate building tools based on design goals and creation history.
 * - SuggestBuildingToolsInput - The input type for the suggestBuildingTools function.
 * - SuggestBuildingToolsOutput - The return type for the suggestBuildingTools function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestBuildingToolsInputSchema = z.object({
  designGoals: z
    .string()
    .describe(
      'The creator provided design goals for the game or specific game elements.'
    ),
  creationHistory: z
    .string()
    .describe(
      'A description of the creator past usage of building tools and the types of games or levels they have created.'
    ),
});
export type SuggestBuildingToolsInput = z.infer<
  typeof SuggestBuildingToolsInputSchema
>;

const SuggestBuildingToolsOutputSchema = z.object({
  suggestedTools: z.array(z.string()).describe(
    'A list of suggested in-game building tools relevant to the design goals and creation history.'
  ),
  reasoning: z
    .string()
    .describe(
      'An explanation of why each tool is suggested, including potential customizations or tunings.'
    ),
});
export type SuggestBuildingToolsOutput = z.infer<
  typeof SuggestBuildingToolsOutputSchema
>;

export async function suggestBuildingTools(
  input: SuggestBuildingToolsInput
): Promise<SuggestBuildingToolsOutput> {
  return suggestBuildingToolsFlow(input);
}

const suggestBuildingToolsPrompt = ai.definePrompt({
  name: 'suggestBuildingToolsPrompt',
  input: {schema: SuggestBuildingToolsInputSchema},
  output: {schema: SuggestBuildingToolsOutputSchema},
  prompt: `You are an expert game design assistant for Mineblox Studio, a game creation platform similar to Minecraft.

You will be provided with the game creator\'s design goals and their creation history. Based on this information, you will suggest appropriate in-game building tools that can help them achieve their goals.

In addition to listing the tools, you will also provide a brief explanation of why each tool is suggested, including potential customizations or tunings that may be necessary for optimal use. Make reasonable assumptions about what the creator wants to accomplish.

Design Goals: {{{designGoals}}}
Creation History: {{{creationHistory}}}

Suggested Tools:
{{#each suggestedTools}}
- {{this}}
{{/each}}

Reasoning: {{{reasoning}}}`,
});

const suggestBuildingToolsFlow = ai.defineFlow(
  {
    name: 'suggestBuildingToolsFlow',
    inputSchema: SuggestBuildingToolsInputSchema,
    outputSchema: SuggestBuildingToolsOutputSchema,
  },
  async input => {
    const {output} = await suggestBuildingToolsPrompt(input);
    return output!;
  }
);
