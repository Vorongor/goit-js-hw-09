import flatpickr from 'flatpickr';
import Notiflix from 'notiflix';
import { pad } from 'lodash';
const refs = {
  input: document.querySelector('#datetime-picker'),
  startBtn: document.querySelector('button[data-start]'),
  timer: document.querySelector('.timer'),
};
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
  },
};
flatpickr('#datetime-picker', options);

// time calculate
function timeCalc(input) {
  const moment = Date.now();
  const date = new Date(input.target.value);
  const unixTime = date.getTime();
  const par = unixTime - moment;
  selectedUnixTime = unixTime;
  return par;
}
// date check
function dateCheck(par) {
  if (par <= 0) {
    Notiflix.Notify.failure('Please choose a date in the future');
  } else {
    refs.startBtn.removeAttribute('disabled');
  }
}
function onDataSelect(input) {
    const par = timeCalc(input);
    dateCheck(par);
}


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
    const seconds = pad(Math.floor((((unixTime % day) % hour) % minute) / second));
  
    return { days, hours, minutes, seconds };
  }

function onStartBtn() {
  timerId = setInterval(() => {
    const currentTime = Date.now();
    const timeToCount = selectedUnixTime - currentTime;
    const { days, hours, minutes, seconds } = convertMs(timeToCount);
    refs.timer.querySelector('span[data-days]').textContent = days;
    refs.timer.querySelector('span[data-hours]').textContent = hours;
    refs.timer.querySelector('span[data-minutes]').textContent = minutes;
    refs.timer.querySelector('span[data-seconds]').textContent = seconds;
    if (selectedUnixTime - currentTime < 5) {
      clearInterval(timerId);
      refs.timer.querySelector('span[data-days]').textContent = 0;
    refs.timer.querySelector('span[data-hours]').textContent = 0;
    refs.timer.querySelector('span[data-minutes]').textContent = 0;
    refs.timer.querySelector('span[data-seconds]').textContent = 0;
    }
  }, 1000);
}

refs.input.addEventListener('input', onDataSelect);
refs.startBtn.addEventListener('click', onStartBtn);
