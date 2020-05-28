'use strict';

getAllHistories();

function getAllHistories() {
  drawChannel.emit('getAllHistories');
}

drawChannel.on('read', (payload) => {
  handlePayload(payload);
});

drawChannel.on('deliveredAllHistories', (payload) => {
  all_histories = payload.all_histories;
  updateScrollInfo(payload);
  redrawExistingPage(payload.currIndex);
});

drawChannel.on('deliveredCurrHistory', (payload) => {
  console.log('What is all histories?', all_histories);
  if (payload.currIndex <= all_histories.length - 1) {
    all_histories[payload.currIndex] = payload.line_history;
    redrawExistingPage(payload.currIndex);
  } else {
    line_history = new Array();
    all_histories.push(line_history);
    context.clearRect(0, 0, canvas.width, canvas.height);
  }
});

drawChannel.on('deleteHistory', (payload) => {
  all_histories.splice(payload, 1);
});

drawChannel.on('updateScroll', (payload) => {
  updateScrollInfo(payload);
});

$('#save-button').on('click', function () {
  console.log('save button clicked!');
  const imgData = canvas.toDataURL('#ffffff', {
    type: 'image/jpeg',
    encoderOptions: 1.0,
  });
  const pdf = new jsPDF('p', 'pt', 'a4');
  pdf.addImage(imgData, 0, 0);
  pdf.save('report.pdf');
});