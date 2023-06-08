const refs = {
  body: document.querySelector('body'),
  startBtn: document.querySelector('button[data-start]'),
  stopBtn: document.querySelector('button[data-stop]'),
};
let timerId = null;

function colorChanger() {
  // get color
  function getRandomHexColor() {
    return `#${Math.floor(Math.random() * 16777215)
      .toString(16)
      .padStart(6, 0)}`;
  }
  // change color
  refs.body.style.backgroundColor = `${getRandomHexColor()}`;
}

refs.startBtn.addEventListener('click', evt => {
  // btn disable
  refs.startBtn.setAttribute('disabled', true);
  refs.stopBtn.removeAttribute('disabled');
  // set interval
  timerId = setInterval(color => {
    colorChanger(color);
  }, 1000);
});

refs.stopBtn.addEventListener('click', evt => {
  //   clear interval
  clearInterval(timerId);
  // undisabled startBtn
  refs.startBtn.removeAttribute('disabled');
  refs.stopBtn.setAttribute('disabled', true);
});
