import flatpickr from 'flatpickr';
import Notiflix from 'notiflix';
import { pad } from 'lodash';
const refs = {
  input: document.querySelector('#datetime-picker'),
  startBtn: document.querySelector('button[data-start]'),
  timer: document.querySelector('.timer'),
 
};
const timerEl = {
  dayEl: refs.timer.querySelector('span[data-days]'),
  hourEl: refs.timer.querySelector('span[data-hours]'),
  minuteEl: refs.timer.querySelector('span[data-minutes]'),
  secondEl: refs.timer.querySelector('span[data-seconds]'),
}
let selectedUnixTime = 0;
let timerId = null;

refs.startBtn.setAttribute('disabled', true);

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    console.log(selectedDates[0]);
    const moment = Date.now();
    const date = new Date(selectedDates[0]);
   selectedUnixTime = date.getTime();
   if (selectedUnixTime - moment <= 0) {
    Notiflix.Notify.failure('Please choose a date in the future');
   } else {
    refs.startBtn.removeAttribute('disabled');
  }
  },
};

flatpickr('#datetime-picker', options);


function convertMs(unixTime) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = pad(Math.floor(unixTime / day));
  // Remaining hours
  const hours = pad(Math.floor((unixTime % day) / hour));
  // Remaining minutes
  const minutes = pad(Math.floor(((unixTime % day) % hour) / minute));
  // Remaining seconds
  const seconds = pad(
    Math.floor((((unixTime % day) % hour) % minute) / second)
  );

  return { days, hours, minutes, seconds };
}

function onStartBtn(evt) {
  timerId = setInterval(() => {
    const currentTime = Date.now();
    const timeToCount = selectedUnixTime - currentTime;
    const { days, hours, minutes, seconds } = convertMs(timeToCount);
    timerEl.dayEl.textContent = pad(days, 2, "0");
    timerEl.hourEl.textContent = pad(hours, 2, "0");
    timerEl.minuteEl.textContent = pad(minutes, 2, "0");
    timerEl.secondEl.textContent = pad(seconds, 2, "0");
    if (selectedUnixTime - currentTime < 5) {
      clearInterval(timerId);
      timerEl.dayEl.textContent = pad(0, 2, "0");
      timerEl.hourEl.textContent = pad(0, 2, "0");
      timerEl.minuteEl.textContent = pad(0, 2, "0");
      timerEl.secondEl.textContent = pad(0, 2, "0");
      refs.input.removeAttribute('disabled');
      return;
    }
  }, 1000);
  refs.startBtn.setAttribute('disabled', true);
  refs.input.setAttribute('disabled', true);
}


refs.startBtn.addEventListener('click', onStartBtn);
