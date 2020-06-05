'use strict';

let lastInput;

/**
 * Event listener that adds a textbox that allows us to type text onto the canvas
 */
document.getElementById('container').addEventListener('mouseup', (event) => {
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

    if (lastInput) {
      lastInput.style['display'] = 'none';
    }

    lastInput = input;

    context.font = `${fontSize} ${fontStyle}`;

    input.addEventListener('keyup', (event) => {
      const payload = {
        text: event.target.value,
        xCoord,
        yCoord,
        fontSize,
        fontStyle,
      };

      context.fillText(payload.text, xCoord, yCoord);

      if (payload) {
        drawChannel.emit('textWrite', payload);
        input.id
          ? (line_history[input.id] = payload)
          : line_history.push(payload);
      }
    });

    document.body.appendChild(input);
  }
});

/**
 * The follow event listeners are quick workarounds to make the textbox clear when clicking away from it.
 * Since this requires too much focus on front end, we are limiting resources being put into this fix.
 */
$('#prev-page').on('click', () => {
  if (lastInput) {
    lastInput.style['display'] = 'none';
  }
});

$('#next-page').on('click', () => {
  if (lastInput) {
    lastInput.style['display'] = 'none';
  }
});

$('#pencil-button').on('click', () => {
  if (lastInput) {
    lastInput.style['display'] = 'none';
  }
});

$('#delete-page').on('click', () => {
  if (lastInput) {
    lastInput.style['display'] = 'none';
  }
});

$('#clear-all').on('click', () => {
  if (lastInput) {
    lastInput.style['display'] = 'none';
  }
});
