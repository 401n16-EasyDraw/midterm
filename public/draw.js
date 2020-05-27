'use strict';

sendAllHistories();

function getCursorPosition(canvas, event) {
  console.log('Canvas type:', canvas);
  console.log('Event type:', event);
  const lineWidth = $('#line-width').val();
  const lineColor = `#${$('#color-picker').val()}`;

  if (event.type === 'mousedown' || isDrawing) {
    const rect = canvas.getBoundingClientRect();
    const newXCoords = event.clientX - rect.left;
    const newYCoords = event.clientY - rect.top;

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
}

function updateHistoryAndIndex() {
  const historyPayload = { line_history, currIndex };
  //console.log('historyPayload:', historyPayload);
  // need to emit somewhere here once we get socket.io functionality
}

function sendAllHistories() {
  const scrollY = window.scrollY;
  const height = canvas.height;
  console.log('scroll to send on page load:', scrollY);
  const historyPayload = { all_histories, currIndex, scrollY, height };
  //console.log('historyPayload:', historyPayload);
}

document.addEventListener('scroll', function() {
  let scrollPayload = {};
  if (getDocHeight() - 20 <= getScrollXY()[1] + window.innerHeight) {
    scrollPayload.height = canvas.height;
  }
  scrollPayload.scrollY = window.scrollY;
  updateScrollInfo(scrollPayload);
  // need to emit somewhere here once we get socket.io functionality
  redrawExistingPage(currIndex);
  updateHistoryAndIndex();
});


$canvas.on('mousedown', function(e) {
  const payload = getCursorPosition(canvas, e);
  //console.log('payload on mousedown:', payload);
  // need to emit somewhere here once we get socket.io functionality
});

$canvas.on('mousemove', function(e) {
  if (isDrawing) {
    const payload = getCursorPosition(canvas, e);
    //console.log('payload on mousedown:', payload);
    // need to emit somewhere here once we get socket.io functionality
  }
});

$canvas.on('mouseup', function(e) {
  if (isDrawing) {
    const payload =  getCursorPosition(canvas, e);
    // need to emit somewhere here once we get socket.io functionality
    isDrawing = false;
  }
});

$canvas.on('mouseleave', function(e) {
  isDrawing = false;
});

$('#clear-all').on('click', function() {
  console.log('clear all button pressed');
  context.clearRect(0, 0, canvas.width, canvas.height);
  line_history = new Array();
  all_histories[currIndex] = line_history;
  updateHistoryAndIndex();
});

$('#next-page').on('click', function() {
  const newIndex = currIndex + 1;
  if (newIndex <= all_histories.length - 1) {
    redrawExistingPage(newIndex);
    //console.log('found existing array:', line_history);
  } else {
    line_history = new Array();
    all_histories.push(line_history);
    context.clearRect(0, 0, canvas.width, canvas.height);
    currIndex = newIndex;
    //console.log('created new array!', all_histories);
  }
  updateHistoryAndIndex();
  //console.log('index is now ', currIndex);
});

$('#prev-page').on('click', function() {
  const newIndex = currIndex - 1;
  if (newIndex >= 0) {
    redrawExistingPage(newIndex);
    console.log(
      'moved back to page',
      currIndex,
      'with history of',
      line_history
    );
    updateHistoryAndIndex();
  }
});

$('#delete-page').on('click', function() {
  if (all_histories.length) {
    all_histories.splice(currIndex, 1);
    if (all_histories.length > 0) {
      const newIndex = currIndex === 0 ? currIndex + 1 : currIndex - 1;
      redrawExistingPage(newIndex);
    } else {
      //console.log('what do we have here?', all_histories);
      context.clearRect(0, 0, canvas.width, canvas.height);
    }
    updateHistoryAndIndex();
  }
});
