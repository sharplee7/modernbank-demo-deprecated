import { NextRequest, NextResponse } from 'next/server';

const VALID_SERVICES = ['customer', 'account', 'transfer', 'product', 'cqrs'];

async function handleRequest(request: NextRequest) {
  try {
    // Handle favicon.ico requests
    if (request.nextUrl.pathname.endsWith('favicon.ico')) {
      return new NextResponse(null, { status: 204 });
    }

    // Extract path segments from the URL
    const pathSegments = request.nextUrl.pathname.split('/').filter(Boolean);
    const serviceName = pathSegments[2]; // /api/proxy/[serviceName]/...
    
    // Log incoming request details
    console.log('=== Incoming Request ===');
    console.log('Method:', request.method);
    console.log('URL:', request.url);
    console.log('Path Segments:', pathSegments);
    console.log('Service Name:', serviceName);
    console.log('Query Parameters:', Object.fromEntries(request.nextUrl.searchParams));
    console.log('Headers:', Object.fromEntries(request.headers));
    console.log('=====================');

    if (!serviceName) {
      console.error('Service name is missing in path');
      return NextResponse.json({ error: 'Service name is required' }, { status: 400 });
    }

    // Validate service name
    if (!VALID_SERVICES.includes(serviceName)) {
      console.error(`Invalid service name: ${serviceName}`);
      return NextResponse.json({ error: 'Invalid service name' }, { status: 400 });
    }

    // Get the target URL from environment variables based on service name
    // const targetUrl = process.env[`NEXT_PUBLIC_${serviceName.toUpperCase()}`];
    const targetUrl = process.env.NEXT_PUBLIC_BASE_URL;
    if (!targetUrl) {
      console.error(`Target URL not found for service: ${serviceName}`);
      return NextResponse.json({ error: 'Service URL not configured' }, { status: 400 });
    }

    // Get the remaining path after the service name
    const remainingPath = pathSegments.slice(3).join('/'); // Skip /api/proxy/[serviceName]
    
    // Construct the full URL based on service type
    let fullUrl;
    if (serviceName === 'cqrs') {
      // For CQRS service, use the path as is
      fullUrl = `${targetUrl}/${remainingPath}`;
    } else {
      // For other services, add /modernbank/[serviceName] to the path
      fullUrl = `${targetUrl}/modernbank/${serviceName}/${remainingPath}`;
    }
    
    // Log proxy request details
    console.log('=== Proxy Request ===');
    console.log('Service:', serviceName);
    console.log('Target URL:', targetUrl);
    console.log('Remaining Path:', remainingPath);
    console.log('Full URL:', fullUrl);
    console.log('Method:', request.method);
    console.log('Headers:', Object.fromEntries(request.headers));
    console.log('=====================');

    // Forward all headers except host
    const headers = new Headers(request.headers);
    headers.delete('host');
    
    // Add default headers if not present
    if (!headers.has('Accept')) {
      headers.set('Accept', '*/*');
    }
    if (!headers.has('Content-Type') && request.method !== 'GET' && request.method !== 'HEAD') {
      headers.set('Content-Type', 'application/json');
    }

    // Log request body if present
    if (request.method !== 'GET' && request.method !== 'HEAD') {
      const body = await request.blob();
      if (body.size > 0) {
        console.log('=== Request Body ===');
        console.log('Body Size:', body.size);
        console.log('Content Type:', body.type);
        console.log('=====================');
      }
    }

    const response = await fetch(fullUrl, {
      method: request.method,
      headers,
      body: request.method !== 'GET' && request.method !== 'HEAD' ? await request.blob() : undefined,
      next: { revalidate: 0 },
    });

    // Log response details
    console.log('=== Response ===');
    console.log('Status:', response.status);
    console.log('Status Text:', response.statusText);
    console.log('Headers:', Object.fromEntries(response.headers));
    console.log('=====================');

    if (!response.ok) {
      console.error(`Failed to fetch: ${response.status} ${response.statusText}`);
      return NextResponse.json(
        { error: `Failed to fetch: ${response.statusText}` },
        { status: response.status }
      );
    }

    // Forward the response headers
    const responseHeaders = new Headers(response.headers);
    responseHeaders.set('Access-Control-Allow-Origin', '*');

    // Handle different content types
    const contentType = response.headers.get('content-type');
    if (contentType?.includes('application/json')) {
      const data = await response.json();
      // Log JSON response
      console.log('=== JSON Response ===');
      console.log('Data:', JSON.stringify(data, null, 2));
      console.log('=====================');
      return NextResponse.json(data, { headers: responseHeaders });
    } else {
      return new NextResponse(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: responseHeaders,
      });
    }
  } catch (error) {
    console.error('=== Proxy Error ===');
    console.error('Error:', error);
    console.error('=====================');
    return NextResponse.json(
      { error: 'Failed to proxy request' },
      { status: 500 }
    );
  }
}

export const GET = handleRequest;
export const POST = handleRequest;
export const PUT = handleRequest;
export const DELETE = handleRequest;
export const PATCH = handleRequest;
export const HEAD = handleRequest; 