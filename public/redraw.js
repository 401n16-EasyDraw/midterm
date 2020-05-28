'use strict';

/**
 * Socket.io emit that grabs canvas data from the draw page automatically on page load
 */
drawChannel.emit('getAllHistories');

/**
 * Handles a read element by calling the handlePayload function
 */
drawChannel.on('read', (payload) => {
  handlePayload(payload);
});

/**
 * Handles a payload containing all histories and the scroll position to properly display the view page
 */

drawChannel.on('deliveredAllHistories', (payload) => {
  all_histories = payload.all_histories;
  updateScrollInfo(payload);
  redrawExistingPage(payload.currIndex);
});

/**
 * Handles a payload containing drawing history for current page along with its current index in all histories.
 * Creates a new page when necessary.
 * @param {object} payload - object containing index and all histories
 */
drawChannel.on('deliveredCurrHistory', (payload) => {
  if (payload.currIndex <= all_histories.length - 1) {
    all_histories[payload.currIndex] = payload.line_history;
    redrawExistingPage(payload.currIndex);
  } else {
    line_history = new Array();
    all_histories.push(line_history);
    context.clearRect(0, 0, canvas.width, canvas.height);
  }
});

/**
 * Takes a payload containing the index of the page to delete and uses it to perform an array splice
 */
drawChannel.on('deleteHistory', (payload) => {
  all_histories.splice(payload, 1);
});

/**
 * Takes a payload containing the object of the draw page's current coordinates so that the redraw page can sync
 */
drawChannel.on('updateScroll', (payload) => {
  updateScrollInfo(payload);
});

/**
 * Event listener that saves the current page as a pdf when a user clicks the button with an ID of save-button.
 * This functionality is still a work in a progress. We have not implemented the ability to print past one page yet
 */
$('#save-button').on('click', function () {
  const imgData = canvas.toDataURL('#ffffff', {
    type: 'image/jpeg',
    encoderOptions: 1.0,
  });
  const pdf = new jsPDF('p', 'pt', 'a4');
  pdf.addImage(imgData, 0, 0);
  pdf.save('report.pdf');
});