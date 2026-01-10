import type { UUID } from './auth';
import type { Tag } from './tags';

export type Recipe = {
  id: UUID;
  title: string;
  description: string | null;
  image_url: string | null;
  instructions: string | null;
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

export type RecipeTagMap = {
  id: UUID;
  recipe_id: UUID;
  tag_id: UUID;
};


export type RecipeWithDetails = Recipe & {
  ingredients: RecipeIngredient[];
  tags: Tag[];
};