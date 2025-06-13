import { v4 as uuid } from '@lukeed/uuid/secure';

import { UploadFormData } from './storage-interfaces';

export interface InputFileEvent extends Event {
  target: HTMLInputElement;
}

export const createUploadForm = (
  e: InputFileEvent,
): UploadFormData | undefined => {
  const form: UploadFormData = new FormData();
  const [file] = e.target.files || [];
  if (!file) return;
  form.append('file', file, file.name);
  return form;
};

export const resolveElementId = () => {
  const url = new URL(window.location.href);
  const id = url.searchParams.get('id');
  if (!id) {
    url.searchParams.set('id', uuid());
    window.location.href = url.toString();
    return;
  }
  return id;
};
