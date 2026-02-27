import type {
  FileUploadResponse,
  UploadFormData,
} from '@tailor-cms/cek-common';
import ky from 'ky';

const api = ky.create({
  prefixUrl: import.meta.env.VITE_SERVER_RUNTIME_URL,
  timeout: false,
});

function getUrl(assetKey: string): Promise<string> {
  return api
    .get('assets', { searchParams: { key: assetKey } })
    .json<{ url: string }>()
    .then((res) => res.url);
}

function upload(data: UploadFormData): Promise<FileUploadResponse> {
  return api.post('assets', { body: data }).json<FileUploadResponse>();
}

export default {
  getUrl,
  upload,
};
