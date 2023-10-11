import { UploadFormData } from './interfaces';

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
