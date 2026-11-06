
let count = 1;
const counterEl = document.getElementById('counter');
document.getElementById('increase').addEventListener('click', () => {
    count++;
    counterEl.textContent = count;
});
document.getElementById('decrease').addEventListener('click', () => {
    if (count > 1) count--;
    counterEl.textContent = count;
});
