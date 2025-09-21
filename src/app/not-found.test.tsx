import React from "react";
import { render, screen } from "@testing-library/react";
import NotFound from "./not-found";

vi.mock("next-intl", () => ({
  __esModule: true,
  useTranslations: () => (key: string) => {
    const messages: Record<string, string> = {
      "NotFound.title": "Страница не найдена",
      "NotFound.returnLabel": "Вернуться на",
      "NotFound.mainPageLink": "Главную страницу",
    };
    return messages[key] ?? key;
  },
}));

describe("NotFound", () => {
  it("рендерит заголовок", () => {
    render(<NotFound />);
    expect(screen.getByRole("heading", { level: 3 })).toHaveTextContent(
      "Страница не найдена"
    );
  });

  it("рендерит подсказку для возврата", () => {
    render(<NotFound />);
    expect(screen.getByText("Вернуться на")).toBeInTheDocument();
  });

  it("рендерит ссылку на главную страницу", () => {
    render(<NotFound />);
    const link = screen.getByRole("link", { name: "Главную страницу" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/");
  });
});
