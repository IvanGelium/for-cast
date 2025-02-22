import './searchIcon.svg'
import './weathericons01.svg'
import './weathericons17.svg'
import './weathericons19.svg'
import './weathericons39.svg'
import { format, add } from 'date-fns'
// Supports weights 100-800
import '@fontsource-variable/sora'
import './index.css'

const today = format(new Date(), 'yyyy-MM-dd')
const nextWeek = format(add(new Date(), { days: 6 }), 'yyyy-MM-dd')
const WC = document.querySelector('.weatherContainer')
const header = document.querySelector('.header')
header.lastElementChild.firstElementChild.addEventListener('submit', (e) => {
    e.preventDefault()
    const fd = new FormData(header.lastElementChild.firstElementChild)
    const obj = Object.fromEntries(fd)
    console.log(obj.search)
    const weather = getWeather(obj)
    weather.then((weatherRes) => {
        uiDraw(weatherRes)
    })
})

const getWeather = async (obj) => {
    try {
        const weatherPromise = await fetch(
            `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${obj.search}/${today}/${nextWeek}?unitGroup=metric&include=days%2Chours%2Ccurrent&key=SD4RGNTN8APKWC5DYE67VJLG5&contentType=json`,
            {
                method: 'GET',
            }
        )
        return await weatherPromise.json()
    } catch (error) {
        console.log('I just cant ' + error)
        header.lastElementChild.lastElementChild.textContent = 'City not found'
    }
}

function uiDraw(weatherRes) {
    if (weatherRes == undefined) {
        return
    }
    console.log(weatherRes)
    header.lastElementChild.lastElementChild.textContent =
        weatherRes.resolvedAddress
    for (let i = 0; i < weatherRes.days.length; i++) {
        let Cell = createDOMCell()
        dayTitleCard(i, weatherRes, Cell)
        for (let k = 0; k < weatherRes.days[i].hours.length; k++) {
            createDOMCard(i, k, weatherRes, Cell)
        }
    }
}

function createDOMCard(day, hour, weatherData, Cell) {
    const card = document.createElement('div')
    card.className = 'cellcell'
    const dayTime = document.createElement('div')
    dayTime.className = 'dayTime'
    let tm = weatherData.days[day].hours[hour].datetime + ''
    dayTime.textContent = tm.slice(0, 5)
    const dayTempa = document.createElement('div')
    dayTempa.textContent = weatherData.days[day].hours[hour].temp
    dayTempa.className = 'dayTempa'
    const dayDesc = document.createElement('div')
    if (weatherData.days[day].hours[hour].preciptype !== null) {
        dayDesc.textContent = `${weatherData.days[day].hours[hour].conditions}, ${weatherData.days[day].hours[hour].preciptype[0]} ${weatherData.days[day].hours[hour].precip * 100}% `
    }
    if (weatherData.days[day].hours[hour].preciptype === null) {
        dayDesc.textContent = `${weatherData.days[day].hours[hour].conditions}`
    }
    dayDesc.className = 'dayDesc'
    const dayIcon = document.createElement('img')
    dayIcon.src = chooseIcon(weatherData.days[day].hours[hour].conditions)
    dayIcon.className = 'dayIcon'
    const dayBar = document.createElement('div')
    const barObj = calcBar(weatherData.days[day].hours[hour].temp)
    dayBar.style.height = `${barObj.height}%`
    dayBar.style.backgroundColor = barObj.rgb
    dayBar.className = 'dayBar'

    Cell.appendChild(card)
    card.appendChild(dayTime)
    card.appendChild(dayTempa)
    card.appendChild(dayDesc)
    card.appendChild(dayIcon)
    card.appendChild(dayBar)
}

function createDOMCell() {
    const Cell = document.createElement('div')
    Cell.className = 'weatherCell'
    WC.appendChild(Cell)

    return Cell
}

function calcBar(tempa) {
    let isPlus
    if (tempa === 0) {
        return { height: 1, rgb: `rgb(0,255,0` }
    }
    if (tempa > 35) {
        tempa = 35
    }
    if (tempa < -35) {
        tempa = -35
    }
    if (tempa > 0) {
        isPlus = true
    }
    const barCoef = Math.abs(tempa / 35)
    const barHeight = Math.round(50 * barCoef + 5)
    const barColorCoef = Math.round(255 * barCoef + 30)
    const rgb = colorIsHard(isPlus, barColorCoef)
    return { height: barHeight, rgb: rgb }
}

function colorIsHard(isPlus, colCoef) {
    let remainder = 0
    let red = 0
    let green = 255
    let blue = 0
    if (isPlus) {
        red = colCoef * 2
        if (red >= 255) {
            remainder = red - 255
            green -= remainder
        }
    }

    if (!isPlus) {
        blue = colCoef * 2
        if (blue >= 255) {
            remainder = blue - 255
            green -= remainder
        }
    }
    return `rgb(${red},${green},${blue})`
}

function dayTitleCard(day, weatherData, Cell) {
    const card = document.createElement('div')
    card.className = 'cellcell first'
    const dayTime = document.createElement('div')
    dayTime.className = 'dayTime'
    dayTime.textContent = format(add(new Date(), { days: day }), 'dd MMM, EEEE')
    const dayTempa = document.createElement('div')
    dayTempa.textContent = weatherData.days[day].temp
    dayTempa.className = 'dayTempa'
    const dayDesc = document.createElement('div')
    if (weatherData.days[day].preciptype !== null) {
        dayDesc.textContent = `${weatherData.days[day].conditions}, ${weatherData.days[day].preciptype[0]} ${weatherData.days[day].precip * 100}% `
    }
    if (weatherData.days[day].preciptype === null) {
        dayDesc.textContent = `${weatherData.days[day].conditions}`
    }
    dayDesc.className = 'dayDesc'

    Cell.appendChild(card)
    card.appendChild(dayTime)
    card.appendChild(dayTempa)
    card.appendChild(dayDesc)
}

function chooseIcon(cond) {
    switch (cond) {
        case 'Clear':
            return 'url(./weathericons01.svg)'
        case 'Overvast':
            return 'url(./weathericons39.svg)'
        case 'Partially cloudy':
            return 'url(./weathericons17.svg)'
        default:
            return 'url(./weathericons19.svg)'
    }
}
