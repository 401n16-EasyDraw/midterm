let input;

// document.getElementById('container').addEventListener('mouseup', (event) => {
//   const { x, y } = event;
//   const input = document.createElement('input');
//   input.style.position = '';
//   input.style.left = `${x}px`;
//   input.style.top = `${y}px`;
//   input.style['z-index'] = '999999999';
//   context.font = '45px Arial';
//   context.fillText('Hello World', event.clientX, event.clientY);
//   input.addEventListener('keyup', (event) => {
//     const payload = { text: event.target.value, x, y };
//     console.log(payload);
//     drawChannel.emit('textWrite', payload);
//   });
//   document.body.appendChild(input);
// });

/**
 * Event listener that executes a series of commands to clear the current page when a user clicks
 * the button with an ID of clear-all
 */
$('#text-button').on('click', function () {
  // context.clearRect(0, 0, canvas.width, canvas.height);
  // text_history = new Array();
  // all_histories[currIndex] = text_history;
  // drawChannel.emit('sendHistory', text_history);
  // updateHistoryAndIndex();
  currentAction = 'type';
});