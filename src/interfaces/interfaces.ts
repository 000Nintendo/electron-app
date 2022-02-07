/* eslint-disable prettier/prettier */
type Opaque<T, K extends string> = T & { __typename: K };

export type Base64 = Opaque<string, 'base64'>;

export interface IUploadFile {
  file: Base64;
  cache?: boolean;
}

export interface FileUploadObject {
  projectId: string;
  userId: string;
  refUrl: string;
  fileName: string;
  metadatata: any;
  filePath: string;
}
