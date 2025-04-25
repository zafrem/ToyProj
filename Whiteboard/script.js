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
  ctx.beginPath();
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

saveButton.addEventListener('click', () => {
  const link = document.createElement('a');
  link.download = 'drawing.png';
  link.href = canvas.toDataURL();
  link.click();
});

function resizeCanvas() {
  const topBarHeight = document.getElementById('top-bar').offsetHeight;

  const width = canvas.clientWidth;
  const height = window.innerHeight - topBarHeight;

  canvas.width = width;
  canvas.height = height;

  ctx.lineCap = 'round';
}
window.addEventListener('resize', resizeCanvas);
window.addEventListener('load', resizeCanvas);

document.getElementById('backBtn').addEventListener('click', () => {
  window.location.href = "../index.html";
});
