// types/swagger-ui-react.d.ts
declare module 'swagger-ui-react' {
    import * as React from 'react';
  
    interface SwaggerUIProps {
      spec?: object;
      url?: string;
    }
  
    const SwaggerUI: React.ComponentType<SwaggerUIProps>;
    export default SwaggerUI;
  }
  