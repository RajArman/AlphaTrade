import { describe, test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Hero from "../landing_page/home/Hero";

describe("Hero Component", () => {
  test("renders hero image", () => {
    render(<Hero />, { wrapper: MemoryRouter });
    const heroImage = screen.getByAltText("AlphaTrade Dashboard");
    expect(heroImage).toBeInTheDocument();
    expect(heroImage).toHaveAttribute("src", "media/images/homeHero.svg");
  });

  test("renders signup button", () => {
    render(<Hero />, { wrapper: MemoryRouter });
    const buttons = screen.getAllByRole("button", {
      name: /get started/i,
    });
    expect(buttons.length).toBeGreaterThan(0);
    expect(buttons[0]).toHaveClass("btn");
  });
});
