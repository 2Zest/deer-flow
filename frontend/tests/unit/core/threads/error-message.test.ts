import { describe, expect, test } from "@rstest/core";

import { getStreamErrorMessage } from "@/core/threads/hooks";

describe("getStreamErrorMessage", () => {
  test("sanitizes 5xx response bodies while preserving the status", () => {
    const error = Object.assign(
      new Error('HTTP 502: {"detail":"upstream failed"}'),
      {
        status: 502,
      },
    );

    expect(
      getStreamErrorMessage(
        error,
        (status) => `Service unavailable (HTTP ${status}).`,
      ),
    ).toBe("Service unavailable (HTTP 502).");
  });

  test("keeps 4xx messages unchanged", () => {
    const error = Object.assign(new Error("HTTP 400: invalid prompt"), {
      status: 400,
    });

    expect(getStreamErrorMessage(error)).toBe("HTTP 400: invalid prompt");
  });
});
