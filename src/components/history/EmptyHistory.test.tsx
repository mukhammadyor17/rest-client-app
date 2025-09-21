import React from "react";
import { render, screen } from "@testing-library/react";
import EmptyHistory from "./EmptyHistory";

vi.mock("next-intl", () => ({
  __esModule: true,
  useTranslations: () => (key: string) => {
    const messages: Record<string, string> = {
      title: "История пустая",
      description: "Вы еще не делали запросы",
      tryOptions: "Попробуйте следующие опции",
      restClientLink: "Перейти в REST Client",
    };
    return messages[key] ?? key;
  },
}));

describe("EmptyHistory", () => {
  it("рендерит заголовок", () => {
    render(<EmptyHistory />);
    expect(screen.getByRole("heading", { level: 3 })).toHaveTextContent(
      "История пустая"
    );
  });

  it("рендерит описание", () => {
    render(<EmptyHistory />);
    expect(screen.getByText("Вы еще не делали запросы")).toBeInTheDocument();
  });

  it("рендерит tryOptions", () => {
    render(<EmptyHistory />);
    expect(screen.getByText("Попробуйте следующие опции")).toBeInTheDocument();
  });

  it("рендерит ссылку на REST Client", () => {
    render(<EmptyHistory />);
    const link = screen.getByRole("link", { name: "Перейти в REST Client" });
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute("href", "/rest-client");
  });
});
