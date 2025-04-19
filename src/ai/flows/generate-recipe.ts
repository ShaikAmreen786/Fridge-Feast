'use server';

/**
 * @fileOverview Recipe generation flow.
 *
 * - generateRecipe - A function that generates a recipe based on the provided ingredients.
 * - GenerateRecipeInput - The input type for the generateRecipe function.
 * - GenerateRecipeOutput - The return type for the generateRecipe function.
 */

import {ai} from '@/ai/ai-instance';
import {z} from 'genkit';

const GenerateRecipeInputSchema = z.object({
  ingredients: z.string().describe('A comma-separated list of ingredients available.'),
});
export type GenerateRecipeInput = z.infer<typeof GenerateRecipeInputSchema>;

const GenerateRecipeOutputSchema = z.object({
  title: z.string().describe('The title of the generated recipe.'),
  ingredients: z.array(z.string()).describe('A list of ingredients required for the recipe.'),
  instructions: z.string().describe('Step-by-step instructions for preparing the recipe.'),
});
export type GenerateRecipeOutput = z.infer<typeof GenerateRecipeOutputSchema>;

export async function generateRecipe(input: GenerateRecipeInput): Promise<GenerateRecipeOutput> {
  return generateRecipeFlow(input);
}

const generateRecipePrompt = ai.definePrompt({
  name: 'generateRecipePrompt',
  input: {
    schema: z.object({
      ingredients: z.string().describe('A comma-separated list of ingredients available.'),
    }),
  },
  output: {
    schema: z.object({
      title: z.string().describe('The title of the generated recipe.'),
      ingredients: z.array(z.string()).describe('A list of ingredients required for the recipe.'),
      instructions: z.string().describe('Step-by-step instructions for preparing the recipe.'),
    }),
  },
  prompt: `You are a professional chef. Generate a recipe based on the ingredients provided. The recipe should be easy to follow and delicious.

Ingredients: {{{ingredients}}}

Consider common cooking techniques with these ingredients, as well as complementary flavors.

Output the title, the ingredients as a list, and step-by-step instructions for preparing the recipe.
`, 
});

const generateRecipeFlow = ai.defineFlow<
  typeof GenerateRecipeInputSchema,
  typeof GenerateRecipeOutputSchema
>({
  name: 'generateRecipeFlow',
  inputSchema: GenerateRecipeInputSchema,
  outputSchema: GenerateRecipeOutputSchema,
}, async input => {
  const {output} = await generateRecipePrompt(input);
  return output!;
});