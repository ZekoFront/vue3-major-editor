export function readFileDataUrl(file: File): Promise<any> {
  const reader = new FileReader();

  return new Promise((resolve, reject) => {
    // @ts-ignore
    reader.onload = readerEvent => resolve(readerEvent.target.result);
    reader.onerror = reject;

    reader.readAsDataURL(file);
  });
}

type ImageResult = {
  complete: boolean;
  width: number;
  height: number;
  src: string;
};

interface ImageCache {
  [key: string]: ImageResult;
}

const IMAGE_CACHE: ImageCache = {};

export function resolveImageURL(src: string): Promise<ImageResult> {
  return new Promise((resolve, reject) => {
    const result: ImageResult = {
      complete: false,
      width: 0,
      height: 0,
      src,
    };

    if (!src) {
      reject(result);
      return;
    }

    if (IMAGE_CACHE[src]) {
      resolve({ ...IMAGE_CACHE[src] });
      return;
    }

    const img = new Image();

    img.onload = () => {
      result.width = img.width;
      result.height = img.height;
      result.complete = true;

      IMAGE_CACHE[src] = { ...result };
      resolve(result);
    };

    img.onerror = () => {
      reject(result);
    };

    img.src = src;
  });
}

export const enum ImageDisplay {
  INLINE = 'inline',
  BREAK_TEXT = 'block',
  FLOAT_LEFT = 'left',
  FLOAT_RIGHT = 'right',
};
