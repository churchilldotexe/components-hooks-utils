import { describe, expect, it } from "vitest";
import { z, ZodError } from "zod";
import { fetcher } from "./fetcher";

//https://jsonplaceholder.typicode.com/ --> website used for api test

// failing CI but passing at local. TODO: create a custom server instead
describe.skip("integration fetcher", () => {
  const jsonPlaceHolderSchema = z.object({
    userId: z.number(),
    id: z.number(),
    title: z.string().min(1),
    completed: z.boolean(),
  });

  const sampleUrl = "https://jsonplaceholder.typicode.com/todos/1";

  it("should return a data base base on schema on success", async () => {
    const resultData = {
      userId: 1,
      id: 1,
      title: "delectus aut autem",
      completed: false,
    };

    const returnedData = await fetcher(sampleUrl, jsonPlaceHolderSchema);

    expect(returnedData.success).toBe(true);
    if (returnedData.success) {
      expect(returnedData.data).toEqual(resultData);
    }
  });

  it("should error when the endpoint is invalid", async () => {
    const sampleUrl = "https://jsonplaceholder.typicode.com/invalid-endpoint";

    const returnedData = await fetcher(sampleUrl, jsonPlaceHolderSchema);

    expect(returnedData.success).toBe(false);
    if (returnedData.success === false) {
      expect(returnedData.error).toEqual(expect.any(Error));
    }
  });

  it("should error on invalid data", async () => {
    const sampleUrl = "https://jsonplaceholder.typicode.com/posts/1/comments"; //valid but diff endpoint

    const returnedData = await fetcher(sampleUrl, jsonPlaceHolderSchema);
    expect(returnedData.success).toBe(false);
    if (returnedData.success === false) {
      expect(returnedData.error).toEqual(expect.any(ZodError));
    }
  });
});
