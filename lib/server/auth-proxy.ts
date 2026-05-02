import { SERVER_API_BASE_URL } from "@/lib/server/env";

export async function proxyAuthRequest(path: string, payload: unknown) {
  try {
    const response = await fetch(`${SERVER_API_BASE_URL}${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
      body: JSON.stringify(payload),
    });

    const data = await response.json().catch(() => ({
      message: "Invalid response from auth server",
    }));

    return Response.json(data, { status: response.status });
  } catch {
    return Response.json(
      {
        message: "Cannot connect to auth server",
      },
      { status: 502 },
    );
  }
}
