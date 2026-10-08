import type { FileUploadResponse, UploadOptions } from '@tailor-cms/cek-common';
import ky from 'ky';

const api = ky.create({
  prefix: import.meta.env.VITE_SERVER_RUNTIME_URL,
  timeout: false,
});

function getUrl(assetKey: string): Promise<string> {
  return api
    .get('assets', { searchParams: { key: assetKey } })
    .json<{ url: string }>()
    .then((res) => res.url);
}

function upload(
  file: File,
  { onProgress }: UploadOptions = {},
): Promise<FileUploadResponse> {
  const form = new FormData();
  form.append('file', file, file.name);
  return api
    .post('assets', {
      body: form,
      onUploadProgress: onProgress
        ? ({ percent }) => onProgress(Math.round(percent * 100))
        : undefined,
    })
    .json<FileUploadResponse>();
}

export default {
  getUrl,
  upload,
};
