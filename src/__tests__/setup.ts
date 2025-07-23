import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

import "@testing-library/jest-dom";
import "@testing-library/jest-dom/vitest";

import "./__mocks__/ziggy";

afterEach(() => {
  vi.clearAllMocks();
  cleanup();
});
