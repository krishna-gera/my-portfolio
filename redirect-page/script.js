const params = new URLSearchParams(window.location.search);
const target = params.get('to') || 'https://google.com';
const seconds = Number(params.get('delay')) || 3;

const message = document.getElementById('message');
const fallbackLink = document.getElementById('fallbackLink');

fallbackLink.href = target;
message.textContent = `You'll be redirected in ${seconds} second${seconds === 1 ? '' : 's'}.`;

let remaining = seconds;
const countdown = setInterval(() => {
  remaining -= 1;

  if (remaining > 0) {
    message.textContent = `You'll be redirected in ${remaining} second${remaining === 1 ? '' : 's'}.`;
    return;
  }

  clearInterval(countdown);
  window.location.href = target;
}, 1000);
