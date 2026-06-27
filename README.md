# Matomo Consent Analytics Demo (Angular 20)

Nowoczesny frontend demo w Angularze (standalone components, strict TypeScript, signals, Reactive Forms, @if/@for) pokazujacy:

- landing page micro-product,
- consent manager banner,
- tracking eventow do Matomo,
- lokalny panel Analytics Preview.

## Stack

- Angular 20
- Standalone components (bez NgModules)
- Signals + computed
- Reactive Forms
- Lazy-loaded route dla `/analytics`

## Jak uruchomic

1. Zainstaluj zaleznosci:

```bash
npm install
```

2. Uruchom dev server:

```bash
npm start
```

3. Otworz:

- `http://localhost:4200/` - landing
- `http://localhost:4200/analytics` - analytics preview

4. Build produkcyjny:

```bash
npm run build
```

## GitHub Pages (main + /docs)

Projekt jest przygotowany do publikacji przez GitHub Pages z brancha `main` i folderu `/docs`.

1. Zbuduj wersje pod Pages:

```bash
npm run build:pages
```

2. Upewnij sie, ze w repo masz ustawione:
- `Settings -> Pages -> Build and deployment -> Deploy from a branch`
- Branch: `main`
- Folder: `/docs`

3. Commituj i pushuj wygenerowany folder `docs`.

Uwaga: `baseHref` jest ustawiony na `/matomo/` w konfiguracji `github-pages` w `angular.json`.
Jesli nazwa repo jest inna, zmien `baseHref` na `/<nazwa-repo>/`.

## Matomo: konfiguracja i integracja

Integracja jest w serwisie `src/app/core/services/matomo.service.ts`.

Aktualna konfiguracja:

- tracker URL: `https://izaw.matomo.coud/matomo.php`
- site id: `1`

Jesli endpoint ma inna nazwe hosta (np. `cloud`), podmien wartosc `trackerUrl` w `MatomoService`.

### Przyklad osadzenia Matomo JS

Dodaj snippet Matomo do `src/index.html` przed zamknieciem `</head>` lub przez tag manager:

```html
<script>
  var _paq = (window._paq = window._paq || []);
  _paq.push(['trackPageView']);
  _paq.push(['enableLinkTracking']);
  (function () {
    var u = 'https://YOUR_MATOMO_HOST/';
    _paq.push(['setTrackerUrl', u + 'matomo.php']);
    _paq.push(['setSiteId', '1']);
    var d = document,
      g = d.createElement('script'),
      s = d.getElementsByTagName('script')[0];
    g.async = true;
    g.src = u + 'matomo.js';
    s.parentNode.insertBefore(g, s);
  })();
</script>
```

Aplikacja ma fallback: jesli Matomo nie jest dostepne, dashboard nadal dziala lokalnie.

## Gdzie dodaje sie event tracking

Centralny punkt trackingu: `src/app/core/services/analytics.service.ts`.

Miejsca wywolan eventow:

- CTA click: `src/app/features/landing/landing.page.ts` (`onPrimaryCta`, `goToAnalyticsPreview`)
- FAQ open: `src/app/features/landing/components/faq-section.component.ts` + handler w `landing.page.ts`
- Scroll 50/75: `src/app/features/landing/landing.page.ts` (`ngOnInit` + `getScrollDepth`)
- Form start/submit: `src/app/features/landing/components/request-demo-form.component.ts` + handler w `landing.page.ts`
- Consent events: `src/app/app.ts` (accept/manage)

## Gdzie wpina sie Consent Manager

- UI bannera: `src/app/features/consent/consent-banner.component.ts`
- UI preferencji: `src/app/features/consent/consent-preferences.component.ts`
- Logika zgody: `src/app/core/services/consent.service.ts`
- Integracja z aplikacja root: `src/app/app.ts` + `src/app/app.html`

Tracking dziala dopiero po zgodzie (`canTrack` w `ConsentService`).

## Jak wygladaja dane w dashboardzie

- Trasa: `/analytics`
- Komponent: `src/app/features/analytics-preview/analytics-preview.page.ts`
- Stan dashboardu: signal `snapshot` z `AnalyticsService`
- Liczniki: CTA clicks, FAQ opens, form starts/submits, scroll 50/75
- Tabela: ostatnie eventy z flaga czy event trafil do Matomo czy fallbacku lokalnego

## Lista glownych plikow i rola

- `src/app/app.ts`: root shell, akcje consent, integracja bannera i preferencji
- `src/app/app.html`: layout aplikacji + router-outlet + consent UI
- `src/app/app.routes.ts`: routing z lazy loading dla landing i analytics preview
- `src/app/core/services/analytics.service.ts`: warstwa trackingowa (schema + publish do preview)
- `src/app/core/services/matomo.service.ts`: bezposrednia integracja z `_paq`
- `src/app/core/services/consent.service.ts`: stan zgody i persistence
- `src/app/models/analytics-event.model.ts`: typy eventow `category/action/name/value`
- `src/app/models/consent.model.ts`: typy consent state
- `src/app/models/analytics-preview.model.ts`: typy licznika i snapshotu dashboardu
- `src/app/features/landing/landing.page.ts`: kompozycja sekcji landing + scroll tracking
- `src/app/features/landing/components/hero-section.component.ts`: hero + 2 CTA
- `src/app/features/landing/components/features-section.component.ts`: feature cards
- `src/app/features/landing/components/faq-section.component.ts`: FAQ accordion
- `src/app/features/landing/components/request-demo-form.component.ts`: request demo form (Reactive Forms)
- `src/app/features/consent/consent-banner.component.ts`: banner Accept/Reject/Manage
- `src/app/features/consent/consent-preferences.component.ts`: panel preferencji
- `src/app/features/analytics-preview/analytics-preview.page.ts`: mini dashboard events
- `src/app/shared/utils/scroll-depth.util.ts`: util do obliczania glebokosci scrolla
- `src/styles.css`: design tokens i globalny nowoczesny styl SaaS

## Szybki scenariusz testu eventow

1. Wejdz na landing i **nie klikaj** Accept all: eventy nie powinny wpasc do dashboardu.
2. Kliknij Accept all w bannerze.
3. Kliknij oba CTA.
4. Otworz element FAQ.
5. Rozpocznij i wyslij formularz request demo.
6. Przewin strone do 50% i 75%.
7. Wejdz na `/analytics` i sprawdz liczniki oraz liste recent events.
