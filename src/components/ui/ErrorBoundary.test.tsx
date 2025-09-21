import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import ClientErrorBoundary from "./ErrorBoundary";
import { ErrorModalProps } from "../../types/modal.ts";

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

vi.mock("./ErrorModal", () => ({
  default: ({ open, title, message, onClose }: ErrorModalProps) =>
    open ? (
      <div>
        <div>{title}</div>
        <div>{message}</div>
        <button onClick={onClose}>close</button>
      </div>
    ) : null,
}));

describe("ClientErrorBoundary", () => {
  it("рендерит детей без ошибок", () => {
    render(
      <ClientErrorBoundary>
        <div>Child content</div>
      </ClientErrorBoundary>
    );
    expect(screen.getByText("Child content")).toBeInTheDocument();
  });
});
