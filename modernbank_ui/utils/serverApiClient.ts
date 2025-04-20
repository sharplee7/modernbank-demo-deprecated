import { cookies } from 'next/headers';

const BASE_URLS = {
  AUTH: process.env.NEXT_PUBLIC_AUTH_API_URL || "",
  ACCOUNT: process.env.NEXT_PUBLIC_ACCOUNT_API_URL || "",
};

async function serverApiClient(service: keyof typeof BASE_URLS, path: string, method: string = "GET", body?: any) {
  const baseUrl = BASE_URLS[service];
  if (!baseUrl) {
    throw new Error(`Invalid service: ${service}`);
  }

  const cookieStore = cookies();
  const cookieHeader = cookieStore.toString();

  const options: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
      "Cookie": cookieHeader,
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  try {
    const response = await fetch(`${baseUrl}${path}`, options);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "API 요청 실패");
    }

    return { data };
  } catch (error) {
    console.error(`API Error (${service}${path}):`, error);
    throw error;
  }
}

export default serverApiClient; 