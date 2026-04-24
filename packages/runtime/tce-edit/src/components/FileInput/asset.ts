export const AssetType = {
  Image: 'image',
  Document: 'document',
  Video: 'video',
  Audio: 'audio',
  Other: 'other',
} as const;

export type AssetType = (typeof AssetType)[keyof typeof AssetType];

const ASSET_TYPE_EXTENSIONS: Record<string, Set<string>> = {
  image: new Set([
    'jpg',
    'jpeg',
    'png',
    'gif',
    'webp',
    'svg',
    'bmp',
    'ico',
    'tiff',
    'avif',
  ]),
  document: new Set(['pdf', 'doc', 'docx', 'pptx', 'txt', 'md', 'html']),
  video: new Set(['mp4', 'avi', 'mov', 'wmv', 'mkv', 'webm', 'flv']),
  audio: new Set(['mp3', 'wav', 'ogg', 'flac', 'aac', 'm4a', 'wma']),
};

export function inferAssetType(extensions: string[]): AssetType | null {
  if (!extensions.length) return null;
  const cleaned = extensions.map((e) => e.replace(/^\./, '').toLowerCase());
  for (const [type, exts] of Object.entries(ASSET_TYPE_EXTENSIONS)) {
    if (cleaned.every((e) => exts.has(e))) return type as AssetType;
  }
  return null;
}

export const ASSET_TYPE_ICON: Record<string, string> = {
  image: 'mdi-image-outline',
  video: 'mdi-video-outline',
  audio: 'mdi-volume-medium',
  document: 'mdi-file-document-outline',
  other: 'mdi-file',
};

export const ASSET_TYPE_LABEL: Record<string, string> = {
  image: 'Image',
  video: 'Video',
  audio: 'Audio',
  document: 'Document',
  other: 'File',
};
