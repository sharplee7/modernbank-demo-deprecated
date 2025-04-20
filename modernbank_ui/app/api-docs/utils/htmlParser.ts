export function modifyHtmlContent(html: string, baseUrl: string): string {
  // Replace relative paths with absolute paths
  const modifiedHtml = html
    .replace(/href="([^"]*)"/g, (match, path) => {
      if (path.startsWith('http')) return match;
      return `href="${baseUrl}${path}"`;
    })
    .replace(/src="([^"]*)"/g, (match, path) => {
      if (path.startsWith('http')) return match;
      return `src="${baseUrl}${path}"`;
    });

  return modifiedHtml;
} 