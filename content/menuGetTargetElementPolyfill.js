'use strict'

if (!browser.menus) browser.menus = {}

if (!browser.menus.getTargetElement) {
    let menuTarget = null
    const cleanupIfNeeded = () => {
        if (menuTarget && !document.contains(menuTarget)) menuTarget = null
    }
    document.addEventListener('contextmenu', (event) => menuTarget = event.target, true)
    document.addEventListener('visibilitychange', cleanupIfNeeded, true)
    browser.menus.getTargetElement = () => {
        cleanupIfNeeded()
        return menuTarget
    }
}
