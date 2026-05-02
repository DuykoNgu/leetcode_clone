const apiHost = process.env.API_HOST || process.env.NEXT_PUBLIC_API_HOST || "localhost";
const apiPort = process.env.API_PORT || process.env.NEXT_PUBLIC_API_PORT || "5000";

export const SERVER_API_BASE_URL =
  process.env.API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  `http://${apiHost}:${apiPort}`;
