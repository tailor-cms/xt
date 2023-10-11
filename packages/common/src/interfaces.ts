export type UploadFormFieldname = 'file';

export interface FileUploadResponse {
  key: string;
  url: string;
  publicUrl: string;
}

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

export interface StorageApi {
  getUrl(key: string): Promise<string>;
  upload(formData: UploadFormData): Promise<FileUploadResponse>;
}
