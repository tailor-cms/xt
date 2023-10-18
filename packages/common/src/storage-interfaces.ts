export type UploadFormFieldname = 'file';

/**
 * FE file upload form interface.
 */
export interface UploadFormData extends FormData {
  append(
    name: UploadFormFieldname,
    value: File | Blob | string,
    fileName?: string,
  ): void;
  set(
    name: UploadFormFieldname,
    value: File | Blob | string,
    fileName?: string,
  ): void;
}

/**
 * Storage service 'saveFile' input data type.
 */
type FileData = string | Buffer | DataView;

/**
 * Storage service interface.
 */
export interface StorageService {
  getFile(key: string): Promise<Buffer>;
  saveFile(key: string, data: FileData): Promise<void>;
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
  upload(formData: UploadFormData): Promise<FileUploadResponse>;
}
