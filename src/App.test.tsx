import React from "react";
import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders ClimateSpiral component", () => {
  render(<App />);
  const climateSpiralElement = screen.getByTestId("canvas");
  expect(climateSpiralElement).toBeInTheDocument();
});
