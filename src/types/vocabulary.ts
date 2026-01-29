import type { UUID } from './auth';
import type { Tag } from './tags';

export type VocabularyWord = {
  id: UUID;
  word: string;
  definition: string;
  example: string | null;
  notes: string | null;
  coined_by: string | null;
  created_by: UUID | null;
  created_at: string;
  updated_at: string;
  linked_words: string[] | null;
};

export type VocabularyFormValues = {
  word: string
  definition: string
  example: string
  notes: string
  linkedWords: string
  coinedBy?: string
};


export type VocabularyTagMap = {
  id: UUID;
  vocabulary_id: UUID;
  tag_id: UUID;
};


// export type VocabularyLink = {
//   id: UUID;
//   word_id: UUID;
//   linked_word_id: UUID;
// };

export type VocabularyWordWithTags = VocabularyWord & {
  tags: Tag[];
};