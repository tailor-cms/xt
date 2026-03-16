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
 * API exposed by the $storageService (injected into the authoring
 * package components).
 */
export interface StorageApi {
  getUrl(key: string): Promise<string>;
  upload(files: File[]): Promise<FileUploadResponse>;
}
