'use strict'

const DEFAULT_SETTINGS = {
    presets: [
        { label: 'Login', length: 12, char_type: ['lower', 'upper', 'numbers'], no_repeat: false },
        { label: 'Password', length: 15, char_type: ['lower', 'upper', 'numbers', 'special'], no_repeat: true },
    ],
}

let presets = []
let selectedPresetIdx = null

const changeSelectedIdx = (idx) => {
    selectedPresetIdx = idx
    document.querySelector('.delete-btn').disabled = idx === null
    refreshPresetList()
    const data = presets[idx] || {}
    document.querySelector('.edit-from > input[name="label"]').value = data.label
    document.querySelector('.edit-from > input[name="length"]').value = data.length

    document.querySelectorAll('.edit-from > input[name="char_type"]').forEach((elm) => {
        elm.checked = data.char_type?.includes(elm.value)
    })

    document.querySelector('.edit-from > input[name="no_repeat"]').checked = data.no_repeat
}

const refreshPresetList = () => {
    const presetsElm = document.querySelector('.preset-list > .presets')
    presetsElm.innerHTML = ''
    for (let i = 0; i < presets.length; i++) {
        const presetElm = document.createElement('div')
        presetElm.classList.add('preset')
        if (i === selectedPresetIdx)
            presetElm.classList.add('active')
        presetElm.addEventListener('click', () => changeSelectedIdx(i))
        presetsElm.appendChild(presetElm)
    }
}

const loadSettings = () => {
    let data = browser.storage.sync.get()
    if (!data)
        browser.storage.sync.set(DEFAULT_SETTINGS)

    return { ...DEFAULT_SETTINGS, ...data }
}

window.addEventListener('load', () => {
    const form = document.querySelector('.edit-form')

    const settings = loadSettings()
    presets = settings.presets || []
    changeSelectedIdx(null)

    document.querySelector('.add-btn').addEventListener('click', () => {
        changeSelectedIdx(null)
        form.reset()
    })

    document.querySelector('.save-btn').addEventListener('click', (e) => {
        e.preventDefault()

        const formData = new FormData(form)
        const data = {
            label: formData.get('label'),
            char_type: formData.getAll('char_type'),
            no_repeat: formData.get('no_repeat'),
        }

        presets.push(data)

        browser.sync.set({ presets })
    })

    document.querySelector('.abort-btn').addEventListener('click', (e) => {
        e.preventDefault()
        changeSelectedIdx(selectedPresetIdx)
    })

    document.querySelector('.delete-btn').addEventListener('click', (e) => {
        e.preventDefault()
        if (selectedPresetIdx !== null)
            presets.splice(selectedPresetIdx, 1)
        changeSelectedIdx(null)
        browser.sync.set({ presets })
    })
})
