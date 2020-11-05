import React from "react";

import Coin from "./index";

import { render, screen } from "@testing-library/react";

it("Check coin label", () => {
  render(<Coin coin={"BTC"} oldPrice={-10} currentPrice={50} />);
  expect(screen.getByText("BTC"));
});
