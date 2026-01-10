import type { UUID } from './auth';
import type { Tag } from './tags';

export type TextEntry = {
  id: UUID;
  title: string;
  author: string | null;
  content: string;
  created_by: UUID | null;
  created_at: string;
  updated_at: string;
};

export type TextEntryTagMap = {
  id: UUID;
  text_entry_id: UUID;
  tag_id: UUID;
};


export type TextEntryWithTags = TextEntry & {
  tags: Tag[];
};