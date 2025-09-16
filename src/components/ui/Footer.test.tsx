import { render, screen } from "@testing-library/react";
import Footer from "@/components/ui/Footer.tsx";

it(
  "should contain a link to the authors' GitHub," +
    " the year the application was created," +
    " course logo with link to the course",
  () => {
    render(<Footer />);
    const github = screen.getByText("GitHub");
    expect((github as HTMLLinkElement).href).toBe(
      "https://github.com/mukhammadyor17"
    );
    const year = github.nextElementSibling as HTMLSpanElement;
    expect(year).toBeInTheDocument();
    expect(year).toHaveTextContent("© 2025 Rs Client App");
    const logo = screen.getByText("RS School");
    expect(logo).toBeInTheDocument();
    expect((logo as HTMLLinkElement).href).toBe(
      "https://rs.school/courses/reactjs"
    );
  }
);
