const table = document.querySelector('.game__table');
const cells = document.querySelectorAll('.game__cell');
const modal = document.getElementById('modal');
const restartBtn = document.querySelector('.restart');
const modalBtn = document.querySelector('.modal__btn');

const dublicates = [];
const check = [];
const empty = [];
const nextEmpty = [];
const neighbourDigits = [];
const flagsArray = [];

let primaryElems;
let nextElems;
let primaryUniqueElems;
let nextUniqueElems;

generateMines();
setBombNumbers();

table.addEventListener('click', (e) => {
    const target = e.target;

    if (target.nodeName != 'LI') return false;

    document.querySelector('.restart').style.display = 'block';

    if (target.children.length != 0) {
        const mines = document.querySelectorAll('.mine');
        mines.forEach(mine => mine.style.cssText = 'background: red; z-Index: 1');
        document.querySelectorAll('.flag').forEach(flag => flag.remove());
        modal.style.display = 'flex';

        changeContent('You lost!', 'lose');
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

        const num1 = Array.from(cells).filter(item => item.dataset.x == x && item.dataset.y == y-1);
        const num2 = Array.from(cells).filter(item => item.dataset.x == x-1 && item.dataset.y == y);
        const num3 = Array.from(cells).filter(item => item.dataset.x == +x+1 && item.dataset.y == y);
        const num4 = Array.from(cells).filter(item => item.dataset.x == x && item.dataset.y == +y+1);
    
        array.push(elem, ...num1, ...num2, ...num3, ...num4);

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

    for (let i = 0; i <= nextUniqueElems?.size; i++) {
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

        changeContent('You won!')

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

table.addEventListener('dblclick', (e) => {
    e.preventDefault();

    const target = e.target;
    
    if (target.nodeName == 'UL') return false;

    if (target.innerText) {
        handleBombNumber(target, flagsArray);
        const flags = flagsArray.filter(item => item.lastElementChild?.classList.contains('flag'));
        if (target.innerText == flags.length) {
            const nonFlags = flagsArray.filter(item => !item.lastElementChild?.classList.contains('flag'));
            nonFlags.forEach(item => {
                if (item.children.length != 0) {
                    const mines = document.querySelectorAll('.mine');
                    mines.forEach(mine => mine.style.cssText = 'background: red; z-Index: 1');
                    document.querySelectorAll('.flag').forEach(flag => flag.remove());
                    modal.style.display = 'flex';
            
                    changeContent('You lost!', 'lose');
                } else {
                    item.classList.remove('plug');
                    item.style.background = '#b4b4b4';
                    item.style.color = 'black';
                }
            });
        }

        flagsArray.length = 0;
    };
});

restartBtn.addEventListener('click', restartGame);

modalBtn.addEventListener('click', () => {
    modal.style.display = 'none';
    restartGame();
});

function generateMines() {
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
}

function handleBombNumber(bomb, array) {
    const x = bomb.dataset.x;
    const y = bomb.dataset.y;
    const num1 = Array.from(cells).filter(item => item.dataset.x == x-1 && item.dataset.y == y-1);
    const num2 = Array.from(cells).filter(item => item.dataset.x == x && item.dataset.y == y-1);
    const num3 = Array.from(cells).filter(item => item.dataset.x == +x+1 && item.dataset.y == y-1);
    const num4 = Array.from(cells).filter(item => item.dataset.x == x-1 && item.dataset.y == y);
    const num5 = Array.from(cells).filter(item => item.dataset.x == +x+1 && item.dataset.y == y);
    const num6 = Array.from(cells).filter(item => item.dataset.x == x-1 && item.dataset.y == +y+1);
    const num7 = Array.from(cells).filter(item => item.dataset.x == x && item.dataset.y == +y+1);
    const num8 = Array.from(cells).filter(item => item.dataset.x == +x+1 && item.dataset.y == +y+1);

    array.push(...num1, ...num2, ...num3, ...num4, ...num5, ...num6, ...num7, ...num8);
}

function setBombNumbers() {
    check.forEach(item => {
        const index = Array.from(cells).indexOf(item);
        const res = check.filter(it => it == item);
    
        if (!dublicates.includes(index)) item.innerText = res.length;
    });
}

function restartGame() {
    dublicates.length = 0;
    check.length = 0;
    empty.length = 0;
    nextEmpty.length = 0;
    neighbourDigits.length = 0;

    document.querySelector('.flags').innerText = 0;

    cells.forEach(cell => {
        cell.classList.add('plug');
        cell.style.cssText = 'background: #5d9130; color: #5d9130';
        cell.innerHTML = '';
    });    
    generateMines();
    setBombNumbers();
}

function changeContent(status, clazz) {
    const content = document.querySelector('.modal__content');
    const text = document.querySelector('.modal__text');

    text.innerText = status;
    clazz ? content.classList.add(clazz) : content.classList.remove('lose');
}