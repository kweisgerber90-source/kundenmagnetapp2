// /public/widget.js
// 🔒 Kundenmagnet Widget v1.0.2 - Shadow DOM mit Debug-Modus
// Verbesserte Fehlerbehandlung und Logging

(function () {
  'use strict'

  const WIDGET_VERSION = '1.0.2'
  const API_BASE_URL = 'https://kundenmagnet-app.de/api/widget'
  const IFRAME_BASE_URL = 'https://kundenmagnet-app.de/widget/frame'
  const CACHE_KEY = 'km_widget_cache'
  const CACHE_TTL = 5 * 60 * 1000 // 5 Minuten

  // Debug Mode: Setze ?km-debug=1 in der URL oder localStorage.setItem('km_debug', '1')
  const DEBUG_MODE =
    new URLSearchParams(window.location.search).get('km-debug') === '1' ||
    localStorage.getItem('km_debug') === '1'

  function debugLog(...args) {
    if (DEBUG_MODE) {
      console.log('[Kundenmagnet Widget]', ...args)
    }
  }

  function debugError(...args) {
    if (DEBUG_MODE) {
      console.error('[Kundenmagnet Widget]', ...args)
    }
  }

  class KundenmagnetWidget {
    constructor(container) {
      this.container = container
      this.config = this.parseConfig()
      this.shadowRoot = null
      this.testimonials = []
      this.retryCount = 0
      this.maxRetries = 3
      this.init()
    }

    parseConfig() {
      const config = {
        campaign: this.container.dataset.campaign || '',
        limit: parseInt(this.container.dataset.limit || '10', 10),
        sort: this.container.dataset.sort || 'newest',
        theme: this.container.dataset.theme || 'light',
        title: this.container.dataset.title || 'Kundenbewertungen',
        showRating: this.container.dataset.showRating !== 'false',
        animation: this.container.dataset.animation !== 'false',
      }

      debugLog('Config parsed:', config)
      return config
    }

    async init() {
      if (!this.config.campaign) {
        const errorMsg = 'Keine Kampagne angegeben (data-campaign fehlt)'
        debugError(errorMsg)
        this.showError(errorMsg, {
          solution: 'Fügen Sie das Attribut data-campaign="ihr-slug" hinzu',
          example: '<div data-kundenmagnet-widget data-campaign="test" data-limit="10"></div>',
        })
        return
      }

      debugLog('Initializing widget for campaign:', this.config.campaign)

      // Shadow DOM erstellen
      try {
        this.shadowRoot = this.container.attachShadow({ mode: 'open' })
        debugLog('Shadow DOM created successfully')
      } catch (error) {
        debugError('Shadow DOM creation failed:', error)
        this.showError('Browser unterstützt kein Shadow DOM', {
          solution: 'Verwende iFrame-Fallback',
        })
        return
      }

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
  padding: 20px;
  background: #fee;
  color: #c00;
  border-radius: 6px;
  border-left: 4px solid #c00;
}

.error h3 {
  margin-bottom: 12px;
  font-size: 16px;
}

.error p {
  margin-bottom: 8px;
  line-height: 1.5;
}

.error-details {
  background: #fff;
  padding: 12px;
  border-radius: 4px;
  margin-top: 12px;
  font-size: 12px;
  font-family: monospace;
  color: #333;
  max-height: 200px;
  overflow-y: auto;
}

.error-solution {
  background: #fef3c7;
  padding: 12px;
  border-radius: 4px;
  margin-top: 12px;
  border-left: 4px solid #f59e0b;
}

.error-solution strong {
  color: #92400e;
}

.retry-button {
  background: var(--km-primary);
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  margin-top: 12px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
}

.retry-button:hover {
  background: #3d7be5;
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

.debug-info {
  background: #eff6ff;
  border: 1px solid #3b82f6;
  border-radius: 4px;
  padding: 8px;
  margin-top: 12px;
  font-size: 11px;
  color: #1e40af;
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
    ${DEBUG_MODE ? '<p class="debug-info">Debug-Modus aktiv</p>' : ''}
  </div>
</div>
      `
      this.shadowRoot.innerHTML += html
    }

    showError(message, details = {}) {
      debugError('Showing error:', message, details)

      let detailsHtml = ''
      if (DEBUG_MODE && details.apiResponse) {
        detailsHtml = `
<div class="error-details">
  <strong>API Response:</strong>
  <pre>${JSON.stringify(details.apiResponse, null, 2)}</pre>
</div>
        `
      }

      let solutionHtml = ''
      if (details.solution) {
        solutionHtml = `
<div class="error-solution">
  <strong>💡 Lösung:</strong><br>
  ${this.escapeHtml(details.solution)}
  ${details.example ? `<br><br><code>${this.escapeHtml(details.example)}</code>` : ''}
</div>
        `
      }

      const canRetry = this.retryCount < this.maxRetries
      const retryButton = canRetry
        ? `<button class="retry-button" onclick="this.getRootNode().host._widget.retryLoad()">🔄 Erneut versuchen</button>`
        : ''

      const html = `
<div class="widget-container">
  <div class="error">
    <h3>❌ ${this.escapeHtml(message)}</h3>
    <p><strong>Kampagne:</strong> ${this.escapeHtml(this.config.campaign)}</p>
    <p><strong>API URL:</strong> ${API_BASE_URL}</p>
    ${solutionHtml}
    ${detailsHtml}
    ${retryButton}
    ${DEBUG_MODE ? '<p class="debug-info">Öffnen Sie die Browser-Konsole (F12) für mehr Details</p>' : ''}
  </div>
</div>
      `
      this.shadowRoot.innerHTML = this.shadowRoot.querySelector('style').outerHTML + html

      // Store widget reference for retry
      this.shadowRoot.host._widget = this
    }

    async retryLoad() {
      this.retryCount++
      debugLog(`Retry attempt ${this.retryCount}/${this.maxRetries}`)
      this.showLoading()
      await this.loadTestimonials()
    }

    async loadTestimonials() {
      const startTime = Date.now()

      try {
        // Cache prüfen
        const cached = this.getCache()
        if (cached) {
          debugLog('Using cached data')
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

        const apiUrl = `${API_BASE_URL}?${params}`
        debugLog('Fetching from API:', apiUrl)

        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        })

        const loadTime = Date.now() - startTime
        debugLog(`API Response received in ${loadTime}ms, status: ${response.status}`)

        if (!response.ok) {
          let errorData
          try {
            errorData = await response.json()
          } catch {
            errorData = { error: 'Unbekannter Fehler' }
          }

          debugError('API Error:', response.status, errorData)

          // Spezifische Fehlermeldungen
          let errorMessage = errorData.error || 'Fehler beim Laden der Bewertungen'
          let solution = ''

          if (response.status === 404) {
            solution =
              'Prüfen Sie: 1) Kampagnen-Slug korrekt? 2) Kampagne aktiv? 3) Kampagne existiert in der Datenbank?'
          } else if (response.status === 400) {
            solution = 'Der Kampagnen-Parameter fehlt oder ist ungültig'
          } else if (response.status === 500) {
            solution = 'Serverseitiges Problem. Bitte später nochmal versuchen.'
          }

          throw new Error(errorMessage, {
            cause: {
              status: response.status,
              solution,
              apiResponse: errorData,
            },
          })
        }

        const data = await response.json()
        debugLog('API Response:', data)

        if (!data.testimonials || data.testimonials.length === 0) {
          debugLog('No testimonials found')
          this.testimonials = []
        } else {
          this.testimonials = data.testimonials
          debugLog(`Loaded ${this.testimonials.length} testimonials`)

          // In Cache speichern
          this.setCache(this.testimonials)
        }

        // Rendern
        this.render()
      } catch (error) {
        debugError('loadTestimonials error:', error)

        const details = {
          solution: error.cause?.solution || 'Bitte Support kontaktieren',
          apiResponse: error.cause?.apiResponse,
        }

        this.showError(error.message || 'Bewertungen konnten nicht geladen werden', details)
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
          debugLog('Cache expired')
          return null
        }

        debugLog('Cache hit')
        return data
      } catch (error) {
        debugError('Cache read error:', error)
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
        debugLog('Data cached')
      } catch (error) {
        debugError('Cache write error:', error)
      }
    }

    render() {
      if (this.testimonials.length === 0) {
        const html = `
<div class="widget-container">
  <div class="widget-header">
    <h3 class="widget-title">${this.escapeHtml(this.config.title)}</h3>
  </div>
  <div class="testimonial-list">
    <p style="text-align: center; padding: 40px 20px; color: var(--km-text); opacity: 0.7;">
      Noch keine Bewertungen vorhanden
    </p>
  </div>
  <div class="powered-by">
    Powered by <a href="https://kundenmagnet-app.de" target="_blank" rel="noopener">Kundenmagnet</a>
  </div>
</div>
        `
        this.shadowRoot.innerHTML = this.shadowRoot.querySelector('style').outerHTML + html
        debugLog('Rendered empty state')
        return
      }

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
    ${testimonialsHtml}
  </div>
  <div class="powered-by">
    Powered by <a href="https://kundenmagnet-app.de" target="_blank" rel="noopener">Kundenmagnet</a>
  </div>
</div>
      `

      this.shadowRoot.innerHTML = this.shadowRoot.querySelector('style').outerHTML + html
      debugLog(`Rendered ${this.testimonials.length} testimonials`)
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
      if (!text) return ''
      const div = document.createElement('div')
      div.textContent = text
      return div.innerHTML
    }
  }

  // iFrame Fallback für Browser ohne Shadow DOM Support
  function createIframeFallback(container, config) {
    debugLog('Creating iFrame fallback for:', config.campaign)

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
      const allowedOrigins = [
        'https://kundenmagnet-app.de',
        'http://localhost:3000',
        'http://127.0.0.1:3000',
      ]

      if (!allowedOrigins.includes(event.origin)) {
        return
      }

      if (event.data && event.data.type === 'kundenmagnet-resize') {
        const targetIframe = document.querySelector(
          `iframe[data-kundenmagnet-iframe="${config.campaign}"]`,
        )
        if (targetIframe) {
          targetIframe.style.height = event.data.height + 'px'
          debugLog('iFrame resized to:', event.data.height)
        }
      }
    }

    window.addEventListener('message', resizeListener)

    container.innerHTML = ''
    container.appendChild(iframe)

    debugLog('iFrame Fallback created')
  }

  // Auto-Init für alle Container
  function initWidgets() {
    debugLog('Initializing widgets, version:', WIDGET_VERSION)

    const containers = document.querySelectorAll('[data-kundenmagnet-widget]')
    debugLog(`Found ${containers.length} widget container(s)`)

    containers.forEach((container, index) => {
      // Skip wenn bereits initialisiert
      if (container.shadowRoot || container.querySelector('iframe[data-kundenmagnet-iframe]')) {
        debugLog(`Container ${index} already initialized, skipping`)
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
        debugError('Missing data-campaign on container:', container)
        container.innerHTML = `
<div style="color: red; padding: 1rem; border: 2px solid red; border-radius: 4px;">
  <strong>Widget-Fehler:</strong> Kampagnen-Slug fehlt<br>
  <small>Fügen Sie data-campaign="ihr-slug" hinzu</small>
</div>
        `
        return
      }

      debugLog(`Initializing widget ${index} for campaign:`, config.campaign)

      // Prüfe Shadow DOM Support
      if (typeof container.attachShadow === 'function') {
        try {
          new KundenmagnetWidget(container)
          debugLog('Widget initialized with Shadow DOM')
        } catch (error) {
          debugError('Shadow DOM initialization failed:', error)
          createIframeFallback(container, config)
        }
      } else {
        debugLog('Browser does not support Shadow DOM, using iFrame fallback')
        createIframeFallback(container, config)
      }
    })
  }

  // Init nach DOMContentLoaded oder sofort wenn DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWidgets)
  } else {
    initWidgets()
  }

  // Global verfügbar machen
  window.KundenmagnetWidget = KundenmagnetWidget
  window.initKundenmagnetWidgets = initWidgets

  // Debug-Hilfe
  if (DEBUG_MODE) {
    window.KundenmagnetDebug = {
      version: WIDGET_VERSION,
      testAPI: async (campaign) => {
        const url = `${API_BASE_URL}?campaign=${campaign}`
        console.log('Testing API:', url)
        const response = await fetch(url)
        const data = await response.json()
        console.log('Response:', data)
        return data
      },
      clearCache: () => {
        Object.keys(localStorage)
          .filter((key) => key.startsWith(CACHE_KEY))
          .forEach((key) => localStorage.removeItem(key))
        console.log('Cache cleared')
      },
    }

    console.log(
      `%c[Kundenmagnet Widget v${WIDGET_VERSION}]%c Debug-Modus aktiv`,
      'background: #4f8ef7; color: white; padding: 4px 8px; border-radius: 4px;',
      'color: #4f8ef7; font-weight: bold;',
    )
    console.log('Debug-Funktionen:', window.KundenmagnetDebug)
  } else {
    debugLog(`Loaded successfully, version: ${WIDGET_VERSION}`)
  }
})()
