
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

document.getElementById('container').addEventListener('mouseup', (event) => {
  console.log('at top of event');
  if (currentAction === 'text') {
    const { x, y } = event;
    const fontSize = `${$('#draw-text-font-size').val()}px`;
    const fontStyle = `${$('#draw-text-font-family').val()}`;

    const input = document.createElement('input');
    input.style.position = 'absolute';
    input.style.left = `${x}px`;
    input.style.top = `${y}px`;
    input.style['z-index'] = '999999999';
    input.style['font-size'] = fontSize;
    input.style['font-style'] = fontStyle;
    context.font = `${fontSize} ${fontStyle}`;
    context.fillText('Hello World', event.clientX, event.clientY);
    input.addEventListener('keyup', (event) => {
      const payload = { text: event.target.value, x, y };
      console.log('What is payload.text?', payload.text);
      console.log('values of clicked x and y:', clickedX, clickedY);
      context.fillText(payload.text, clickedX, clickedY);
      console.log(payload);
      drawChannel.emit('textWrite', payload);
    });
    document.body.appendChild(input);
  }
});

