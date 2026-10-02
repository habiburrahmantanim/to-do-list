export const env = {
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL ?? "",
} as const;

export const apiBaseUrl = env.NEXT_PUBLIC_API_URL;
