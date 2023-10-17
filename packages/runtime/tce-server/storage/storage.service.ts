import config from './config';
import { create as createFilesystemStorage } from './providers/filesystem';

const Storage = createFilesystemStorage(config);

export default Storage;
