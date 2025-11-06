// /public/widget.js
// 🔒 Kundenmagnet Widget v2.1.0 - Mit Colorful Theme + Horizontal Scroll
// Robuste Version für alle Plattformen (WordPress, Shopify, Wix, etc.)

void (function () {
  'use strict'

  const WIDGET_VERSION = '2.1.0'
  const API_BASE_URL = 'https://kundenmagnet-app.de/api/widget'
  const IFRAME_BASE_URL = 'https://kundenmagnet-app.de/widget/frame'
  const CACHE_KEY = 'km_widget_cache'
  const CACHE_TTL = 5 * 60 * 1000 // 5 Minuten

  // Debug Mode
  const DEBUG_MODE =
    new URLSearchParams(window.location.search).get('km-debug') === '1' ||
    localStorage.getItem('km_debug') === '1'

  function debugLog(...args) {
    if (DEBUG_MODE) {
      // eslint-disable-next-line no-console
      console.log('[Kundenmagnet Widget]', ...args)
    }
  }

  function debugError(...args) {
    // eslint-disable-next-line no-console
    console.error('[Kundenmagnet Widget ERROR]', ...args)
  }

  class KundenmagnetWidget {
    constructor(container) {
      this.container = container
      this.config = this.parseConfig()
      this.shadowRoot = null
      this.testimonials = []
      this.retryCount = 0
      this.maxRetries = 2
      this.usedFallback = false
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
        fallbackToIframe: this.container.dataset.fallbackToIframe !== 'false',
      }

      debugLog('Config:', config)
      return config
    }

    async init() {
      if (!this.config.campaign) {
        debugError('Campaign slug missing!')
        this.showError('Keine Kampagne angegeben (data-campaign fehlt)', {
          solution: 'Fügen Sie data-campaign="ihr-slug" zum Widget-Container hinzu',
        })
        return
      }

      debugLog('Initializing for campaign:', this.config.campaign)

      // Shadow DOM erstellen
      try {
        this.shadowRoot = this.container.attachShadow({ mode: 'open' })
        debugLog('Shadow DOM created')
      } catch (error) {
        debugError('Shadow DOM failed:', error)
        // Fallback zu iFrame wenn Shadow DOM nicht unterstützt
        this.fallbackToIframe('Browser unterstützt kein Shadow DOM')
        return
      }

      this.addStyles()
      this.showLoading()

      // Daten laden mit Fehlerbehandlung
      await this.loadTestimonials()
    }

    addStyles() {
      // Theme-Definitionen
      const themes = {
        light: {
          primary: '#4f8ef7',
          bg: '#ffffff',
          text: '#1a1a1a',
          border: '#e5e5e5',
          star: '#fbbf24',
          shadow: 'rgba(0, 0, 0, 0.1)',
        },
        dark: {
          primary: '#4f8ef7',
          bg: '#1f2937',
          text: '#f9fafb',
          border: '#374151',
          star: '#fbbf24',
          shadow: 'rgba(0, 0, 0, 0.3)',
        },
        minimal: {
          primary: '#000000',
          bg: '#ffffff',
          text: '#000000',
          border: '#d1d5db',
          star: '#000000',
          shadow: 'rgba(0, 0, 0, 0.05)',
        },
        colorful: {
          primary: '#ec4899',
          bg: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 50%, #fcd34d 100%)',
          text: '#1f2937',
          border: '#fbbf24',
          star: '#ef4444',
          shadow: 'rgba(236, 72, 153, 0.2)',
        },
      }

      const theme = themes[this.config.theme] || themes.light
      const isColorful = this.config.theme === 'colorful'

      const style = document.createElement('style')
      style.textContent = `
:host {
  --km-primary: ${theme.primary};
  --km-bg: ${theme.bg};
  --km-text: ${theme.text};
  --km-border: ${theme.border};
  --km-star: ${theme.star};
  --km-shadow: ${theme.shadow};
}

* {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

.widget-container {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  ${isColorful ? 'background: var(--km-bg);' : 'background: var(--km-bg);'}
  color: var(--km-text);
  border-radius: 8px;
  padding: 20px;
  ${isColorful ? 'box-shadow: 0 8px 30px var(--km-shadow);' : 'box-shadow: 0 2px 8px var(--km-shadow);'}
}

.widget-header {
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 2px solid var(--km-border);
}

.widget-title {
  font-size: 18px;
  font-weight: 600;
  ${isColorful ? 'background: linear-gradient(135deg, #ec4899, #f59e0b); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;' : ''}
}

/* ===== HORIZONTAL SCROLL (NEU) ===== */
.testimonial-list {
  display: flex;
  flex-direction: row; /* Horizontal statt column */
  gap: 16px;
  overflow-x: auto;
  overflow-y: hidden;
  scroll-behavior: smooth;
  padding-bottom: 12px;
  -webkit-overflow-scrolling: touch; /* iOS smooth scroll */
}

/* Custom Scrollbar */
.testimonial-list::-webkit-scrollbar {
  height: 8px;
}

.testimonial-list::-webkit-scrollbar-track {
  background: var(--km-border);
  border-radius: 4px;
}

.testimonial-list::-webkit-scrollbar-thumb {
  background: var(--km-primary);
  border-radius: 4px;
}

.testimonial-list::-webkit-scrollbar-thumb:hover {
  opacity: 0.8;
}

.testimonial-card {
  ${isColorful ? 'background: rgba(255, 255, 255, 0.95);' : 'background: var(--km-bg);'}
  border: 1px solid var(--km-border);
  border-radius: 6px;
  padding: 16px;
  min-width: 280px; /* Feste Mindestbreite für Carousel */
  max-width: 320px; /* Maximale Breite */
  flex-shrink: 0; /* Verhindert Schrumpfen */
  transition: transform 0.2s, box-shadow 0.2s;
  ${isColorful ? 'box-shadow: 0 4px 12px var(--km-shadow);' : ''}
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
  ${isColorful ? 'color: #ec4899;' : ''}
}

.testimonial-date {
  font-size: 12px;
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

.error-details {
  background: #fff;
  padding: 12px;
  border-radius: 4px;
  margin-top: 12px;
  font-size: 12px;
  font-family: monospace;
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
  opacity: 0.9;
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
    min-width: 240px; /* Kleiner auf Mobile */
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

    showError(message, details = {}) {
      debugError('Showing error:', message, details)

      let detailsHtml = ''
      if (DEBUG_MODE && details.technicalDetails) {
        detailsHtml = `
<div class="error-details">
  ${details.technicalDetails}
</div>
        `
      }

      const fallbackButton =
        this.config.fallbackToIframe && !this.usedFallback
          ? `<button class="retry-button" onclick="this.getRootNode().host._widget.fallbackToIframe('Manuelle Aktivierung')">📱 iFrame-Version verwenden</button>`
          : ''

      const html = `
<div class="widget-container">
  <div class="error">
    <h3>⚠️ ${this.escapeHtml(message)}</h3>
    <p><strong>Kampagne:</strong> ${this.escapeHtml(this.config.campaign)}</p>
    ${details.solution ? `<p><strong>Lösung:</strong> ${this.escapeHtml(details.solution)}</p>` : ''}
    ${detailsHtml}
    ${fallbackButton}
  </div>
</div>
      `
      this.shadowRoot.innerHTML = this.shadowRoot.querySelector('style').outerHTML + html

      // Store widget reference
      this.shadowRoot.host._widget = this
    }

    async loadTestimonials() {
      const startTime = Date.now()
      debugLog('Loading testimonials...')

      try {
        // Cache prüfen
        const cached = this.getCache()
        if (cached) {
          debugLog('Using cached data')
          this.testimonials = cached
          this.render()
          return
        }

        // API-Call mit verbessertem Error-Handling
        const params = new URLSearchParams({
          campaign: this.config.campaign,
          limit: this.config.limit.toString(),
          sort: this.config.sort,
        })

        const apiUrl = `${API_BASE_URL}?${params}`
        debugLog('Fetching from:', apiUrl)

        const controller = new AbortController()
        const timeoutId = setTimeout(() => controller.abort(), 10000) // 10s timeout

        const response = await fetch(apiUrl, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
          mode: 'cors',
          credentials: 'omit',
          signal: controller.signal,
        })

        clearTimeout(timeoutId)

        const loadTime = Date.now() - startTime
        debugLog(`API responded in ${loadTime}ms, status: ${response.status}`)

        if (!response.ok) {
          let errorData
          try {
            errorData = await response.json()
          } catch {
            errorData = { error: `HTTP ${response.status}` }
          }

          debugError('API Error:', response.status, errorData)

          // Bei 404 oder 500 → Fallback zu iFrame
          if (response.status === 404 || response.status === 500) {
            this.fallbackToIframe(`API Error: ${errorData.error || response.status}`)
            return
          }

          throw new Error(errorData.error || 'API-Fehler')
        }

        const data = await response.json()
        debugLog('Received data:', data)

        if (!data.testimonials) {
          debugError('No testimonials in response')
          this.fallbackToIframe('Keine Testimonials in API-Response')
          return
        }

        this.testimonials = data.testimonials
        this.setCache(this.testimonials)
        this.render()
      } catch (error) {
        debugError('loadTestimonials error:', error)

        // Bei Netzwerk-Fehler → Fallback zu iFrame
        if (error.name === 'TypeError' || error.name === 'AbortError') {
          debugError('Network error detected, falling back to iFrame')
          this.fallbackToIframe(`Netzwerk-Problem: ${error.message}. Versuche iFrame-Fallback...`)
          return
        }

        // Retry bei anderen Fehlern
        if (this.retryCount < this.maxRetries) {
          this.retryCount++
          debugLog(`Retry ${this.retryCount}/${this.maxRetries}`)
          setTimeout(() => this.loadTestimonials(), 1000 * this.retryCount)
          return
        }

        // Nach allen Retries → Fallback
        this.fallbackToIframe(`Fehler nach ${this.maxRetries} Versuchen: ${error.message}`)
      }
    }

    fallbackToIframe(reason) {
      if (this.usedFallback) return // Verhindere doppelten Fallback
      this.usedFallback = true

      debugLog('Falling back to iFrame, reason:', reason)

      // Entferne Shadow DOM
      if (this.shadowRoot) {
        this.shadowRoot.innerHTML = ''
      }

      // Erstelle iFrame
      const params = new URLSearchParams({
        campaign: this.config.campaign,
        limit: this.config.limit.toString(),
        sort: this.config.sort,
        theme: this.config.theme,
      })

      const iframe = document.createElement('iframe')
      iframe.src = `${IFRAME_BASE_URL}?${params}`
      iframe.style.cssText = 'width: 100%; border: none; min-height: 400px; display: block;'
      iframe.title = this.config.title || 'Kundenbewertungen'
      iframe.setAttribute('data-kundenmagnet-iframe', this.config.campaign)

      // Auto-Resize
      const resizeListener = (event) => {
        const allowedOrigins = [
          'https://kundenmagnet-app.de',
          'http://localhost:3000',
          'http://127.0.0.1:3000',
        ]

        if (!allowedOrigins.includes(event.origin)) return

        if (event.data && event.data.type === 'kundenmagnet-resize') {
          const targetIframe = document.querySelector(
            `iframe[data-kundenmagnet-iframe="${this.config.campaign}"]`,
          )
          if (targetIframe) {
            targetIframe.style.height = event.data.height + 'px'
          }
        }
      }

      window.addEventListener('message', resizeListener)

      this.container.innerHTML = ''
      this.container.appendChild(iframe)

      debugLog('iFrame fallback activated')
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
        // Ignore localStorage errors (quota exceeded, privacy mode, etc.)
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
    <p style="text-align: center; padding: 40px 20px; opacity: 0.7;">
      Noch keine Bewertungen vorhanden
    </p>
  </div>
  <div class="powered-by">
    Powered by <a href="https://kundenmagnet-app.de" target="_blank" rel="noopener">Kundenmagnet-app</a>
  </div>
</div>
        `
        this.shadowRoot.innerHTML = this.shadowRoot.querySelector('style').outerHTML + html
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
    Powered by <a href="https://kundenmagnet-app.de" target="_blank" rel="noopener">Kundenmagnet-app</a>
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

  // Auto-Init
  function initWidgets() {
    debugLog('Initializing widgets, version:', WIDGET_VERSION)

    const containers = document.querySelectorAll('[data-kundenmagnet-widget]')
    debugLog(`Found ${containers.length} container(s)`)

    containers.forEach((container, index) => {
      if (container.shadowRoot || container.querySelector('iframe[data-kundenmagnet-iframe]')) {
        debugLog(`Container ${index} already initialized`)
        return
      }

      const config = {
        campaign: container.dataset.campaign || '',
      }

      if (!config.campaign) {
        debugError('Missing data-campaign on container:', container)
        container.innerHTML = `
<div style="color: red; padding: 1rem; border: 2px solid red; border-radius: 4px;">
  <strong>Widget-Fehler:</strong> data-campaign fehlt<br>
  <small>Beispiel: &lt;div data-kundenmagnet-widget data-campaign="test"&gt;&lt;/div&gt;</small>
</div>
        `
        return
      }

      debugLog(`Initializing widget ${index} for campaign:`, config.campaign)

      try {
        new KundenmagnetWidget(container)
      } catch (error) {
        debugError('Widget initialization failed:', error)
        // iFrame wird automatisch als Fallback verwendet
      }
    })
  }

  // Init
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWidgets)
  } else {
    initWidgets()
  }

  // Global
  window.KundenmagnetWidget = KundenmagnetWidget
  window.initKundenmagnetWidgets = initWidgets

  debugLog(`Widget v${WIDGET_VERSION} loaded successfully`)
})()
