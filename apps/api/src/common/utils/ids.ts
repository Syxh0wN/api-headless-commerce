import { randomBytes } from 'crypto';

export const generateId = (): string => {
  return randomBytes(16).toString('hex');
};

export const generateShortId = (): string => {
  return randomBytes(8).toString('hex');
};

export const generateUuid = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};
