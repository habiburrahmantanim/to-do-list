import type { User } from "@/types/auth";

export type UserProfile = User;

export interface UpdateProfileRequest {
  first_name?: string;
  last_name?: string;
  name?: string;
  bio?: string;
  avatar?: string;
}
