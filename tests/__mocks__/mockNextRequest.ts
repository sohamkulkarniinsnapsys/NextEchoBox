// tests/__mocks__/mockNextRequest.ts
import { NextRequest } from "next/server";

export function createMockRequest(
  method: string,
  body?: any,
  url: string = "http://localhost/api/send-message"
): NextRequest {
  let requestBody;

  if (typeof body === "string") {
    requestBody = body; // invalid JSON case
  } else if (body !== undefined) {
    requestBody = JSON.stringify(body);
  }

  return new NextRequest(url, {
    method,
    body: requestBody,
  });
}
