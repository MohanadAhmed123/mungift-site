export type UUID = string;

export type Profile = {
  id: UUID;
  display_name: string;
  email: string;
  avatar_url: string | null;
};
