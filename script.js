const screens = ['splash','welcome','email','password','passwordDone','onboarding','finalWelcome'];
const labels = ['Splash screen','Sign in','Sign up with email','Entering password','Password entered','Onboarding','Welcome'];
let current = 'splash';
let splashTimer;
const toast = document.getElementById('toast');
let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3000);
}
function showScreen(name, updateHistory = true) {
  if (!screens.includes(name)) return;
  current = name;
  document.querySelectorAll('.screen').forEach(screen => screen.classList.toggle('active', screen.dataset.screen === name));
  document.querySelectorAll('#flowDots button').forEach(button => button.classList.toggle('active', button.dataset.target === name));
  if (updateHistory) history.replaceState(null, '', '#' + name);
  const device = document.querySelector('.device');
  if (device) device.scrollTop = 0;
}
function back() {
  const previous = {welcome:'splash', email:'welcome', login:'welcome', password:'email', passwordDone:'password', onboarding:'passwordDone', finalWelcome:'onboarding'};
  showScreen(previous[current] || 'welcome');
}
const dots = document.getElementById('flowDots');
screens.forEach((screen, index) => {
  const button = document.createElement('button');
  button.type = 'button';
  button.dataset.target = screen;
  button.innerHTML = `<span>${index + 1}</span>${labels[index]}`;
  button.addEventListener('click', () => showScreen(screen));
  dots.appendChild(button);
});
document.querySelectorAll('[data-go]').forEach(button => button.addEventListener('click', () => showScreen(button.dataset.go)));
document.querySelectorAll('[data-back]').forEach(button => button.addEventListener('click', back));
document.querySelectorAll('[data-toast]').forEach(button => button.addEventListener('click', () => showToast(button.dataset.toast)));
document.getElementById('restart').addEventListener('click', () => {
  clearTimeout(splashTimer);
  showScreen('splash');
  splashTimer = setTimeout(() => { if (current === 'splash') showScreen('welcome'); }, 1600);
});
document.getElementById('emailForm').addEventListener('submit', event => {
  event.preventDefault();
  const email = document.getElementById('email');
  const error = document.getElementById('emailError');
  if (!email.validity.valid || !email.value.trim()) {
    error.textContent = 'Please enter a valid email address.';
    email.focus();
    return;
  }
  error.textContent = '';
  showScreen('password');
});
const password = document.getElementById('password');
const createAccount = document.getElementById('createAccount');
const passwordError = document.getElementById('passwordError');
const rules = {
  length: value => value.length >= 8,
  upper: value => /[A-Z]/.test(value),
  lower: value => /[a-z]/.test(value),
  number: value => /[0-9]/.test(value)
};
function validatePassword() {
  const value = password.value;
  let validCount = 0;
  Object.entries(rules).forEach(([key, test]) => {
    const row = document.querySelector(`[data-rule="${key}"]`);
    const valid = test(value);
    row.classList.toggle('valid', valid);
    row.querySelector('span').textContent = valid ? '✓' : '●';
    if (valid) validCount++;
  });
  createAccount.disabled = validCount !== 4;
  passwordError.textContent = '';
}
password.addEventListener('input', validatePassword);
document.getElementById('togglePassword').addEventListener('click', event => {
  const visible = password.type === 'text';
  password.type = visible ? 'password' : 'text';
  event.currentTarget.textContent = visible ? '◉' : '◎';
});
document.getElementById('passwordForm').addEventListener('submit', event => {
  event.preventDefault();
  if (createAccount.disabled) {
    passwordError.textContent = 'Please meet all password requirements.';
    return;
  }
  // Demo only: never sends or stores credentials.
  document.getElementById('passwordDone').value = password.value;
  showScreen('passwordDone');
});
document.getElementById('toggleDonePassword').addEventListener('click', event => {
  const input = document.getElementById('passwordDone');
  const visible = input.type === 'text';
  input.type = visible ? 'password' : 'text';
  event.currentTarget.textContent = visible ? '◉' : '◎';
});
window.addEventListener('load', () => {
  const hash = location.hash.slice(1);
  if (screens.includes(hash) && hash !== 'splash') showScreen(hash, false);
  else {
    showScreen('splash', false);
    splashTimer = setTimeout(() => { if (current === 'splash') showScreen('welcome'); }, 1600);
  }
});
