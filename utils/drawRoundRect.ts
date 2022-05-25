export default function drawRoundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number | { tl: number; tr: number; br: number; bl: number },
  isRounded: boolean,
) {
  // radius = radius * 2 < ( Math.min( height, width ) ) ? radius : ( Math.min( height, width ) ) / 2
  if (typeof radius === 'undefined') {
    throw new Error('radius is undefined');
  }

  if (typeof radius === 'number') {
    radius = Math.min(radius, Math.min(width / 2, height / 2));
    radius = {
      tl: radius,
      tr: radius,
      br: radius,
      bl: radius,
    };
  } else {
    const defaultRadius = {
      tl: 0,
      tr: 0,
      br: 0,
      bl: 0,
    };

    radius.bl = radius.bl || defaultRadius.bl;
    radius.br = radius.br || defaultRadius.br;
    radius.tr = radius.tr || defaultRadius.tr;
    radius.tl = radius.tl || defaultRadius.tl;
  }

  ctx.beginPath();
  if (!isRounded) {
    ctx.moveTo(x + radius.tl, y);
    ctx.lineTo(x + width - radius.tr, y);
    ctx.lineTo(x + width, y + radius.tr);
    ctx.lineTo(x + width, y + height - radius.br);
    ctx.lineTo(x + width - radius.br, y + height);
    ctx.lineTo(x + radius.bl, y + height);
    ctx.lineTo(x, y + height - radius.bl);
    ctx.lineTo(x, y + radius.tl);
    ctx.lineTo(x + radius.tl, y);
  } else {
    ctx.moveTo(x + radius.tl, y);
    ctx.lineTo(x + width - radius.tr, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
    ctx.lineTo(x + width, y + height - radius.br);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
    ctx.lineTo(x + radius.bl, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
    ctx.lineTo(x, y + radius.tl);
    ctx.quadraticCurveTo(x, y, x + radius.tl, y);
  }
  ctx.closePath();
}
