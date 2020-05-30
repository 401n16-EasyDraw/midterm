'use strict';

sendAllHistories();

context.font = '45px Arial';
context.fillText('Hello World', 10, 50); 
/**
 * @param {object} canvas - canvas HTML element to edit
 * @param {object} event - event object
 */
function getCursorPosition(canvas, event) {
  const rect = canvas.getBoundingClientRect();
  const newXCoords = event.clientX - rect.left;
  const newYCoords = event.clientY - rect.top;

  switch (currentAction) {
    case 'pencil':
      const lineWidth = $('#line-width').val();
      const lineColor = `#${$('#color-picker').val()}`;
    
      if (event.type === 'mousedown' || isDrawing) {
    
        if (event.type !== 'mousedown') {
          drawLine(
            context,
            xCoord,
            yCoord,
            newXCoords,
            newYCoords,
            lineWidth,
            lineColor
          );
        }
    
        xCoord = newXCoords;
        yCoord = newYCoords;
    
        const coordObj = {
          x: xCoord,
          y: yCoord,
          thickness: lineWidth,
          color: lineColor,
          eventType: event.type,
        };
    
        isDrawing = event.type === 'mouseup' ? false : true;
        line_history.push(coordObj);
        all_histories[currIndex] = line_history;
        return coordObj;
      }
      break;
    case 'text':
      clickedX = newXCoords;
      clickedY = newYCoords;
      break;
    default:
      break;
  }
}

document.addEventListener('keyup', (event) => {
  if (currentAction === 'text') {
    console.log('does this trigger?');
    context.fillText(event.target.value, clickedX, clickedY);
  }
});
/**
 * Helper function that sends the history of the drawer's current page to the viewer's page
 */

function updateHistoryAndIndex() {
  const historyPayload = { line_history, currIndex };
  drawChannel.emit('sendCurrHistory', historyPayload);
}

/**
 * Helper function that sends the histories of all pages from the drawer to the viewer
 */
function sendAllHistories() {
  const scrollY = window.scrollY;
  const height = canvas.height;
  const historyPayload = { all_histories, currIndex, scrollY, height };
  drawChannel.emit('sendAllHistories', historyPayload);
}


function sendScrollInfo(scrollPayload) {
  drawChannel.emit('updateScroll', scrollPayload);
}

/**
 * Event listener that calculates the page's current position when a scroll occurs
 */
document.addEventListener('scroll', function() {
  let scrollPayload = {};
  if (getDocHeight() - 20 <= getScrollXY()[1] + window.innerHeight) {
    scrollPayload.height = canvas.height;
  }
  scrollPayload.scrollY = window.scrollY;
  updateScrollInfo(scrollPayload);
  sendScrollInfo(scrollPayload);
  redrawExistingPage(currIndex);
  updateHistoryAndIndex();
});

/**
 * Event listener that emits a draw event on mousedown
 */
$canvas.on('mousedown', function(e) {
  const payload = getCursorPosition(canvas, e);
  drawChannel.emit('draw', payload);
});

/**
 * Event listener that emits a draw event on mouse movement if the user is actually drawing
 */
$canvas.on('mousemove', function(e) {
  if (isDrawing) {
    const payload = getCursorPosition(canvas, e);
    drawChannel.emit('draw', payload);
  }
});

/**
 * Event listener that emits one last draw event and sets the isDrawing boolean to false
 */
$canvas.on('mouseup', function(e) {
  if (isDrawing) {
    const payload =  getCursorPosition(canvas, e);
    drawChannel.emit('draw', payload);
    isDrawing = false;
  }
});

/**
 * Event listener that sets the isDrawing boolean to false if the mouse leaves the canvas element
 */
$canvas.on('mouseleave', function(e) {
  isDrawing = false;
});

/**
 * Event listener that executes a series of commands to clear the current page when a user clicks
 * the button with an ID of clear-all
 */
$('#clear-all').on('click', function() {
  context.clearRect(0, 0, canvas.width, canvas.height);
  line_history = new Array();
  all_histories[currIndex] = line_history;
  drawChannel.emit('sendHistory', line_history);
  updateHistoryAndIndex();
});

/**
 * Event listener that loads the next cached page when a user clicks the button with an ID of next-page
 */
$('#next-page').on('click', function() {
  const newIndex = currIndex + 1;
  if (newIndex <= all_histories.length - 1) {
    redrawExistingPage(newIndex);
  } else {
    line_history = new Array();
    all_histories.push(line_history);
    context.clearRect(0, 0, canvas.width, canvas.height);
    currIndex = newIndex;
  }
  updateHistoryAndIndex();
});

/**
 * Event listener that loads the previous cached page when a user clicks the button with an ID of prev-page
 */
$('#prev-page').on('click', function() {
  const newIndex = currIndex - 1;
  if (newIndex >= 0) {
    redrawExistingPage(newIndex);
    updateHistoryAndIndex();
  }
});

/**
 * Event listener that removes the current cached page from the list of cached pages. If a previous page exists,
 * that page will display upon deletion of current page. If a previous page does not exist, either the next page
 * will display or the current page will simply be cleared.
 */
$('#delete-page').on('click', function() {
  if (all_histories.length) {
    all_histories.splice(currIndex, 1);
    drawChannel.emit('deleteHistory', currIndex);
    if (all_histories.length > 0) {
      const newIndex = currIndex === 0 ? currIndex + 1 : currIndex - 1;
      redrawExistingPage(newIndex);
    } else {
      context.clearRect(0, 0, canvas.width, canvas.height);
    }
    updateHistoryAndIndex();
  }
});

$('#pencil-button').on('click', () => {
  currentAction = 'pencil';
});

$('#text-button').on('click', () => {
  currentAction = 'text';
});

/**
 * Calls the sendAllHistories function when a socket.io getAllHistories emit is received
 */
drawChannel.on('getAllHistories', () => {
  sendAllHistories();
});
