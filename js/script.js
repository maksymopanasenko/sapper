const cells = document.querySelectorAll('.game__cell');

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

document.querySelector('.game').addEventListener('click', (e) => {
    const target = e.target;

    if (target.nodeName != 'LI') return false;

    target.classList.remove('plug');

    if (target.children.length != 0) {
        target.firstElementChild.style.zIndex = '1';
        target.style.background = 'red';
    } else {
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
                if (item.innerText) {
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

    const all = document.querySelectorAll('.plug');
    console.log(all.length);
    if (all.length == 10) {
        all.forEach(item => item.style.zIndex = '1');
        const modal = document.createElement('div');
        modal.classList.add('modal');
        modal.innerHTML = `
            <p class="modal__text">You won!</p>
        `;
        document.querySelector('body').append(modal);
    }
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