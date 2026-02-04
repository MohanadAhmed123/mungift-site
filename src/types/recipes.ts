import type { UUID } from './auth';
import type { Tag } from './tags';

export type Recipe = {
  id: UUID;
  title: string;
  description: string | null;
  thumbnail_url: string | null;
  instructions: string | null;
  notes: string | null;
  created_by: UUID | null;
  created_at: string;
  updated_at: string;
};

export type RecipeIngredient = {
  id: UUID;
  recipe_id: UUID;
  name: string;
  quantity: string | null;
  order_index: number | null;
};

export type RecipeMedia = {
  id: string
  recipe_id: string
  file_url: string
  media_type: "image" | "video" | "audio"
  sort_order: number
}

export type RecipeTagMap = {
  id: UUID;
  recipe_id: UUID;
  tag_id: UUID;
};


export type RecipeWithDetails = Recipe & {
  ingredients: RecipeIngredient[];
  tags: Tag[];
};

export type CreateRecipeInput = {
  title: string
  description?: string
  instructions?: string
  thumbnail_url?: string
  notes?: string
  ingredients: Omit<RecipeIngredient, "id" | "recipe_id">[]
  tagNames: string[]
  created_by: string
}