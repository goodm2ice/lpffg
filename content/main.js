'use strict'

const LENGTH = 15
const CHARS = {
    lower: 'abcdefghijklmnopqrstuvwxyz',
    upper: 'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
    numbers: '0123456789',
    special: '!@#$%^&*()-_=+~`\'"\\/<>,.',
}

const PRESETS = {
    login: { length: 15, noRepeat: false, charTypes: ['lower', 'upper', 'numbers'] },
    pass: { length: 15, noRepeat: true, charTypes: ['lower', 'upper', 'special', 'numbers'] },
}

const randInt = (min, max) => Math.round(Math.random() * (max - min) + min)
const randChar = (str) => str[randInt(0, str.length)]

function generateRandom(length, charTypes, noRepeat) {
    const alphabet = charTypes.reduce((out, type) => out + (CHARS[type] || ''), '')
    if (alphabet.length <= 0) return ''
    const out = Array(length)
    for (let i = 0; i < out.length; i++) {
        out[i] = randChar(alphabet)
        if (i > 0 && noRepeat)
            while (out[i] === out[i - 1])
                out[i] = randChar(alphabet)
    }

    return out.join('')
}

browser.runtime.onMessage.addListener((message) => {
    const target = browser.menus.getTargetElement()
    if (!(message.generate in PRESETS)) return
    const value = PRESETS[message.generate]
    if (target.tagName === 'textarea')
        target.innerText = value
    else
        target.value = value
})
