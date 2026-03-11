import type { ClassValue } from "clsx";
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export type AvatarColorVariant = "purple" | "cyan" | "blue" | "volcano" | "magenta";

const AVATAR_COLOR_VARIANTS: AvatarColorVariant[] = [
  "purple",
  "cyan",
  "blue",
  "volcano",
  "magenta",
];

export function getAvatarColorByUserId(
  userId: number | string | null | undefined
): AvatarColorVariant {
  if (userId == null) return "purple";
  const num = typeof userId === "number" ? userId : parseInt(String(userId), 10);
  if (!Number.isFinite(num)) return "purple";
  const index =
    ((num % AVATAR_COLOR_VARIANTS.length) + AVATAR_COLOR_VARIANTS.length) %
    AVATAR_COLOR_VARIANTS.length;
  return AVATAR_COLOR_VARIANTS[index];
}
