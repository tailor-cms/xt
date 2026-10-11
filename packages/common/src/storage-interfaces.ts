export interface InputFileEvent extends Event {
  target: HTMLInputElement;
}

/**
 * Options for StorageService.saveFile, forwarded to the storage provider.
 */
export interface SaveFileOptions {
  // Stored content type (e.g. S3 `ContentType`); providers that don't
  // track metadata, like the filesystem, ignore it
  ContentType?: string;
}

/**
 * Storage service interface.
 */
export interface StorageService {
  // Resolves to null if there's no file under the key
  getFile(key: string): Promise<Buffer | null>;
  saveFile(
    key: string,
    data: string | Buffer | DataView,
    options?: SaveFileOptions,
  ): Promise<void>;
  getFileUrl(key: string): Promise<string>;
}

/**
 * Server response after file upload.
 */
export interface FileUploadResponse {
  key: string;
  url: string;
  publicUrl: string;
}

/**
 * Options for StorageApi.upload.
 */
export interface UploadOptions {
  // Called with the completion percentage (0..100) as bytes are sent
  onProgress?: (percent: number) => void;
}

/**
 * API exposed by the $storageService (injected into the authoring
 * package components).
 */
export interface StorageApi {
  getUrl(key: string): Promise<string>;
  upload(file: File, options?: UploadOptions): Promise<FileUploadResponse>;
}
