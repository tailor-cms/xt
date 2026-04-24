import type { FileUploadResponse } from '@tailor-cms/cek-common';
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

function upload(file: File): Promise<FileUploadResponse> {
  const form = new FormData();
  form.append('file', file, file.name);
  return api.post('assets', { body: form }).json<FileUploadResponse>();
}

export default {
  getUrl,
  upload,
};
