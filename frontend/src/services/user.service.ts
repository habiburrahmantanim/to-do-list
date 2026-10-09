import { api } from "@/services/api";
import type { UserProfile, UpdateProfileRequest } from "@/types/user";

export async function getProfile(): Promise<UserProfile> {
  const { data } = await api.get<UserProfile>("/api/auth/me/");
  return data;
}

export async function updateProfile(
  payload: UpdateProfileRequest,
): Promise<UserProfile> {
  const dataToSend = { ...payload };
  if (dataToSend.name) {
    const parts = dataToSend.name.trim().split(/\s+/);
    dataToSend.first_name = parts[0] || "";
    dataToSend.last_name = parts.slice(1).join(" ") || "";
    delete dataToSend.name;
  }
  delete dataToSend.avatar;

  const { data } = await api.patch<UserProfile>("/api/auth/me/", dataToSend);
  return data;
}

export async function changePassword(
  currentPassword: string,
  newPassword: string,
): Promise<{ message: string }> {
  const { data } = await api.post<{ message: string }>(
    "/api/auth/change-password/",
    {
      current_password: currentPassword,
      new_password: newPassword,
    },
  );
  return data;
}
