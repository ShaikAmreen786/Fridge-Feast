// src/ai/flows/improve-recipe.ts
'use server';
/**
 * @fileOverview Flow for refining a generated recipe based on user feedback.
 *
 * - improveRecipe - The main function to refine a recipe.
 * - ImproveRecipeInput - Input schema for the improveRecipe function.
 * - ImproveRecipeOutput - Output schema for the improveRecipe function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const ImproveRecipeInputSchema = z.object({
  recipe: z.string().describe('The recipe to improve.'),
  feedback: z.string().describe('The user feedback on the recipe.'),
});
export type ImproveRecipeInput = z.infer<typeof ImproveRecipeInputSchema>;

const ImproveRecipeOutputSchema = z.object({
  improvedRecipe: z.string().describe('The improved recipe based on the feedback.'),
});
export type ImproveRecipeOutput = z.infer<typeof ImproveRecipeOutputSchema>;

export async function improveRecipe(input: ImproveRecipeInput): Promise<ImproveRecipeOutput> {
  return improveRecipeFlow(input);
}

const prompt = ai.definePrompt({
  name: 'improveRecipePrompt',
  input: {
    schema: z.object({
      recipe: z.string().describe('The recipe to improve.'),
      feedback: z.string().describe('The user feedback on the recipe.'),
    }),
  },
  output: {
    schema: z.object({
      improvedRecipe: z.string().describe('The improved recipe based on the feedback.'),
    }),
  },
  prompt: `You are a recipe refinement expert. A user has provided feedback on a generated recipe, and your task is to improve the recipe based on that feedback.

Recipe:
{{recipe}}

Feedback:
{{feedback}}

Improved Recipe:`, // No Handlebars logic
});

const improveRecipeFlow = ai.defineFlow<
  typeof ImproveRecipeInputSchema,
  typeof ImproveRecipeOutputSchema
>({
  name: 'improveRecipeFlow',
  inputSchema: ImproveRecipeInputSchema,
  outputSchema: ImproveRecipeOutputSchema,
},
async input => {
  const {output} = await prompt(input);
  return {improvedRecipe: output!.improvedRecipe!};
});

