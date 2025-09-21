"use server";
import { cookies } from "next/headers";

export async function setLocale(locale: string) {
  (await cookies()).set("NEXT_LOCALE", locale);
}

export async function getLocale() {
  return (await cookies()).get("NEXT_LOCALE")?.value || "en";
}
