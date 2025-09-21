import { render, screen, fireEvent } from "@testing-library/react";
import Body from "./Body";
import { BodyType } from "../../types/rest-client.ts";

const mockOnChange = vi.fn();
const mockPrettify = vi.fn();

const translations: Record<string, string> = {
  body: "Body",
  response: "Response",
  clear: "Clear",
  prettify: "Prettify",
};

vi.mock("next-intl", () => ({
  useTranslations: (): ((key: string) => string) => {
    return (key: string) => translations[key] ?? key;
  },
}));

describe("Body component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders body title for request type", () => {
    render(
      <Body
        type={BodyType.req}
        value=""
        placeholder="Type here"
        onchange={mockOnChange}
        status={"false"}
        handlePrettify={mockPrettify}
      />
    );
    expect(screen.getByText("Body")).toBeInTheDocument();
  });

  it("renders response title and sets textarea readOnly", () => {
    render(
      <Body
        type={BodyType.response}
        value="some value"
        placeholder="Type here"
        onchange={mockOnChange}
        status={"false"}
        handlePrettify={mockPrettify}
      />
    );
    const textarea = screen.getByRole("textbox");
    expect(screen.getByText("Response")).toBeInTheDocument();
    expect(textarea).toHaveAttribute("readOnly");
  });

  it("calls onchange when typing in textarea", () => {
    render(
      <Body
        type={BodyType.req}
        value=""
        placeholder="Type here"
        onchange={mockOnChange}
        status={"false"}
        handlePrettify={mockPrettify}
      />
    );
    const textarea = screen.getByRole("textbox");
    fireEvent.change(textarea, { target: { value: "Hello" } });
    expect(mockOnChange).toHaveBeenCalledWith("Hello");
  });

  it("calls onchange with empty string when clear button is clicked", () => {
    render(
      <Body
        type={BodyType.req}
        value="Hello"
        placeholder="Type here"
        onchange={mockOnChange}
        status={"false"}
        handlePrettify={mockPrettify}
      />
    );
    fireEvent.click(screen.getByText("Clear"));
    expect(mockOnChange).toHaveBeenCalledWith("");
  });

  it("calls handlePrettify when prettify button is clicked", () => {
    render(
      <Body
        type={BodyType.req}
        value='{"foo":"bar"}'
        placeholder="Type here"
        onchange={mockOnChange}
        status={"false"}
        handlePrettify={mockPrettify}
      />
    );
    fireEvent.click(screen.getByText("Prettify"));
    expect(mockPrettify).toHaveBeenCalledWith('{"foo":"bar"}');
  });

  it("displays Status and statusText when JSON is valid and status=true", () => {
    render(
      <Body
        type={BodyType.response}
        value='{"status":200,"statusText":"OK"}'
        placeholder="Type here"
        onchange={mockOnChange}
        status={"true"}
        handlePrettify={mockPrettify}
      />
    );
    expect(screen.getByText("Status: 200")).toBeInTheDocument();
    expect(screen.getByText("OK")).toBeInTheDocument();
  });
});
