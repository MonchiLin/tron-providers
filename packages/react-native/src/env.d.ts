/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly PAGE_HOOK_INPAGE: string
  readonly PAGE_HOOK_CONTENT_SCRIPT: string
  readonly PAGE_HOOK_PROVIDER: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
