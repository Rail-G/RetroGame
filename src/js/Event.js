export default class Event {
    bloodMoon(evilNpc) {
        const boardEl = document.querySelector('.board-container');
        console.log(boardEl)
        boardEl.style.position = 'relative';
        boardEl.style.margin = '0 460px';
        const div = document.createElement('div')
        div.classList.add('theendinfo')
        div.innerHTML = `<span class="losetext" style="font-size: 60px; text-align: center;">--/Внимания/-- КРОВАВАЯ ЛУНА</span>`
        boardEl.appendChild(div)
        setTimeout(() => {
            document.querySelector('.losetext').remove()
            div.innerHTML = `<span class="losetext" style="font-size: 3.5rem; text-align: center; animation: moveIn 3s 0s cubic-bezier(.36,0,.06,1) alternate 2;">В этом этаже все враги стали сильнее и ловче</span>`
            boardEl.appendChild(div)
        }, 5500)
        setTimeout(() => {
            document.querySelector('.theendinfo').remove()
        }, 11000)
        evilNpc.forEach(elem => {
            elem.character.attack = Math.round(elem.character.attack * 1.3)
            elem.character.defence = Math.round(elem.character.defence * 1.3)
            elem.character.step = Math.round(elem.character.step + 1)
        })
        return evilNpc
    }

}