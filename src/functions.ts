import { encryptionKey } from "./data";

export const A = 1;

export function getImageColors(ctx: CanvasRenderingContext2D) {
  const data = [];
  for (let y = 0; y < 400; y++) {
    for (let x = 0; x < 600; x++) {
      const [red, green, blue] = Array.from(ctx.getImageData(x, y, 1, 1).data);
      data.push({
        red,
        green,
        blue
      });
    }
  }
  return data;
}

export function resolveMessage(
  originCtx: CanvasRenderingContext2D,
  messageCtx: CanvasRenderingContext2D
) {
  const originColorData = getImageColors(originCtx);
  const messageColorData = getImageColors(messageCtx);
  return messageColorData.map((item, index) => {
    const diff = {
      red: item.red - originColorData[index].red,
      green: item.green - originColorData[index].green,
      blue: item.blue - originColorData[index].blue
    };
    const blackWhite = (diff.red << 6) + (diff.green << 3) + diff.blue;
    const message = blackWhite ^ encryptionKey.charCodeAt(index % 417);
    const red = message >>> 6;
    const green = (message - red) >>> 3;
    const blue = message - red - green;
    return {
      red,
      green,
      blue
    };
  });
}

export function drawMessage(
  resolveCtx: CanvasRenderingContext2D,
  message: { red: number; green: number; blue: number }[]
) {
  const imgData = message.map(item => [item.red, item.green, item.blue, 255]);
  resolveCtx.putImageData(
    // @ts-ignore
    new ImageData(Uint8ClampedArray.from(imgData.flat()), 600, 400),
    0,
    0
  );
}
