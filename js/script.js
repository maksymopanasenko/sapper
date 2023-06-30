const cells = document.querySelectorAll('.game__cell');

const dublicates = [];

for (let i = 0; i < 10; i++) {
    const index = Math.floor(Math.random() * 64);
    const res = dublicates.find(item => item == index);
    if (res) {
        i--;
    } else {
        dublicates.push(index);
        const bomb = document.createElement('img');
        bomb.classList.add('mine');
        bomb.setAttribute('src', 'img/mine.png');
        cells[index].append(bomb);
    }
}