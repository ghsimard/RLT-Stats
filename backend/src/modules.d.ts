declare module 'fs' {
  export const promises: {
    mkdir: (path: string, options?: { recursive?: boolean }) => Promise<void>;
    access: (path: string, mode?: number) => Promise<void>;
    readdir: (path: string, options?: { withFileTypes?: boolean }) => Promise<any[]>;
    rmdir: (path: string) => Promise<void>;
    unlink: (path: string) => Promise<void>;
  };
  export function createWriteStream(path: string): any;
} 