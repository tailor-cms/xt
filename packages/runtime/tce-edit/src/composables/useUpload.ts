import { inject, ref } from 'vue';
import type { StorageApi } from '@tailor-cms/cek-common';

// Floor the visible upload time so the progress panel doesn't flash on fast
// (small-file / localhost) uploads
const MIN_LOADING_MS = 800;

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const useUpload = () => {
  const storageService = inject<StorageApi>('$storageService');
  const uploading = ref(false);
  // Percent complete, or null until the upload reports progress
  const progress = ref<number | null>(null);
  const fileName = ref('');
  const error = ref('');

  /**
   * Uploads the file. Resolves with the uploaded asset payload,
   * or null on failure (the message is set on `error`)
   */
  const upload = async (file: File) => {
    uploading.value = true;
    progress.value = null;
    fileName.value = file.name;
    error.value = '';
    try {
      const [data] = await Promise.all([
        storageService.upload(file, {
          onProgress: (percent) => (progress.value = percent),
        }),
        delay(MIN_LOADING_MS),
      ]);
      return {
        key: data.key,
        name: file.name,
        url: data.url,
        publicUrl: data.publicUrl,
      };
    } catch {
      error.value = 'Upload failed. Please try again.';
      return null;
    } finally {
      uploading.value = false;
    }
  };

  return { upload, uploading, progress, fileName, error };
};
