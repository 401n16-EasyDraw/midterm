'use strict';
/** 
 * These are common variables usedd throughout the rest of the front end js files.
 * Even though this file is called before the files which depend on these variables,
 * eslint is unable to account for variable declarations outside an immediate file.
 * A few eslint rules have been disabled to account for this.
 */
const drawChannel = io.connect('http://localhost:3000/draw');

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
let isTyping = false;

let currentAction = 'pencil';
let clickedX = 0;
let clickedY = 0;
let currTextbox;

//rectangle variables
let canvasx = $(canvas).offset().left;
 let canvasy = $(canvas).offset().top;
 let last_mousex;
 let last_mousey;
 let mousey;
 last_mousex = last_mousey = 0;
 let mousex = mousey = 0;
 let mousedown = false;

/**
 * Function that detect the distance between the mouse and the top of the document. 
 * This is especially useful when the user scrolls past the default height of the page and wishes to create
 * a longer document.
 * Credit: https://stackoverflow.com/questions/6460116/detecting-offset-of-an-element-on-scroll-in-javascript-jquery
 * @returns {Array} array containing the x and y coordinates (numbers)
 */
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

/**
 * Function that gets the height of a document element. This calculation is necessary because different browsers calculate
 * values differently even though they have common variables.
 * Credit: https://stackoverflow.com/questions/1145850/how-to-get-height-of-entire-document-with-javascript
 * @returns {number} the max height value among a different set of calculate height values
 */
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

/**
 * Function that draws a line on a canvas element
 * @param {object} context  - canvas context to perform the line drawing with
 * @param {number} x1 - starting x coordinate
 * @param {number} y1  - starting y coordinate
 * @param {number} x2  - ending x coordinate
 * @param {number} y2  - ending y coordinate
 * @param {number} lineWidth - line width of the line to create
 * @param {string} color - color of the line to create
 * @returns {void}
 */
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


/**
 * @param {object} payload - the object containing information to turn into some kind of drawing
 * @returns {void}
 */
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

/**
 * @param {number} newIndex - the index of the current page to redraw the HTML document
 */
function redrawExistingPage(newIndex) {
  line_history = all_histories[newIndex];
  context.clearRect(0, 0, canvas.width, canvas.height);
  currIndex = newIndex;
  line_history.forEach((coordObj) => {
    handlePayload(coordObj);
  });
}

/**
 * @param {object} payload - object telling the app the coordinates of the page to display
 * @returns {void}
 */
function updateScrollInfo(payload) {
  if (payload.height) {
    canvas.height += payload.height;
    $container.height(canvas.height);
  }
  window.scrollTo(0, payload.scrollY);
}
