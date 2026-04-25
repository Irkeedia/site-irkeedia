import './styles/main.css'

function initMobileMenu() {
  const button = document.getElementById('menuBtn')
  const menu = document.getElementById('menuLinks')
  if (!button || !menu) return

  button.addEventListener('click', () => {
    const open = menu.classList.toggle('is-open')
    button.setAttribute('aria-expanded', String(open))
  })

  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      menu.classList.remove('is-open')
      button.setAttribute('aria-expanded', 'false')
    })
  })
}

function setCurrentYear() {
  const yearEl = document.getElementById('year')
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear())
  }
}

function init() {
  initMobileMenu()
  setCurrentYear()
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init)
} else {
  init()
}
