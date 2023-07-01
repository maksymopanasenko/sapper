const cells = document.querySelectorAll('.game__cell');

const dublicates = [];

const check = [];

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
        setBombNumber(cells[index]);
    }
}

document.querySelector('.game').addEventListener('click', (e) => {
    const target = e.target;

    if (target.nodeName != 'LI') return false;

    if (target.children.length != 0) {
        target.firstElementChild.style.zIndex = '1';
    }

    target.style.background = '#b4b4b4';
});


function setBombNumber(bomb) {
    const x = bomb.dataset.x;
    const y = bomb.dataset.y;
    const num_1 = Array.from(cells).filter(item => item.dataset.x == x-1 && item.dataset.y == y-1)
    const num_2 = Array.from(cells).filter(item => item.dataset.x == x && item.dataset.y == y-1)
    const num_3 = Array.from(cells).filter(item => item.dataset.x == +x+1 && item.dataset.y == y-1)
    const num_4 = Array.from(cells).filter(item => item.dataset.x == x-1 && item.dataset.y == y)
    const num_5 = Array.from(cells).filter(item => item.dataset.x == +x+1 && item.dataset.y == y)
    const num_6 = Array.from(cells).filter(item => item.dataset.x == x-1 && item.dataset.y == +y+1)
    const num_7 = Array.from(cells).filter(item => item.dataset.x == x && item.dataset.y == +y+1)
    const num_8 = Array.from(cells).filter(item => item.dataset.x == +x+1 && item.dataset.y == +y+1)

    check.push(...num_1, ...num_2, ...num_3, ...num_4, ...num_5, ...num_6, ...num_7, ...num_8);
}


check.forEach(item => {
    const index = Array.from(cells).indexOf(item);
    const res = check.filter(it => it == item);

    if (!dublicates.includes(index)) item.innerText = res.length;
});