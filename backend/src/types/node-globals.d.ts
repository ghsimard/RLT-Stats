// Node.js globals
declare const __dirname: string;
declare const __filename: string;
declare const process: {
  env: {
    [key: string]: string | undefined;
    NODE_ENV?: 'development' | 'production' | 'test';
    PORT?: string;
    DB_CONNECTION_STRING?: string;
    DB_HOST?: string;
    DB_PORT?: string;
    DB_USER?: string;
    DB_PASSWORD?: string;
    DB_DATABASE?: string;
    CORS_ORIGINS?: string;
  };
  cwd(): string;
};

declare const require: (id: string) => any;

declare class Buffer extends Uint8Array {
  static from(arrayBuffer: WithImplicitCoercion<ArrayBuffer | SharedArrayBuffer>): Buffer;
  static from(data: WithImplicitCoercion<ArrayBufferView | ArrayLike<number>>): Buffer;
  static from(str: WithImplicitCoercion<string>, encoding?: BufferEncoding): Buffer;
  static concat(list: ReadonlyArray<Uint8Array>, totalLength?: number): Buffer;
}

declare type WithImplicitCoercion<T> = T | { valueOf(): T } | { [Symbol.toPrimitive](hint: 'number' | 'string'): T };
declare type BufferEncoding = 'ascii' | 'utf8' | 'utf-8' | 'utf16le' | 'utf-16le' | 'base64' | 'hex' | 'binary';

declare global {
  namespace NodeJS {
    interface WritableStream {
      write(buffer: Buffer | string, cb?: (err?: Error | null) => void): boolean;
      write(str: string, encoding?: BufferEncoding, cb?: (err?: Error | null) => void): boolean;
      end(cb?: () => void): void;
      end(data: string | Uint8Array, cb?: () => void): void;
      end(str: string, encoding?: BufferEncoding, cb?: () => void): void;
    }
  }
} 