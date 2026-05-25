"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

const COUNTRY_COOKIE = "cc-country";

const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

/** Setea la cookie de país (override manual). Pasar null limpia el override. */
export async function setCountryOverride(code: string | null): Promise<{ ok: true }> {
  const cookieStore = await cookies();

  if (code === null) {
    cookieStore.delete(COUNTRY_COOKIE);
  } else if (/^[A-Z]{2}$/.test(code)) {
    cookieStore.set({
      name: COUNTRY_COOKIE,
      value: code,
      httpOnly: false,
      sameSite: "lax",
      path: "/",
      maxAge: ONE_YEAR_SECONDS
    });
  }

  revalidatePath("/", "layout");
  return { ok: true };
}
