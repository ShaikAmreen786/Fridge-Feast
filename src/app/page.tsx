
'use client';

import React, {useState, useEffect} from 'react';
import {Input} from '@/components/ui/input';
import {Button} from '@/components/ui/button';
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from '@/components/ui/card';
import {generateRecipe} from '@/ai/flows/generate-recipe';
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from '@/components/ui/select';
import {ScrollArea} from "@/components/ui/scroll-area"
import {CookingPot} from 'lucide-react';

// Placeholder type for default recipes
type Recipe = {
  title: string;
  ingredients: string[];
  instructions: string;
};

// Import default recipes
import defaultRecipes from './default-recipes.json';

export default function Home() {
  const [ingredients, setIngredients] = useState('');
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [selectedFallbackRecipe, setSelectedFallbackRecipe] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerateRecipe = async () => {
    setLoading(true);
    try {
      const generatedRecipe = await generateRecipe({ingredients});
      if (generatedRecipe) {
        setRecipe({
          title: generatedRecipe.title,
          ingredients: generatedRecipe.ingredients,
          instructions: generatedRecipe.instructions,
        });
        setSelectedFallbackRecipe(null);
      } else {
        setRecipe(null);
      }
    } catch (error) {
      console.error('Failed to generate recipe:', error);
      setRecipe(null);
    } finally {
      setLoading(false);
    }
  };

  const handleFallbackRecipeSelect = () => {
    if (selectedFallbackRecipe) {
      const fallback = defaultRecipes.find((r) => r.title === selectedFallbackRecipe);
      if (fallback) {
        setRecipe(fallback);
      }
    }
  };

  useEffect(() => {
    if (selectedFallbackRecipe) {
      handleFallbackRecipeSelect();
    }
  }, [selectedFallbackRecipe]);

  return (
    <div className="flex flex-col items-center justify-start min-h-screen bg-background p-4 sm:p-6 md:p-8">
      <Card className="w-full max-w-md space-y-4 bg-card shadow-md rounded-lg p-4">
        <CardHeader>
          <CardTitle className="text-2xl font-semibold tracking-tight">Fridge Feast</CardTitle>
          <CardDescription>
            Enter the ingredients you have and let us generate a delicious recipe for you!
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="grid gap-2">
            <Input
              type="text"
              placeholder="Enter ingredients separated by commas"
              value={ingredients}
              onChange={(e) => setIngredients(e.target.value)}
            />
            <Button onClick={handleGenerateRecipe} disabled={loading}>
              {loading ? 'Generating...' : 'Generate Recipe'}
            </Button>
          </div>
        </CardContent>
      </Card>

      {recipe ? (
        <Card className="w-full max-w-md mt-6 space-y-4 bg-card shadow-md rounded-lg p-4">
          <CardHeader>
            <CardTitle className="text-xl font-semibold tracking-tight">{recipe.title}</CardTitle>
            <CardDescription>Here is your recipe!</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <h3 className="text-lg font-medium">Ingredients:</h3>
                <ScrollArea className="h-[100px] w-full rounded-md border">
              <ul className="list-disc list-inside pl-4">
                {recipe.ingredients.map((ingredient, index) => (
                  <li key={index}>{ingredient}</li>
                ))}
              </ul>
                </ScrollArea>
            </div>
            <div className="space-y-1">
              <h3 className="text-lg font-medium">Instructions:</h3>
                <ScrollArea className="h-[200px] w-full rounded-md border">
              <p className="text-sm">{recipe.instructions}</p>
                </ScrollArea>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card className="w-full max-w-md mt-6 space-y-4 bg-card shadow-md rounded-lg p-4">
          <CardHeader>
            <CardTitle className="text-xl font-semibold tracking-tight">
              No recipe found?
            </CardTitle>
            <CardDescription>
              Select a fallback recipe from our collection:
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Select onValueChange={(value) => setSelectedFallbackRecipe(value)}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a fallback recipe" />
              </SelectTrigger>
              <SelectContent>
                {defaultRecipes.map((recipe) => (
                  <SelectItem key={recipe.title} value={recipe.title}>
                    {recipe.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      )}
       <footer className="mt-8 text-center text-muted-foreground">
        <p>
          Made with <CookingPot className="inline-block h-4 w-4 align-middle" /> by Firebase Studio
        </p>
      </footer>
    </div>
  );
}

