let cellsNumber = 24;
let bombNumber = Math.floor(cellsNumber / 6);
let cells;

const table = document.querySelector('.game__table');
const modal = document.getElementById('modal');
const restartBtn = document.querySelector('.restart');
const flagCounter = document.querySelector('.flags');

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



table.addEventListener('click', (e) => {
    const target = e.target;

    if (target.nodeName != 'LI') return false;

    restartBtn.style.display = 'block';

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
        console.log(nextUniqueElems);
        
        primaryUniqueElems = null;
        nextUniqueElems = null;
        primaryElems = null;
        nextElems = null;
        empty.length = 0;
        nextEmpty.length = 0;
    }

    const allCells = document.querySelectorAll('.plug');
    if (allCells.length == bombNumber) {
        allCells.forEach(item => item.style.zIndex = '1');
        modal.style.display = 'flex';

        changeContent('You won!');

        document.querySelectorAll('.flag').forEach(flag => flag.remove());
    }
});

table.addEventListener('contextmenu', (e) => {
    e.preventDefault();

    const target = e.target;
    
    if (target.nodeName == 'UL') return false;

    if (target.classList.contains('flag')) {
        target.remove();
        flagCounter.innerText = flagCounter.innerText - 1;
    };

    if (!target.classList.contains('plug')) return false;

    if (flagCounter.innerText == cellsNumber) return false;

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

range.addEventListener('input', (e) => {
    cellsNumber = e.target.value;
    bombNumber = Math.floor(cellsNumber / 6);
});

document.querySelector('.start__btn').addEventListener('click', () => {
    document.querySelector('.start').style.display = 'none';
    document.querySelector('.game__panel').style.display = 'flex';
    buildTable(cellsNumber);
    
    cells = document.querySelectorAll('.game__cell');
    generateMines(cellsNumber);
    setBombNumbers();
});

document.querySelector('.menu__btn').addEventListener('click', backToMenu);

modal.addEventListener('click', (e) => {
    const target = e.target;
    if (target.nodeName != 'BUTTON') return false;

    if (target.classList.contains('modal__btn_menu')) {
        backToMenu();
    } else {
        restartGame();
    }

    modal.style.display = 'none';
});

function backToMenu() {
    document.querySelector('.start').style.display = 'block';
    document.querySelector('.game__panel').style.display = 'none';
    restartBtn.style.display = 'none';
    table.innerHTML = '';
    clearArrays();
}

function generateMines(cellsNumber) {
    for (let i = 0; i < bombNumber; i++) {
        const index = Math.floor(Math.random() * cellsNumber);
        const res = dublicates.find(item => item == index);
        if (res >= 0) {
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

function getEmpty(elem, array) {
    const x = elem.dataset.x;
    const y = elem.dataset.y;

    handleBombNumber(elem, array);

    if (array == empty) {
        primaryElems = array.filter(item => item.innerHTML == '');
    
        primaryUniqueElems = new Set(primaryElems);
    } else {
        nextElems = array.filter(item => item.innerHTML == '');
        nextUniqueElems = new Set(nextElems);
    }
}

function restartGame() {
    clearArrays();

    cells.forEach(cell => {
        cell.classList.add('plug');
        cell.style.cssText = 'background: #5d9130; color: #5d9130';
        cell.innerHTML = '';
    });
    
    restartBtn.style.display = 'none';
    generateMines(cellsNumber);
    setBombNumbers();
}

function clearArrays() {
    dublicates.length = 0;
    check.length = 0;
    empty.length = 0;
    nextEmpty.length = 0;
    neighbourDigits.length = 0;
    flagCounter.innerText = 0;
}

function changeContent(status, clazz) {
    const content = document.querySelector('.modal__content');
    const text = document.querySelector('.modal__text');

    text.innerText = status;
    clazz ? content.classList.add(clazz) : content.classList.remove('lose');
}

function buildTable(cellsNumber) {
    document.querySelector('.mines').innerText = bombNumber;
    let x = 0;
    let y = 0;

    for (let i = 0; i < cellsNumber; i++) {
        const newCell = document.createElement('li');
        newCell.classList.add('game__cell', 'plug');

        switch (i) {
            case 8:
            case 16:
            case 24:
            case 32:
            case 40:
            case 48:
            case 56:
            case 64:
            case 72:
            case 80:
                x = 0;
                y++;
                break;
        }
        newCell.setAttribute('data-x', `${x}`);
        newCell.setAttribute('data-y', `${y}`);

        table.append(newCell);
        x++;
    }
}