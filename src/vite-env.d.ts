/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Add your environment variables here
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

declare module "*.vue"; 