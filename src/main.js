import './styles/main.css'

function initMobileMenu() {
  const button = document.getElementById('menuBtn')
  const menu = document.getElementById('menuLinks')
  if (!button || !menu) return

  const isMobile = () => window.innerWidth <= 860

  button.addEventListener('click', () => {
    const open = menu.classList.toggle('is-open')
    button.setAttribute('aria-expanded', String(open))
    if (!open) {
      // Close all dropdowns when closing mobile menu
      menu.querySelectorAll('.nav-group').forEach(closeGroup)
    }
  })

  // Close menu when clicking anchor links
  menu.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      if (isMobile()) {
        menu.classList.remove('is-open')
        button.setAttribute('aria-expanded', 'false')
        menu.querySelectorAll('.nav-group').forEach(closeGroup)
      }
    })
  })

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!menu.contains(e.target) && !button.contains(e.target)) {
      menu.classList.remove('is-open')
      button.setAttribute('aria-expanded', 'false')
      menu.querySelectorAll('.nav-group').forEach(closeGroup)
    }
  })
}

function openGroup(group) {
  const btn = group.querySelector('.nav-group-btn')
  const dropdown = group.querySelector('.nav-dropdown')
  if (!btn || !dropdown) return
  btn.setAttribute('aria-expanded', 'true')
  dropdown.classList.add('is-visible')
}

function closeGroup(group) {
  const btn = group.querySelector('.nav-group-btn')
  const dropdown = group.querySelector('.nav-dropdown')
  if (!btn || !dropdown) return
  btn.setAttribute('aria-expanded', 'false')
  dropdown.classList.remove('is-visible')
}

function initNavDropdowns() {
  const groups = document.querySelectorAll('.nav-group')
  const isMobile = () => window.innerWidth <= 860

  groups.forEach((group) => {
    const btn = group.querySelector('.nav-group-btn')
    const dropdown = group.querySelector('.nav-dropdown')
    if (!btn || !dropdown) return

    // Toggle on click (works for both desktop and mobile)
    btn.addEventListener('click', (e) => {
      e.stopPropagation()
      const isOpen = dropdown.classList.contains('is-visible')

      // Close all other groups first
      groups.forEach((g) => { if (g !== group) closeGroup(g) })

      if (isOpen) {
        closeGroup(group)
      } else {
        openGroup(group)
      }
    })

    // Desktop hover support
    group.addEventListener('mouseenter', () => {
      if (!isMobile()) openGroup(group)
    })

    group.addEventListener('mouseleave', () => {
      if (!isMobile()) closeGroup(group)
    })

    // Prevent dropdown click from closing it
    dropdown.addEventListener('click', (e) => {
      e.stopPropagation()
    })
  })

  // Close all dropdowns when clicking outside
  document.addEventListener('click', () => {
    groups.forEach(closeGroup)
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
  initNavDropdowns()
  setCurrentYear()
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init)
} else {
  init()
}
