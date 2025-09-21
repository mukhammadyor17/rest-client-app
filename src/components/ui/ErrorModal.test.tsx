import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import ErrorModal from "./ErrorModal";

vi.mock("next-intl", () => ({
  useTranslations: () => (key: string) => key,
}));

describe("ErrorModal component", () => {
  let onCloseMock: () => void;

  beforeEach(() => {
    onCloseMock = vi.fn();
    vi.clearAllMocks();
  });

  it("не рендерится если open=false", () => {
    render(
      <ErrorModal
        open={false}
        title="Error"
        message="Something went wrong"
        onClose={onCloseMock}
      />
    );
    expect(screen.queryByText("Error")).toBeNull();
    expect(screen.queryByText("Something went wrong")).toBeNull();
  });

  it("рендерится если open=true", () => {
    render(
      <ErrorModal
        open={true}
        title="Error"
        message="Something went wrong"
        onClose={onCloseMock}
      />
    );
    expect(screen.getByText("Error")).toBeInTheDocument();
    expect(screen.getByText("Something went wrong")).toBeInTheDocument();
    expect(screen.getByText("close")).toBeInTheDocument();
  });

  it("вызывает onClose при клике по фону", () => {
    render(
      <ErrorModal
        open={true}
        title="Error"
        message="Something went wrong"
        onClose={onCloseMock}
      />
    );
    const overlay = screen.getByText("Error").parentElement
      ?.parentElement as HTMLElement;
    fireEvent.click(overlay);
    expect(onCloseMock).toHaveBeenCalled();
  });

  it("не закрывается при клике внутри модального окна", () => {
    render(
      <ErrorModal
        open={true}
        title="Error"
        message="Something went wrong"
        onClose={onCloseMock}
      />
    );
    const modalContent = screen.getByText("Error").parentElement as HTMLElement;
    fireEvent.click(modalContent);
    expect(onCloseMock).not.toHaveBeenCalled();
  });

  it("вызывает onClose при клике на кнопку Close", () => {
    render(
      <ErrorModal
        open={true}
        title="Error"
        message="Something went wrong"
        onClose={onCloseMock}
      />
    );
    const closeButton = screen.getByText("close");
    fireEvent.click(closeButton);
    expect(onCloseMock).toHaveBeenCalled();
  });

  it("вызывает onClose при нажатии клавиши Escape", () => {
    render(
      <ErrorModal
        open={true}
        title="Error"
        message="Something went wrong"
        onClose={onCloseMock}
      />
    );
    fireEvent.keyDown(window, { key: "Escape" });
    expect(onCloseMock).toHaveBeenCalled();
  });

  it("не вызывает onClose при нажатии другой клавиши", () => {
    render(
      <ErrorModal
        open={true}
        title="Error"
        message="Something went wrong"
        onClose={onCloseMock}
      />
    );
    fireEvent.keyDown(window, { key: "Enter" });
    expect(onCloseMock).not.toHaveBeenCalled();
  });
});
