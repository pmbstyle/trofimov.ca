/**
 * Loads a sprite image and returns a promise that resolves with the loaded image
 * @param spriteUrl - URL/path to the sprite image
 * @returns Promise<HTMLImageElement>
 */
export const loadSprite = async (spriteUrl: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = spriteUrl;
    img.onload = () => resolve(img);
    img.onerror = (error) => reject(error);
  });
};
