import { setLocale, getLocale } from "./locale-service";
import { cookies } from "next/headers";
import { vi, Mock } from "vitest";

beforeEach(() => {
  vi.clearAllMocks();
});

vi.mock("next/headers", () => ({
  cookies: vi.fn(),
}));

describe("locale-service", () => {
  describe("setLocale", () => {
    it("sets cookie with correct locale", async () => {
      const mockSet = vi.fn();
      const mockCookies = vi.fn().mockResolvedValue({
        set: mockSet,
      });

      (cookies as Mock).mockImplementation(mockCookies);
      await setLocale("ru");
      expect(mockCookies).toHaveBeenCalled();
      expect(mockSet).toHaveBeenCalledWith("NEXT_LOCALE", "ru");
    });
  });

  describe("getLocale", () => {
    it("returns locale from cookie when available", async () => {
      const mockCookies = vi.fn().mockResolvedValue({
        get: vi.fn().mockReturnValue({ value: "es" }),
      });

      (cookies as Mock).mockImplementation(mockCookies);

      const locale = await getLocale();
      expect(locale).toBe("es");
    });

    it("returns default locale 'en' when no cookie is set", async () => {
      const mockCookies = vi.fn().mockResolvedValue({
        get: vi.fn().mockReturnValue(undefined),
      });
      (cookies as Mock).mockImplementation(mockCookies);
      const locale = await getLocale();
      expect(locale).toBe("en");
    });
  });
});
