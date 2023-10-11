import type {
  FileUploadResponse,
  UploadFormData,
} from '@tailor-cms/cek-common';

import request from './request';

const urls = {
  base: () => '/assets',
};

function getUrl(assetKey: string): Promise<string> {
  const params = { key: assetKey };
  return request.get(urls.base(), { params }).then((res) => res.data.url);
}

function upload(data: UploadFormData): Promise<FileUploadResponse> {
  return request
    .post(urls.base(), data, {
      headers: {
        /*
        The default value of the Content-Type header is set to `application/json`
        inside the `./request.js` file, which implies the provided data will be
        serialized as JSON. Unsetting the header instructs Axios to determine
        the header and serialization based on the type of the provided data.
        https://github.com/axios/axios/issues/5556#issuecomment-1434668134
       */
        'Content-Type': undefined,
      },
    })
    .then((res) => res.data);
}

export default {
  getUrl,
  upload,
};
