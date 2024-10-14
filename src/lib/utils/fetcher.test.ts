import { describe, expect, it, vi } from "vitest";
import { z, ZodError } from "zod";
import { fetcher } from "./fetcher";

const mockFetch = vi.fn();
globalThis.fetch = mockFetch;

describe("fetcher", () => {
  const url = "https://example.api.com/1";

  const schema = z.object({
    id: z.number(),
    name: z.string().min(1),
  });

  it("should return data on fetch success", async () => {
    const mockData = { id: 1, name: "foo" };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockData),
    });

    const fetcherResult = await fetcher(url, schema);
    expect(fetcherResult).toEqual({ success: true, data: mockData });
  });

  it("should error when fetch fails", async () => {
    mockFetch.mockRejectedValue(new Error("Network Error"));

    const fetcherResult = await fetcher(url, schema);

    expect(fetcherResult).toEqual({ success: false, error: expect.any(Error) });
  });

  it("should error when response.ok is false", async () => {
    mockFetch.mockRejectedValue({
      status: 404,
      ok: false,
      statusText: "Not Found",
    });

    const fetcherResult = await fetcher(url, schema);
    expect(fetcherResult).toEqual({ success: false, error: expect.any(Error) });
  });

  it("should throw ZodError when validation fails", async () => {
    const mockData = {
      id: "mock-a7e6c42b-4918-8976-55676e20d4a4",
      name: "foo",
    };

    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: () => Promise.resolve(mockData),
    });

    const fetcherResult = await fetcher(url, schema);
    expect(fetcherResult).toEqual({
      success: false,
      error: expect.any(ZodError),
    });
  });
});
