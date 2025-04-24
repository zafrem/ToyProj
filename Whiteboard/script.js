const canvas = document.getElementById('board');
const ctx = canvas.getContext('2d');
const colorPicker = document.getElementById('color');
const thicknessSlider = document.getElementById('thickness');
const saveButton = document.getElementById('save');

let painting = false;

canvas.addEventListener('mousedown', (e) => {
  painting = true;
  ctx.beginPath();
  ctx.moveTo(e.offsetX, e.offsetY);
});

canvas.addEventListener('mouseup', () => {
  painting = false;
  ctx.beginPath(); // 새 경로로 초기화 (중간 선 남는 거 방지)
});

canvas.addEventListener('mouseleave', () => {
  painting = false;
  ctx.beginPath();
});

canvas.addEventListener('mousemove', (e) => {
  if (!painting) return;

  ctx.lineWidth = thicknessSlider.value;
  ctx.strokeStyle = colorPicker.value;
  ctx.lineCap = 'round';

  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.stroke();
});

function draw(e) {
  if (!painting) return;

  ctx.lineWidth = thicknessSlider.value;
  ctx.strokeStyle = colorPicker.value;
  ctx.lineCap = 'round';

  ctx.lineTo(e.offsetX, e.offsetY);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(e.offsetX, e.offsetY);
}

// 클릭 시 저장
saveButton.addEventListener('click', () => {
  const link = document.createElement('a');
  link.download = 'drawing.png';
  link.href = canvas.toDataURL();
  link.click();
});

document.getElementById('backBtn').addEventListener('click', () => {
  window.location.href = "../index.html";
});