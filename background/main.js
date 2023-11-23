'use strict'

const rootId = 'gm-lpffg'
const loginId = `${rootId}-login`
const passwordId = `${rootId}-password`
const contexts = ['editable', 'password']

browser.runtime.onInstalled.addListener(() => {
    browser.contextMenus.create({ id: rootId, title: 'LPFFG', contexts })

    browser.contextMenus.create({ id: loginId, parentId: rootId, contexts, title: 'Login' })
    browser.contextMenus.create({ id: passwordId, parentId: rootId, contexts, title: 'Password' })

    browser.contextMenus.onClicked.addListener((info, tab) => {
        switch (info.menuItemId) {
            case loginId:
                browser.tabs.sendMessage(tab.id, { generate: 'login' })
                break
            case passwordId:
                browser.tabs.sendMessage(tab.id, { generate: 'pass' })
                break
            default:
                break
        }
    })
})
