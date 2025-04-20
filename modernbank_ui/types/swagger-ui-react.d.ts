declare module 'swagger-ui-react' {
  interface SwaggerUIProps {
    spec?: any;
    url?: string;
  }

  const SwaggerUI: React.FC<SwaggerUIProps>;
  export default SwaggerUI;
} 