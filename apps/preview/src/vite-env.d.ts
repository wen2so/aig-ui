/// <reference types="vite/client" />

declare module 'virtual:component-api' {
  const api: Record<
    string,
    () => Promise<{ default: import('../../../scripts/component-api.mjs').ApiSignature[] }>
  >;
  export default api;
}
