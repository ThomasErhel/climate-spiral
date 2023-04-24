import React from "react";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import ClimateSpiral from "./ClimateSpiral";

describe("ClimateSpiral", () => {
  test("renders the canvas", async () => {
    render(<ClimateSpiral dataUrl="giss-data-apr-11-2023.csv" />);

    // Wait for the canvas to appear in the DOM.
    const canvas = await screen.findByTestId("canvas");

    expect(canvas).toBeInTheDocument();
  });
});
