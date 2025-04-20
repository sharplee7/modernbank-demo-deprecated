import { Metadata } from 'next';
import SwaggerViewer, { SwaggerSpec } from './components/SwaggerViewer';

export const metadata: Metadata = {
  title: 'API Documentation',
  description: 'API documentation for all microservices',
};

interface Service {
  name: string;
  url: string | undefined;
}

interface SwaggerResult {
  name: string;
  url: string | undefined;
  type?: 'spec' | 'ui' | 'error';
  data?: unknown;
  baseUrl?: string;
  error?: string;
}

async function fetchWithRetry(url: string, options: RequestInit, maxRetries = 3): Promise<Response> {
  for (let i = 0; i < maxRetries; i++) {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          'Accept': (options.headers as Record<string, string>)?.['Accept'] || 'application/json',
        },
        next: { revalidate: 0 }, // Disable caching
      });
      
      if (response.ok) {
        return response;
      }
      if (response.status === 503) {
        // Service Temporarily Unavailable - wait and retry
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
        continue;
      }
      throw new Error(`Failed to fetch: ${response.statusText}`);
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
    }
  }
  throw new Error('Max retries reached');
}

async function fetchSwaggerData(url: string): Promise<Omit<SwaggerResult, 'name' | 'url'> | null> {
  try {
    // First try to fetch OpenAPI spec
    const serviceName = url.split('/').pop() || '';
    const specUrl = `${url}/v3/api-docs/${serviceName}`;
    console.log(`Fetching OpenAPI spec from: ${specUrl}`);
    
    try {
      const specResponse = await fetchWithRetry(specUrl, {
        headers: {
          'Accept': 'application/json',
        },
      });
      
      if (specResponse.ok) {
        const spec = await specResponse.json();
        return { type: 'spec', data: spec };
      }
    } catch (error) {
      console.log(`Failed to fetch OpenAPI spec, falling back to Swagger UI: ${error}`);
    }
    
    // If OpenAPI spec is not available, try to fetch Swagger UI HTML
    const uiUrl = `${url}/swagger-ui/index.html`;
    console.log(`Fetching Swagger UI from: ${uiUrl}`);
    
    try {
      const uiResponse = await fetchWithRetry(uiUrl, {
        headers: {
          'Accept': 'text/html',
        },
      });
      
      const html = await uiResponse.text();
      return { type: 'ui', data: html, baseUrl: url };
    } catch (error) {
      console.error(`Failed to fetch Swagger UI after retries: ${error}`);
      return { type: 'error', error: 'Service is temporarily unavailable. Please try again later.' };
    }
  } catch (error) {
    console.error(`Error fetching documentation for ${url}:`, error);
    return { type: 'error', error: 'Failed to fetch documentation. Please try again later.' };
  }
}

export default async function ApiDocs() {
  const services: Service[] = [
    { name: 'customer', url: process.env.NEXT_PUBLIC_CUSTOMER },
    { name: 'transfer', url: process.env.NEXT_PUBLIC_TRANSFER },
    { name: 'account', url: process.env.NEXT_PUBLIC_ACCOUNT },
    { name: 'cqrs', url: process.env.NEXT_PUBLIC_CQRS },
    { name: 'product', url: process.env.NEXT_PUBLIC_PRODUCT },
  ];

  // Fetch documentation for all services
  const docPromises = services
    .filter(service => service.url)
    .map(async (service) => {
      const result = await fetchSwaggerData(service.url!);
      return {
        name: service.name,
        url: service.url,
        ...result,
      } as SwaggerResult;
    });

  const results = await Promise.all(docPromises);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">API Documentation</h1>
      <div className="space-y-8">
        {results.map((result) => (
          <div key={result.name} className="bg-white rounded-lg p-4">
            <h2 className="text-xl font-semibold mb-4">{result.name}</h2>
            {result?.type === 'spec' ? (
              <SwaggerViewer spec={result.data as SwaggerSpec} name={result.name} baseUrl={result.url} />
            ) : result?.type === 'ui' ? (
              <SwaggerViewer html={result.data as string} baseUrl={result.baseUrl!} name={result.name} />
            ) : (
              <div className="text-red-500 p-4 bg-red-50 rounded-lg">
                <p className="font-semibold">Failed to load API documentation for {result.name}</p>
                <p className="text-sm mt-2">Service URL: {result.url}</p>
                <p className="text-sm mt-1">{result.error || 'Please check if the service is running and accessible.'}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 