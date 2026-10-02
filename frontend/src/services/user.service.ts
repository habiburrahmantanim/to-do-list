import { api } from "@/services/api";
import type { UserProfile, UpdateProfileRequest } from "@/types/user";

export async function getProfile(): Promise<UserProfile> {
  const { data } = await api.get<UserProfile>("/api/users/me/");
  return data;
}

export async function updateProfile(
  payload: UpdateProfileRequest,
): Promise<UserProfile> {
  const { data } = await api.patch<UserProfile>("/api/users/me/", payload);
  return data;
}

export async function changePassword(
  currentPassword: string,
  newPassword: string,
): Promise<void> {
  await api.post("/api/users/change-password/", {
    currentPassword,
    newPassword,
  });
}
