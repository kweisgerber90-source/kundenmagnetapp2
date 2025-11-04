// /public/widget.js
// 🔒 Kundenmagnet Widget v1.0.1 - Shadow DOM mit iFrame Fallback + Auto-Resize
// Basierend auf ChatGPT Security Review + Embedding Fix

(function () {
  'use strict'

  const WIDGET_VERSION = '1.0.1'
  const API_BASE_URL = 'https://kundenmagnet-app.de/api/widget'
  const IFRAME_BASE_URL = 'https://kundenmagnet-app.de/widget/frame'
  const CACHE_KEY = 'km_widget_cache'
  const CACHE_TTL = 5 * 60 * 1000 // 5 Minuten

  class KundenmagnetWidget {
    constructor(container) {
      this.container = container
      this.config = this.parseConfig()
      this.shadowRoot = null
      this.testimonials = []
      this.init()
    }

    parseConfig() {
      return {
        campaign: this.container.dataset.campaign || '',
        limit: parseInt(this.container.dataset.limit || '10', 10),
        sort: this.container.dataset.sort || 'newest',
        theme: this.container.dataset.theme || 'light',
        title: this.container.dataset.title || 'Kundenbewertungen',
        showRating: this.container.dataset.showRating !== 'false',
        animation: this.container.dataset.animation !== 'false',
      }
    }

    async init() {
      if (!this.config.campaign) {
        this.showError('Keine Kampagne angegeben')
        return
      }

      // Shadow DOM erstellen
      this.shadowRoot = this.container.attachShadow({ mode: 'open' })

      // Styles hinzufügen
      this.addStyles()

      // Loading-State
      this.showLoading()

      // Daten laden
      await this.loadTestimonials()
    }

    addStyles() {
      const style = document.createElement('style')
      style.textContent = `
:host {
  --km-primary: #4f8ef7;
  --km-bg: #ffffff;
  --km-text: #1a1a1a;
  --km-border: #e5e5e5;
  --km-star: #fbbf24;
  --km-shadow: rgba(0, 0, 0, 0.1);
}

:host([data-theme="dark"]) {
  --km-bg: #1f2937;
  --km-text: #f9fafb;
  --km-border: #374151;
  --km-shadow: rgba(0, 0, 0, 0.3);
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.widget-container {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: var(--km-bg);
  color: var(--km-text);
  border-radius: 8px;
  padding: 20px;
  box-shadow: 0 2px 8px var(--km-shadow);
}

.widget-header {
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 2px solid var(--km-border);
}

.widget-title {
  font-size: 18px;
  font-weight: 600;
  color: var(--km-text);
}

.testimonial-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.testimonial-card {
  background: var(--km-bg);
  border: 1px solid var(--km-border);
  border-radius: 6px;
  padding: 16px;
  transition: transform 0.2s, box-shadow 0.2s;
}

.testimonial-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px var(--km-shadow);
}

.testimonial-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.author-name {
  font-weight: 600;
  color: var(--km-text);
}

.testimonial-date {
  font-size: 12px;
  color: var(--km-text);
  opacity: 0.7;
}

.rating {
  display: flex;
  gap: 2px;
  margin-bottom: 8px;
}

.star {
  width: 16px;
  height: 16px;
  fill: var(--km-star);
}

.star.empty {
  fill: var(--km-border);
}

.testimonial-content {
  line-height: 1.6;
  color: var(--km-text);
}

.loading {
  text-align: center;
  padding: 40px;
}

.loading-spinner {
  display: inline-block;
  width: 32px;
  height: 32px;
  border: 3px solid var(--km-border);
  border-top-color: var(--km-primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error {
  text-align: center;
  padding: 20px;
  background: #fee;
  color: #c00;
  border-radius: 6px;
}

.powered-by {
  margin-top: 20px;
  padding-top: 12px;
  border-top: 1px solid var(--km-border);
  text-align: center;
  font-size: 11px;
  opacity: 0.7;
}

.powered-by a {
  color: var(--km-primary);
  text-decoration: none;
}

@media (max-width: 640px) {
  .widget-container {
    padding: 16px;
  }
  .testimonial-card {
    padding: 12px;
  }
}

.fade-in {
  animation: fadeIn 0.3s ease-in;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}
      `
      this.shadowRoot.appendChild(style)
    }

    showLoading() {
      const html = `
<div class="widget-container">
  <div class="loading">
    <div class="loading-spinner"></div>
    <p style="margin-top: 12px;">Bewertungen werden geladen...</p>
  </div>
</div>
      `
      this.shadowRoot.innerHTML += html
    }

    showError(message) {
      const html = `
<div class="widget-container">
  <div class="error">
    ${this.escapeHtml(message)}
  </div>
</div>
      `
      this.shadowRoot.innerHTML = this.shadowRoot.querySelector('style').outerHTML + html
    }

    async loadTestimonials() {
      try {
        // Cache prüfen
        const cached = this.getCache()
        if (cached) {
          this.testimonials = cached
          this.render()
          return
        }

        // API-Call
        const params = new URLSearchParams({
          campaign: this.config.campaign,
          limit: this.config.limit.toString(),
          sort: this.config.sort,
        })

        const response = await fetch(`${API_BASE_URL}?${params}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || 'Fehler beim Laden der Bewertungen')
        }

        const data = await response.json()
        this.testimonials = data.testimonials

        // In Cache speichern
        this.setCache(this.testimonials)

        // Rendern
        this.render()
      } catch (error) {
        console.error('Kundenmagnet Widget Error:', error)
        this.showError('Bewertungen konnten nicht geladen werden')
      }
    }

    getCache() {
      try {
        const key = `${CACHE_KEY}_${this.config.campaign}`
        const cached = localStorage.getItem(key)
        if (!cached) return null

        const { data, timestamp } = JSON.parse(cached)
        if (Date.now() - timestamp > CACHE_TTL) {
          localStorage.removeItem(key)
          return null
        }

        return data
      } catch {
        return null
      }
    }

    setCache(data) {
      try {
        const key = `${CACHE_KEY}_${this.config.campaign}`
        localStorage.setItem(
          key,
          JSON.stringify({
            data,
            timestamp: Date.now(),
          }),
        )
      } catch {
        // Ignore cache errors
      }
    }

    render() {
      const testimonialsHtml = this.testimonials
        .map((t, index) => {
          const stars = this.renderStars(t.rating)
          const date = new Date(t.created_at).toLocaleDateString('de-DE')
          const animationDelay = this.config.animation ? `animation-delay: ${index * 50}ms;` : ''

          return `
<div class="testimonial-card ${this.config.animation ? 'fade-in' : ''}" style="${animationDelay}">
  <div class="testimonial-header">
    <span class="author-name">${this.escapeHtml(t.name)}</span>
    <span class="testimonial-date">${date}</span>
  </div>
  ${
    this.config.showRating && t.rating
      ? `
  <div class="rating">
    ${stars}
  </div>
  `
      : ''
  }
  <div class="testimonial-content">
    ${this.escapeHtml(t.text)}
  </div>
</div>
          `
        })
        .join('')

      const html = `
<div class="widget-container">
  <div class="widget-header">
    <h3 class="widget-title">${this.escapeHtml(this.config.title)}</h3>
  </div>
  <div class="testimonial-list">
    ${testimonialsHtml || '<p>Noch keine Bewertungen vorhanden</p>'}
  </div>
  <div class="powered-by">
    Powered by <a href="https://kundenmagnet-app.de" target="_blank" rel="noopener">Kundenmagnet</a>
  </div>
</div>
      `

      this.shadowRoot.innerHTML = this.shadowRoot.querySelector('style').outerHTML + html
    }

    renderStars(rating) {
      if (!rating) return ''
      const stars = []
      for (let i = 1; i <= 5; i++) {
        const filled = i <= rating
        stars.push(`
<svg class="star ${filled ? '' : 'empty'}" viewBox="0 0 20 20">
  <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
</svg>
        `)
      }
      return stars.join('')
    }

    escapeHtml(text) {
      const div = document.createElement('div')
      div.textContent = text
      return div.innerHTML
    }
  }

  // iFrame Fallback für Browser ohne Shadow DOM Support
  function createIframeFallback(container, config) {
    const params = new URLSearchParams({
      campaign: config.campaign,
      limit: config.limit.toString(),
      sort: config.sort,
      theme: config.theme,
    })

    const iframe = document.createElement('iframe')
    iframe.src = `${IFRAME_BASE_URL}?${params}`
    iframe.style.cssText = 'width: 100%; border: none; min-height: 400px; display: block;'
    iframe.title = config.title || 'Kundenbewertungen'
    iframe.setAttribute('data-kundenmagnet-iframe', config.campaign)

    // Auto-Resize per postMessage
    const resizeListener = (event) => {
      // Sicherheit: Nur von kundenmagnet-app.de oder localhost akzeptieren
      const allowedOrigins = [
        'https://kundenmagnet-app.de',
        'http://localhost:3000',
        'http://127.0.0.1:3000',
      ]

      if (!allowedOrigins.includes(event.origin)) {
        return
      }

      if (event.data && event.data.type === 'kundenmagnet-resize') {
        // Finde das richtige iFrame (falls mehrere Widgets auf der Seite)
        const targetIframe = document.querySelector(
          `iframe[data-kundenmagnet-iframe="${config.campaign}"]`,
        )
        if (targetIframe) {
          targetIframe.style.height = event.data.height + 'px'
        }
      }
    }

    window.addEventListener('message', resizeListener)

    container.innerHTML = ''
    container.appendChild(iframe)

    // eslint-disable-next-line no-console
    console.log('[Kundenmagnet Widget] iFrame Fallback verwendet für:', config.campaign)
  }

  // Auto-Init für alle Container
  function initWidgets() {
    const containers = document.querySelectorAll('[data-kundenmagnet-widget]')

    containers.forEach((container) => {
      // Skip wenn bereits initialisiert
      if (container.shadowRoot || container.querySelector('iframe[data-kundenmagnet-iframe]')) {
        return
      }

      const config = {
        campaign: container.dataset.campaign || '',
        limit: parseInt(container.dataset.limit || '10', 10),
        sort: container.dataset.sort || 'newest',
        theme: container.dataset.theme || 'light',
        title: container.dataset.title || 'Kundenbewertungen',
        showRating: container.dataset.showRating !== 'false',
        animation: container.dataset.animation !== 'false',
      }

      if (!config.campaign) {
        console.error('[Kundenmagnet Widget] Fehler: data-campaign fehlt', container)
        container.innerHTML =
          '<div style="color: red; padding: 1rem;">Widget-Fehler: Kampagnen-Slug fehlt</div>'
        return
      }

      // Prüfe Shadow DOM Support
      if (typeof container.attachShadow === 'function') {
        try {
          new KundenmagnetWidget(container)
          // eslint-disable-next-line no-console
          console.log('[Kundenmagnet Widget] Shadow DOM verwendet für:', config.campaign)
        } catch (error) {
          console.error('[Kundenmagnet Widget] Shadow DOM Fehler:', error)
          // Fallback bei Fehler
          createIframeFallback(container, config)
        }
      } else {
        // Fallback zu iFrame für alte Browser
        createIframeFallback(container, config)
        // eslint-disable-next-line no-console
        console.log('[Kundenmagnet Widget] Browser unterstützt kein Shadow DOM')
      }
    })
  }

  // Init nach DOMContentLoaded oder sofort wenn DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWidgets)
  } else {
    // DOM ist bereits geladen
    initWidgets()
  }

  // Global verfügbar machen (für manuelle Initialisierung)
  window.KundenmagnetWidget = KundenmagnetWidget
  window.initKundenmagnetWidgets = initWidgets

  // eslint-disable-next-line no-console
  console.log(`[Kundenmagnet Widget v${WIDGET_VERSION}] Loaded successfully`)
})()
