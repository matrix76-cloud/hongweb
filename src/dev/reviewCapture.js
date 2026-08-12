// 리뷰 캡처 유틸 (seekone AuthReview 이식)
//  · 화면공유(getDisplayMedia)로 실제 화면을 받아 iframe 영역만 잘라 캡처 — 카카오맵까지 찍힌다
//  · 화면공유를 거부하면 html2canvas 폴백 (지도 배경은 빠질 수 있음)
//  · 캡처 이미지에 핀(말풍선 + 점)을 그려 넣어 어디를 가리키는지 그림에 남긴다
import html2canvas from 'html2canvas';

const CORAL = '#FF4E19';

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

// 캔버스에 핀(라벨 말풍선 + 점) — 캡처 이미지에 번호가 박혀 겹침 혼란을 없앤다
export function drawPinOnCanvas(ctx, xPx, yPx, label) {
  ctx.font = "bold 13px 'Pretendard Variable', Pretendard, sans-serif";
  const padX = 9, bh = 24;
  const tw = ctx.measureText(label).width;
  const bw = tw + padX * 2;
  const bx = xPx - bw / 2;
  const by = yPx - bh - 9;

  roundRect(ctx, bx, by, bw, bh, 7);
  ctx.fillStyle = CORAL; ctx.fill();

  ctx.beginPath();
  ctx.moveTo(xPx - 5, by + bh); ctx.lineTo(xPx + 5, by + bh); ctx.lineTo(xPx, by + bh + 7);
  ctx.closePath(); ctx.fill();

  ctx.beginPath(); ctx.arc(xPx, yPx, 4, 0, Math.PI * 2);
  ctx.fillStyle = CORAL; ctx.fill();
  ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.stroke();

  ctx.fillStyle = '#fff'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(label, xPx, by + bh / 2 + 0.5);
}

// 폴백 — iframe 내부를 html2canvas 로. same-origin 이라 contentDocument 접근이 된다.
export async function captureViaHtml2canvas(iframeEl, pins) {
  const w = iframeEl.clientWidth, h = iframeEl.clientHeight;
  let base = null;
  try {
    const doc = iframeEl.contentDocument;
    const win = iframeEl.contentWindow;
    base = await html2canvas(doc.body, {
      useCORS: true, allowTaint: false, backgroundColor: 'var(--surface)', logging: false,
      width: w, height: h, windowWidth: w, windowHeight: h,
      x: (win && win.scrollX) || 0, y: (win && win.scrollY) || 0, scale: 1,
    });
  } catch { base = null; }

  const canvas = document.createElement('canvas');
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, w, h);
  if (base) { try { ctx.drawImage(base, 0, 0, w, h); } catch { /* noop */ } }
  pins.forEach((p) => drawPinOnCanvas(ctx, (p.x / 100) * w, (p.y / 100) * h, p.label || ''));
  try { return canvas.toDataURL('image/jpeg', 0.82); } catch { return ''; }
}

// 화면공유 프레임에서 iframe 영역만 잘라 핀을 얹어 캡처. 공유 없으면 html2canvas 폴백.
export async function captureFrame({ iframeEl, videoEl, hasStream, pins }) {
  if (!iframeEl) return '';

  if (videoEl && videoEl.videoWidth > 0 && hasStream) {
    await new Promise((r) => requestAnimationFrame(() => r()));
    const rect = iframeEl.getBoundingClientRect();
    const scaleX = videoEl.videoWidth / window.innerWidth;
    const scaleY = videoEl.videoHeight / window.innerHeight;
    const cw = Math.max(1, Math.round(rect.width));
    const ch = Math.max(1, Math.round(rect.height));

    const canvas = document.createElement('canvas');
    canvas.width = cw; canvas.height = ch;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff'; ctx.fillRect(0, 0, cw, ch);
    try {
      ctx.drawImage(videoEl,
        rect.left * scaleX, rect.top * scaleY, rect.width * scaleX, rect.height * scaleY,
        0, 0, cw, ch);
    } catch { /* noop */ }
    pins.forEach((p) => drawPinOnCanvas(ctx, (p.x / 100) * cw, (p.y / 100) * ch, p.label || ''));
    try { return canvas.toDataURL('image/jpeg', 0.85); } catch { /* noop */ }
  }

  return captureViaHtml2canvas(iframeEl, pins);
}

// 핀이 가리킨 실제 요소 정보 — 카스가 "어느 버튼인지" 정확히 읽을 수 있게 남긴다
export function describeTarget(iframeEl, clientX, clientY) {
  try {
    const doc = iframeEl && iframeEl.contentDocument;
    if (!doc) return null;
    const r = iframeEl.getBoundingClientRect();
    const el = doc.elementFromPoint(clientX - r.left, clientY - r.top);
    if (!el) return null;
    const text = (el.innerText || el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 80);
    return {
      tag: (el.tagName || '').toLowerCase(),
      text,
      label: el.getAttribute('aria-label') || el.getAttribute('title') || el.getAttribute('alt') || '',
    };
  } catch { return null; }
}
