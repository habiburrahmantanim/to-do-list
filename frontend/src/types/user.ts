export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  createdAt: string;
}

export interface UpdateProfileRequest {
  name?: string;
  avatar?: string;
}
