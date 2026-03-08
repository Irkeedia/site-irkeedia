/* ============================================
   IRKEEDIA — SPA Page Transitions
   Keeps audio alive by preventing full reload:
   - intercept internal links
   - fetch target HTML
   - swap <body> content
   - execute target entry module
   ============================================ */

const AUDIO_ID = 'irkeedia-ambient-audio'

function isInternalUrl(url) {
  return url.origin === window.location.origin
}

function isHtmlNavigation(url) {
  const path = url.pathname.toLowerCase()
  return path.endsWith('.html') || path === '/' || !path.includes('.')
}

function saveAudioState() {
  const audio = document.getElementById(AUDIO_ID)
  if (audio && audio.currentTime > 0) {
    sessionStorage.setItem('irkeedia-audio-time', audio.currentTime.toFixed(2))
    sessionStorage.setItem('irkeedia-audio-played', 'true')
  }
}

function copyBodyAttributes(fromBody, toBody) {
  Array.from(toBody.attributes).forEach((attr) => {
    if (attr.name !== 'id' && attr.name !== 'class') {
      toBody.removeAttribute(attr.name)
    }
  })
  Array.from(fromBody.attributes).forEach((attr) => {
    toBody.setAttribute(attr.name, attr.value)
  })
}

async function executeEntryModules(parsedDoc) {
  const scripts = Array.from(parsedDoc.querySelectorAll('script[type="module"][src]'))
  for (const script of scripts) {
    const src = script.getAttribute('src')
    if (!src) continue
    const abs = new URL(src, window.location.origin)
    const bust = `${abs.href}${abs.search ? '&' : '?'}spa=${Date.now()}`
    await import(/* @vite-ignore */ bust)
  }
}

async function spaNavigate(url, pushState = true) {
  const audio = document.getElementById(AUDIO_ID)
  saveAudioState()

  const res = await fetch(url.href, {
    credentials: 'same-origin',
    headers: { 'X-Requested-With': 'spa' },
  })
  if (!res.ok) {
    window.location.href = url.href
    return
  }

  const html = await res.text()
  const parser = new DOMParser()
  const parsedDoc = parser.parseFromString(html, 'text/html')
  const incomingBody = parsedDoc.body
  if (!incomingBody) {
    window.location.href = url.href
    return
  }

  document.title = parsedDoc.title || document.title
  copyBodyAttributes(incomingBody, document.body)
  document.body.innerHTML = incomingBody.innerHTML

  if (audio && !document.getElementById(AUDIO_ID)) {
    document.body.appendChild(audio)
  }

  if (pushState) {
    history.pushState({ spa: true }, '', url.href)
  }

  if (url.hash) {
    const target = document.querySelector(url.hash)
    if (target) {
      target.scrollIntoView({ behavior: 'auto', block: 'start' })
    }
  } else {
    window.scrollTo(0, 0)
  }

  await executeEntryModules(parsedDoc)
}

export function initPageTransitions() {
  if (window.__irkeediaSpaTransitions) return
  window.__irkeediaSpaTransitions = true

  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href]')
    if (!link) return
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
    if (link.target === '_blank' || link.hasAttribute('download')) return

    const href = link.getAttribute('href')
    if (!href || href.startsWith('mailto:') || href.startsWith('tel:')) return

    const url = new URL(href, window.location.href)
    if (!isInternalUrl(url) || !isHtmlNavigation(url)) return

    if (url.href === window.location.href) return

    e.preventDefault()
    spaNavigate(url).catch(() => {
      window.location.href = url.href
    })
  }, { capture: true })

  window.addEventListener('popstate', () => {
    const url = new URL(window.location.href)
    spaNavigate(url, false).catch(() => {
      window.location.href = url.href
    })
  })
}
