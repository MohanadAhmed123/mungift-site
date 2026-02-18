import type { UUID } from './auth';

export type Tag = {
  id: UUID;
  name: string;
  scope: string;
};

//type for 
export type TagContext = {
  scope: string  // e.g. "media"
  joinTable: string  // e.g. "media_tag_map"
  entityColumn: string // e.g. "media_id"
}