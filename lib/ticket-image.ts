import { event } from './event';

const INK = '#111111';
const BRAND = '#E32636';
const BRAND_DARK = '#B91C2B';
const GOLD = '#F5C542';
const FONT = 'system-ui, -apple-system, "Segoe UI", Roboto, Arial, sans-serif';

const W = 1080;
const H = 1600;

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Imagem não carregou'));
    img.src = src;
  });
}

function roundRect(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, r: number) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

/** Escreve texto com quebra de linha; devolve o y logo abaixo da última linha. */
function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
  maxLines = 3,
): number {
  const words = text.split(/\s+/);
  const lines: string[] = [];
  let line = '';
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = test;
    }
  }
  if (line) lines.push(line);
  const shown = lines.slice(0, maxLines);
  if (lines.length > maxLines) shown[maxLines - 1] = shown[maxLines - 1].replace(/\s*\S*$/, '…');
  shown.forEach((l, i) => ctx.fillText(l, x, y + i * lineHeight));
  return y + shown.length * lineHeight;
}

/** Desenha o ingresso num canvas (PNG de 1080×1600), no mesmo padrão visual do cartão. */
export async function renderTicketCanvas(name: string, code: string): Promise<HTMLCanvasElement> {
  const canvas = document.createElement('canvas');
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas indisponível');

  let cover: HTMLImageElement | null = null;
  try {
    cover = await loadImage(event.images.cover.src);
  } catch {
    cover = null;
  }

  // Cartão com cantos arredondados
  ctx.save();
  roundRect(ctx, 0, 0, W, H, 64);
  ctx.clip();
  ctx.fillStyle = INK;
  ctx.fillRect(0, 0, W, H);

  // Topo com a cor da marca
  const grad = ctx.createLinearGradient(0, 0, W, 520);
  grad.addColorStop(0, BRAND);
  grad.addColorStop(1, BRAND_DARK);
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, 500);
  ctx.fillStyle = 'rgba(245,197,66,.28)';
  ctx.beginPath();
  ctx.arc(60, 520, 150, 0, Math.PI * 2);
  ctx.fill();

  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = GOLD;
  ctx.font = `700 30px ${FONT}`;
  ctx.fillText('I N G R E S S O', 64, 110);

  ctx.fillStyle = '#fff';
  ctx.font = `800 64px ${FONT}`;
  const titleBottom = wrapText(ctx, event.title, 64, 200, 640, 74, 4);
  ctx.fillStyle = 'rgba(255,255,255,.85)';
  ctx.font = `500 30px ${FONT}`;
  ctx.fillText('Ingresso emitido por Inscri-Ticket', 64, titleBottom + 20);

  // Capa do evento no canto
  if (cover) {
    const cw = 270;
    const ch = (cw * cover.height) / cover.width;
    ctx.save();
    ctx.translate(W - cw / 2 - 64, 60 + ch / 2);
    ctx.rotate((3 * Math.PI) / 180);
    ctx.shadowColor = 'rgba(0,0,0,.45)';
    ctx.shadowBlur = 30;
    ctx.shadowOffsetY = 12;
    roundRect(ctx, -cw / 2 - 6, -ch / 2 - 6, cw + 12, ch + 12, 26);
    ctx.fillStyle = '#fff';
    ctx.fill();
    ctx.shadowColor = 'transparent';
    roundRect(ctx, -cw / 2, -ch / 2, cw, ch, 20);
    ctx.clip();
    ctx.drawImage(cover, -cw / 2, -ch / 2, cw, ch);
    ctx.restore();
  }

  // Participante
  ctx.fillStyle = GOLD;
  ctx.font = `700 28px ${FONT}`;
  ctx.fillText('P A R T I C I P A N T E', 64, 590);
  ctx.fillStyle = '#fff';
  ctx.font = `800 84px ${FONT}`;
  const nameBottom = wrapText(ctx, name, 64, 680, W - 128, 96, 2);

  // Detalhes
  const items: [string, string][] = [
    ['DATA', event.dateShort],
    ['HORA', event.timeLabel],
    ['LOCAL', event.venue],
    ['CIDADE', `${event.city}, ${event.country}`],
  ];
  const gridTop = nameBottom + 50;
  items.forEach(([label, value], i) => {
    const x = 64 + (i % 2) * 480;
    const y = gridTop + Math.floor(i / 2) * 140;
    ctx.fillStyle = 'rgba(255,255,255,.5)';
    ctx.font = `700 24px ${FONT}`;
    ctx.fillText(label, x, y);
    ctx.fillStyle = '#fff';
    ctx.font = `700 46px ${FONT}`;
    ctx.fillText(value, x, y + 58);
  });

  // Picote
  const cutY = 1250;
  ctx.strokeStyle = 'rgba(255,255,255,.25)';
  ctx.lineWidth = 4;
  ctx.setLineDash([18, 14]);
  ctx.beginPath();
  ctx.moveTo(64, cutY);
  ctx.lineTo(W - 64, cutY);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.globalCompositeOperation = 'destination-out';
  ctx.beginPath();
  ctx.arc(0, cutY, 38, 0, Math.PI * 2);
  ctx.arc(W, cutY, 38, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalCompositeOperation = 'source-over';

  // Código de barras decorativo
  const chars = Array.from(code + code);
  const widths = chars.map((c, i) => (parseInt(c, 16) % 4) + 1 + (i % 3 === 0 ? 1 : 0));
  const total = widths.reduce((a, b) => a + b * 4 + 6, 0);
  const scale = (W - 128) / total;
  let bx = 64;
  ctx.fillStyle = 'rgba(255,255,255,.85)';
  widths.forEach((w) => {
    ctx.fillRect(bx, 1300, w * 4 * scale, 90);
    bx += (w * 4 + 6) * scale;
  });

  ctx.fillStyle = 'rgba(255,255,255,.75)';
  ctx.font = `500 34px "Courier New", monospace`;
  ctx.fillText(`Nº ${code}`, 64, 1460);

  const pill = event.entry;
  ctx.font = `700 30px ${FONT}`;
  const pw = ctx.measureText(pill).width + 56;
  roundRect(ctx, W - 64 - pw, 1418, pw, 56, 28);
  ctx.fillStyle = GOLD;
  ctx.fill();
  ctx.fillStyle = INK;
  ctx.fillText(pill, W - 64 - pw + 28, 1457);

  // Marca
  ctx.font = `800 40px ${FONT}`;
  const a = 'Inscri';
  const b = '-Ticket';
  const aw = ctx.measureText(a).width;
  const bw = ctx.measureText(b).width;
  const startX = (W - (aw + bw)) / 2;
  ctx.fillStyle = '#fff';
  ctx.fillText(a, startX, 1550);
  ctx.fillStyle = BRAND;
  ctx.fillText(b, startX + aw, 1550);

  ctx.restore();
  return canvas;
}

/** Gera o PNG do ingresso e inicia o download no dispositivo. */
export async function downloadTicketPng(name: string, code: string): Promise<void> {
  const canvas = await renderTicketCanvas(name, code);
  const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'));
  if (!blob) throw new Error('Não foi possível gerar a imagem');
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `ingresso-inscri-ticket-${code}.png`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}
