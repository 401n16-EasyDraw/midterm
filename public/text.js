'use strict';

document.getElementById('container').addEventListener('mouseup', (event) => {
  console.log('at top of event');
  if (currentAction === 'text') {
    const { x, y } = event;
    const fontSize = `${$('#draw-text-font-size').val()}px`;
    const fontStyle = `${$('#draw-text-font-family').val()}`;

    const input = document.createElement('input');
    input.focus();
    setTimeout(() => {
      input.focus();
    }, 20);
    input.style.position = 'absolute';
    input.style.left = `${x}px`;
    input.style.top = `${y}px`;
    input.style['z-index'] = '999999999';
    input.style['font-size'] = fontSize;
    input.style['font-style'] = fontStyle;
    input.id = line_history.length;
    context.font = `${fontSize} ${fontStyle}`;

    input.addEventListener('keyup', (event) => {
      const payload = { text: event.target.value, xCoord, yCoord, fontSize, fontStyle };
      console.log('What is payload text now?', payload.text);
      context.fillText(payload.text, xCoord, yCoord);
      
      if (payload) {
        drawChannel.emit('textWrite', payload);
        input.id ? line_history[input.id] = payload: line_history.push(payload);
      }
    });
    document.body.appendChild(input);
  }
});

