'use strict';

let isDrawing = false;
let xCoord = 0;
let yCoord = 0;
let currIndex = 0;
let line_history = new Array();
let all_histories = new Array();
all_histories.push(line_history);

const $container = $('#container');
$container.append('<canvas></canvas>');
const $canvas = $('#container canvas');
$canvas.attr('id', 'imageView');

const canvas = document.querySelector('canvas');
const context = canvas.getContext('2d');
canvas.width = $container.innerWidth();
canvas.height = $container.innerHeight();
const $body = $('body');


function getScrollXY() {
  let scrOfX = 0,
    scrOfY = 0;
  if (typeof window.pageYOffset === 'number') {
    scrOfY = window.pageYOffset;
    scrOfX = window.pageXOffset;
  } else if (
    document.body &&
    (document.body.scrollLeft || document.body.scrollTop)
  ) {
    scrOfY = document.body.scrollTop;
    scrOfX = document.body.scrollLeft;
  } else if (
    document.documentElement &&
    (document.documentElement.scrollLeft || document.documentElement.scrollTop)
  ) {
    scrOfY = document.documentElement.scrollTop;
    scrOfX = document.documentElement.scrollLeft;
  }
  return [scrOfX, scrOfY];
}

function getDocHeight() {
  const doc = document;
  return Math.max(
    doc.body.scrollHeight,
    doc.documentElement.scrollHeight,
    doc.body.offsetHeight,
    doc.documentElement.offsetHeight,
    doc.body.clientHeight,
    doc.documentElement.clientHeight
  );
}

function drawLine(context, x1, y1, x2, y2, lineWidth, color) {
  context.lineJoin = 'round';
  context.lineCap = 'round';
  context.beginPath();
  context.strokeStyle = color || 'black';
  context.lineWidth = lineWidth || 1;
  context.moveTo(x1, y1);
  context.lineTo(x2, y2);
  context.stroke();
  context.closePath();
}

function handlePayload(payload) {
  if (payload.eventType !== 'mousedown') {
    drawLine(
      context,
      xCoord,
      yCoord,
      payload.x,
      payload.y,
      payload.thickness,
      payload.color
    );
  }
  xCoord = payload.x;
  yCoord = payload.y;
}

function redrawExistingPage(newIndex) {
  line_history = all_histories[newIndex];
  context.clearRect(0, 0, canvas.width, canvas.height);
  currIndex = newIndex;
  line_history.forEach((coordObj) => {
    handlePayload(coordObj);
  });
}

function updateScrollInfo(payload) {
  if (payload.height) {
    canvas.height += payload.height;
    $container.height(canvas.height);
  }
  window.scrollTo(0, payload.scrollY);
}
