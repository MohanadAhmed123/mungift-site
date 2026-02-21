import type { UUID } from './auth';

export type MediaType = 'image' | 'video' | 'audio';

export type MediaItem = {
  id: UUID;
  file_url: string;
  file_type: MediaType;
  caption: string | null;
  created_by: UUID | null;
  created_at: string;
  updated_at: string;
};

export type MediaTagMap = {
  id: UUID;
  media_id: UUID;
  tag_id: UUID;
};


export type MediaItemWithTags = MediaItem & {
  tags: {
    id: string;
    name: string;
  }[];
};

export type MediaFormValues = {
  file: File | null
  caption: string
  existingFileUrl?: string | null // used for edit mode
  existingFileType?: MediaType | null // used for edit mode
};

