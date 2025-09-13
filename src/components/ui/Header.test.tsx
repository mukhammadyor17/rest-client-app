import { fireEvent, screen } from "@testing-library/react";
import Header from "@/components/ui/Header.tsx";
import {
  mockActiveSession,
  renderWithIntl,
  wrapWithSession,
} from "../../test-utils/test-utils.tsx";

vi.mock("../../service/locale/locale-service.ts", () => ({
  setLocale: vi.fn(() => Promise.resolve()),
}));

it("should be sticky and change background color when scrolling document", () => {
  renderWithIntl(wrapWithSession(<Header session={null} />, null));
  const header = screen.getByRole("banner");
  expect(header.className.includes("sticky")).toBeTruthy();
  expect(header.className.includes("bg-white")).toBeTruthy();
  Object.defineProperty(document.documentElement, "scrollTop", {
    configurable: true,
    value: 2000,
  });
  fireEvent.scroll(window);
  expect(header?.className.includes("bg-gray-200")).toBeTruthy();

  Object.defineProperty(document.documentElement, "scrollTop", {
    configurable: true,
    value: 0,
  });
  fireEvent.scroll(window);
  expect(header.className.includes("bg-white")).toBeTruthy();
});

it("should have a link to the Main page", () => {
  renderWithIntl(wrapWithSession(<Header session={null} />, null));
  const links = screen.getAllByRole("link");
  expect(links[0]).toHaveAttribute("href", "/");
});

it("should have signOutButton if session is active", () => {
  renderWithIntl(
    wrapWithSession(<Header session={mockActiveSession} />, mockActiveSession)
  );
  const signOut = screen.getByText("Sign Out");
  expect(signOut).toBeInTheDocument();
});

it("should have language switcher and after changing it should show new value", () => {
  renderWithIntl(
    wrapWithSession(<Header session={mockActiveSession} />, mockActiveSession)
  );
  const switcher = screen.getByRole("combobox", { name: "" });
  expect(switcher).toBeInTheDocument();
  fireEvent.change(switcher, { target: { value: "ru" } });
  expect((switcher as HTMLSelectElement).value).toBe("ru");
});
