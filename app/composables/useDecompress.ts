import { decompress } from "fflate/browser";

export const useDecompress = (data: Uint8Array) =>
  new Promise<Uint8Array>((resolve, reject) => {
    decompress(data, (error, data) => {
      if (error) reject(error);
      resolve(data);
    });
  });
