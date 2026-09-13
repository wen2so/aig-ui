/// <reference types="vite/client" />

declare module 'virtual:component-api' {
  const api: Record<string, import('../../../scripts/component-api.mjs').ApiSignature[]>;
  export default api;
}
