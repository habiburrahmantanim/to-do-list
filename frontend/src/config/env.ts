export const env = {
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL ?? "",
  NEXT_PUBLIC_GOOGLE_CLIENT_ID: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? "",
} as const;

export const apiBaseUrl = env.NEXT_PUBLIC_API_URL;
export const googleClientId = env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
