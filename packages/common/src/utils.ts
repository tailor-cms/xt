import { v4 as uuid } from '@lukeed/uuid/secure';

export const resolveElementId = (): string | undefined => {
  const url = new URL(window.location.href);
  const id = url.searchParams.get('id');
  if (!id) {
    url.searchParams.set('id', uuid());
    window.location.href = url.toString();
    return;
  }
  return id;
};
