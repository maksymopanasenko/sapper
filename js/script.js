const table = document.querySelector('.game__table');
const cells = document.querySelectorAll('.game__cell');
const modal = document.getElementById('modal');

const dublicates = [];
const check = [];
const empty = [];
const nextEmpty = [];
const neighbourDigits = [];

let primaryElems;
let nextElems;
let primaryUniqueElems;
let nextUniqueElems;

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
        handleBombNumber(cells[index], check);
    }
}

table.addEventListener('click', (e) => {
    const target = e.target;

    if (target.nodeName != 'LI') return false;

    document.querySelector('.restart').style.display = 'block';

    if (target.children.length != 0) {
        const mines = document.querySelectorAll('.mine');
        mines.forEach(mine => mine.style.cssText = 'background: red; z-Index: 1');
        document.querySelectorAll('.flag').forEach(flag => flag.remove());
        modal.style.display = 'flex';
        modal.innerHTML = `
            <p class="modal__text lose">You lost!</p>
        `;
    } else {
        target.classList.remove('plug');
        target.style.background = '#b4b4b4';
        target.style.color = 'black';
    }

    if (target.innerHTML == '') {
        getEmpty(target, empty);
    }

    function getEmpty(elem, array) {
        const x = elem.dataset.x;
        const y = elem.dataset.y;

        const num_1 = Array.from(cells).filter(item => item.dataset.x == x && item.dataset.y == y-1);
        const num_2 = Array.from(cells).filter(item => item.dataset.x == x-1 && item.dataset.y == y);
        const num_3 = Array.from(cells).filter(item => item.dataset.x == +x+1 && item.dataset.y == y);
        const num_4 = Array.from(cells).filter(item => item.dataset.x == x && item.dataset.y == +y+1);
    
        array.push(elem, ...num_1, ...num_2, ...num_3, ...num_4);

        if (array == empty) {
            primaryElems = array.filter(item => item.innerHTML == '');
        
            primaryUniqueElems = new Set(primaryElems);
        } else {
            nextElems = array.filter(item => item.innerHTML == '');
            nextUniqueElems = new Set(nextElems);
        }
    }

    if (primaryUniqueElems) {
        primaryUniqueElems.forEach(item => {
            getEmpty(item, nextEmpty);
        });
    }

    for (let i =0; i <= nextUniqueElems?.size; i++) {
        nextUniqueElems.forEach(item => {
            getEmpty(item, nextEmpty);
        });
    }

    if (nextUniqueElems) {
        nextUniqueElems.forEach(item => {
            
            handleBombNumber(item, neighbourDigits);
    
            neighbourDigits.forEach(item => {
                if (item.innerText && item.innerHTML.length == 1) {
                    item.style.cssText = 'background: #b4b4b4; color: black';
                    item.classList.remove('plug');
                }
            });
            neighbourDigits.length = 0;
            item.style.background = '#b4b4b4';
            item.classList.remove('plug');
        });
        
        primaryUniqueElems.clear();
        nextUniqueElems.clear();
    }

    const allCells = document.querySelectorAll('.plug');
    
    if (allCells.length == 10) {
        allCells.forEach(item => item.style.zIndex = '1');
        modal.style.display = 'flex';
        modal.innerHTML = `
            <p class="modal__text">You won!</p>
        `;
        document.querySelectorAll('.flag').forEach(flag => flag.remove());
    }
});

table.addEventListener('contextmenu', (e) => {
    e.preventDefault();

    const target = e.target;
    const flagCounter = document.querySelector('.flags');
    
    if (target.nodeName == 'UL') return false;

    if (target.classList.contains('flag')) {
        target.remove();
        flagCounter.innerText = flagCounter.innerText - 1;
    };

    if (!target.classList.contains('plug')) return false;

    if (flagCounter.innerText == 10) return false;

    const flag = document.createElement('img');
    flag.setAttribute('src', 'img/flag.png');
    flag.setAttribute('alt', 'flag');
    flag.classList.add('flag');

    target.append(flag);
    flagCounter.innerText = +flagCounter.innerText + 1;
});

function handleBombNumber(bomb, array) {
    const x = bomb.dataset.x;
    const y = bomb.dataset.y;
    const num_1 = Array.from(cells).filter(item => item.dataset.x == x-1 && item.dataset.y == y-1);
    const num_2 = Array.from(cells).filter(item => item.dataset.x == x && item.dataset.y == y-1);
    const num_3 = Array.from(cells).filter(item => item.dataset.x == +x+1 && item.dataset.y == y-1);
    const num_4 = Array.from(cells).filter(item => item.dataset.x == x-1 && item.dataset.y == y);
    const num_5 = Array.from(cells).filter(item => item.dataset.x == +x+1 && item.dataset.y == y);
    const num_6 = Array.from(cells).filter(item => item.dataset.x == x-1 && item.dataset.y == +y+1);
    const num_7 = Array.from(cells).filter(item => item.dataset.x == x && item.dataset.y == +y+1);
    const num_8 = Array.from(cells).filter(item => item.dataset.x == +x+1 && item.dataset.y == +y+1);

    array.push(...num_1, ...num_2, ...num_3, ...num_4, ...num_5, ...num_6, ...num_7, ...num_8);
}

check.forEach(item => {
    const index = Array.from(cells).indexOf(item);
    const res = check.filter(it => it == item);

    if (!dublicates.includes(index)) item.innerText = res.length;
});