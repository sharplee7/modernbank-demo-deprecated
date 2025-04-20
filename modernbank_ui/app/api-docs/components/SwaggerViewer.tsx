'use client';

import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';

export interface ServerConfig {
  url: string;
  [key: string]: unknown;
}

export interface SwaggerSpec {
  servers?: ServerConfig[];
  [key: string]: unknown;
}

interface SwaggerViewerProps {
  spec?: SwaggerSpec;
  html?: string;
  baseUrl?: string;
  name?: string;
}

export default function SwaggerViewer({ spec, html, baseUrl, name }: SwaggerViewerProps) {
  if (spec) {
    // Use the name prop as the service name
    const serviceName = name || '';
    console.log('Processing spec with:', { serviceName, baseUrl, name });
    
    // Modify the spec to use our proxy with service name
    const modifiedSpec = {
      ...spec,
      servers: spec.servers?.map((server: ServerConfig) => {
        // Keep the original server URL for reference
        const originalUrl = server.url;
        // Create proxy URL that includes the service name
        const proxyUrl = `/api/proxy/${serviceName}`;
        console.log('Modified server URL:', { 
          original: originalUrl, 
          proxy: proxyUrl,
          serviceName 
        });
        return {
          ...server,
          url: proxyUrl,
        };
      }),
    };

    return (
      <div className="w-full">
        <SwaggerUI spec={modifiedSpec} />
      </div>
    );
  }

  if (html && baseUrl) {
    // Use the name prop as the service name
    const serviceName = name || '';
    console.log('Processing HTML with:', { serviceName, baseUrl, name });
    
    // Modify the HTML to use our proxy with service name
    const modifiedHtml = html.replace(
      /(url:\s*['"])([^'"]+)(['"])/g,
      (match: string, prefix: string, url: string, suffix: string) => {
        if (url.startsWith('http')) {
          // Extract the path from the URL
          const urlObj = new URL(url);
          // Remove /modernbank/{serviceName} from the path if it exists
          const path = urlObj.pathname.replace(`/modernbank/${serviceName}`, '') + urlObj.search;
          // Create proxy URL that includes the service name
          const proxyUrl = `${prefix}/api/proxy/${serviceName}${path}${suffix}`;
          console.log('Modified URL:', { 
            original: url, 
            path,
            proxy: proxyUrl,
            serviceName 
          });
          return proxyUrl;
        }
        return match;
      }
    ).replace(
      /(href|src)="([^"]+)"/g,
      (match: string, attr: string, path: string) => {
        console.log('Processing static file:', { match, attr, path });
        // Handle static files
        if (path.startsWith('/swagger-ui/') || path.startsWith('/webjars/') || path.startsWith('/index.css') || path.startsWith('/swagger-initializer.js')) {
          // Extract the original path from the HTML
          const originalPath = path;
          // Use the original service URL for static files
          const fullUrl = `${baseUrl}/modernbank/${serviceName}${originalPath}`;
          console.log('Static file URL:', { 
            originalPath,
            fullUrl,
            baseUrl,
            serviceName
          });
          return `${attr}="${fullUrl}"`;
        }
        return match;
      }
    ).replace(
      /(href|src)='([^']+)'/g,
      (match: string, attr: string, path: string) => {
        console.log('Processing static file (single quotes):', { match, attr, path });
        // Handle static files with single quotes
        if (path.startsWith('/swagger-ui/') || path.startsWith('/webjars/') || path.startsWith('/index.css') || path.startsWith('/swagger-initializer.js')) {
          // Extract the original path from the HTML
          const originalPath = path;
          // Use the original service URL for static files
          const fullUrl = `${baseUrl}/modernbank/${serviceName}${originalPath}`;
          console.log('Static file URL:', { 
            originalPath,
            fullUrl,
            baseUrl,
            serviceName
          });
          return `${attr}='${fullUrl}'`;
        }
        return match;
      }
    );

    // Add error handling script to ignore 404 errors
    const errorHandlingScript = `
      <script>
        window.addEventListener('error', function(e) {
          if (e.target.tagName === 'LINK' || e.target.tagName === 'SCRIPT') {
            e.preventDefault();
            console.log('Ignored 404 error for:', e.target.src || e.target.href);
          }
        }, true);
      </script>
    `;

    // Insert error handling script into the HTML
    const finalHtml = modifiedHtml.replace('</head>', `${errorHandlingScript}</head>`);

    // Log the final HTML for debugging
    console.log('Final HTML:', finalHtml);

    return (
      <div className="w-full h-[800px]">
        <iframe
          srcDoc={finalHtml}
          className="w-full h-full border-0"
          title={`Swagger UI for ${name}`}
          data-base-url={baseUrl}
          data-service-name={serviceName}
        />
      </div>
    );
  }

  return null;
} 