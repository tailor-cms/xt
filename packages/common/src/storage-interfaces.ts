export interface InputFileEvent extends Event {
  target: HTMLInputElement;
}

/**
 * Storage service interface.
 */
export interface StorageService {
  getFile(key: string): Promise<Buffer>;
  saveFile(key: string, data: string | Buffer | DataView): Promise<void>;
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
