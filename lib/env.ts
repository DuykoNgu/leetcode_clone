const apiHost = process.env.NEXT_PUBLIC_API_HOST || "localhost";
const apiPort = process.env.NEXT_PUBLIC_API_PORT || "5000";

export const API_HOST = apiHost;
export const API_PORT = apiPort;
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || `http://${apiHost}:${apiPort}`;
