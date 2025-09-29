import { compress } from "fflate";

export const useCompress = (data: Uint8Array) =>
  new Promise<Uint8Array>((resolve, reject) => {
    compress(data, (error, data) => {
      if (error) reject(error);
      resolve(data);
    });
  });
