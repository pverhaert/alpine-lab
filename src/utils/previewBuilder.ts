// Injected script to intercept console logs, runtime errors, and link navigations
const PREVIEW_INJECTED_SCRIPT = `
  <script>
    (function() {
      // 1. Console interceptor for Playground Console Panel
      const origLog = console.log;
      const origWarn = console.warn;
      const origError = console.error;
      const origInfo = console.info;

      function sendToParent(type, args) {
        try {
          const stringified = Array.from(args).map(arg => {
            if (typeof arg === 'object' && arg !== null) {
              try {
                return JSON.stringify(arg, null, 2);
              } catch(e) {
                return String(arg);
              }
            }
            return String(arg);
          }).join(' ');

          window.parent.postMessage({
            type: 'ALPINE_PLAYGROUND_CONSOLE',
            level: type,
            message: stringified,
            timestamp: new Date().toLocaleTimeString()
          }, '*');
        } catch(err) {
          // ignore postMessage error
        }
      }

      console.log = function(...args) {
        sendToParent('log', args);
        origLog.apply(console, args);
      };
      console.warn = function(...args) {
        sendToParent('warn', args);
        origWarn.apply(console, args);
      };
      console.error = function(...args) {
        sendToParent('error', args);
        origError.apply(console, args);
      };
      console.info = function(...args) {
        sendToParent('info', args);
        origInfo.apply(console, args);
      };

      // Catch global unhandled runtime errors
      window.onerror = function(message, source, lineno, colno, error) {
        sendToParent('error', ['[Runtime Error]', message, 'at line ' + lineno]);
        return false;
      };

      window.addEventListener('unhandledrejection', function(event) {
        sendToParent('error', ['[Unhandled Promise Rejection]', event.reason]);
      });

      // 2. Intercept link clicks to prevent the preview iframe from reloading the main application
      document.addEventListener('click', function(event) {
        const anchor = event.target && event.target.closest ? event.target.closest('a') : null;
        if (!anchor) return;

        const rawHref = anchor.getAttribute('href');

        // Case A: Empty href (""), missing href, or "#":
        // Always prevent default navigation so iframe does not reload the page.
        // DO NOT call event.stopPropagation() so Alpine.js @click listeners continue to fire!
        if (rawHref === '' || rawHref === '#' || rawHref === null || rawHref === undefined) {
          event.preventDefault();
          return;
        }

        // Case B: Same-page anchor tag (e.g. href="#features")
        if (rawHref.startsWith('#')) {
          event.preventDefault();
          try {
            const targetEl = document.querySelector(rawHref);
            if (targetEl) {
              targetEl.scrollIntoView({ behavior: 'smooth' });
            }
          } catch (e) {}
          return;
        }

        // Case C: javascript: protocol
        if (rawHref.toLowerCase().startsWith('javascript:')) {
          return;
        }

        // Case D: External links (http://, https://, //)
        // Prevent iframe navigation, open in new tab safely
        event.preventDefault();
        if (rawHref.startsWith('http://') || rawHref.startsWith('https://') || rawHref.startsWith('//')) {
          try {
            window.open(anchor.href, '_blank', 'noopener,noreferrer');
            sendToParent('info', ['[Playground Link] Opened external link in new tab:', anchor.href]);
          } catch (err) {
            sendToParent('warn', ['[Playground Link] Could not open link in new tab:', anchor.href]);
          }
        } else {
          // Case E: Relative links (e.g. "/", "./about", "/contact")
          // In a live playground, relative URLs do not exist and navigating would reload the editor.
          sendToParent('info', ['[Playground Link] Local path navigation prevented inside preview:', rawHref]);
        }
      }, true); // use capture phase so we intercept before browser default navigation

      // 3. Intercept form submissions to prevent iframe page refresh
      document.addEventListener('submit', function(event) {
        const form = event.target;
        const action = form && form.getAttribute ? form.getAttribute('action') : null;
        if (!action || action === '' || action === '#' || action.startsWith('/') || action.startsWith('./')) {
          event.preventDefault();
          sendToParent('info', ['[Playground Form] Form submitted (default page reload prevented)']);
        }
      }, true);

      // 4. Forward Escape key so Esc exits fullscreen even when focus is inside the preview iframe
      window.addEventListener('keydown', function(event) {
        if (event.key === 'Escape') {
          try {
            window.parent.postMessage({ type: 'ALPINE_PLAYGROUND_ESCAPE' }, '*');
          } catch(e) {}
        }
      });
    })();
  </script>
`;

export function generatePreviewHtml(userCode: string, theme: 'light' | 'dark' = 'light'): string {
  // Extract custom <script> tags or <style> tags if the student included full document structure,
  // or wrap clean component snippet into full HTML5 boilerplate.
  const isFullHtml =
    userCode.trim().toLowerCase().startsWith('<!doctype') ||
    userCode.trim().toLowerCase().startsWith('<html');

  if (isFullHtml) {
    // If full HTML document, inject base target, custom dark variant, and interceptor script safely
    const baseTag = '<base target="_blank">';
    const darkVariantStyle =
      '<style type="text/tailwindcss">@custom-variant dark (&:where(.dark, .dark *));</style>';
    const darkThemeScript = `<script>if (${theme === 'dark'}) { document.documentElement.classList.add('dark'); } else { document.documentElement.classList.remove('dark'); }</script>`;
    const fullInjection = `${baseTag}${darkVariantStyle}${darkThemeScript}${PREVIEW_INJECTED_SCRIPT}`;
    if (userCode.includes('</head>')) {
      return userCode.replace('</head>', `${fullInjection}</head>`);
    } else if (userCode.includes('<body')) {
      return userCode.replace('<body', `<head>${fullInjection}</head><body`);
    }
    return fullInjection + userCode;
  }

  const bgColor = theme === 'dark' ? '#0f172a' : '#f8fafc';
  const textColor = theme === 'dark' ? '#f1f5f9' : '#1e293b';

  return `<!DOCTYPE html>
<html lang="en"${theme === 'dark' ? ' class="dark"' : ''}>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <base target="_blank">
  <title>Alpine.js Live Preview</title>

  <!-- Google Fonts: Plus Jakarta Sans & Fira Code -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;600&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">

  <!-- Tailwind CSS v4 Browser Compiler -->
  <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
  <style type="text/tailwindcss">
    @custom-variant dark (&:where(.dark, .dark *));
  </style>

  <!-- Alpine.js Plugins (MUST be loaded BEFORE Alpine Core) -->
  <script defer src="https://cdn.jsdelivr.net/npm/@alpinejs/collapse@3.x.x/dist/cdn.min.js"></script>
  <script defer src="https://cdn.jsdelivr.net/npm/@alpinejs/persist@3.x.x/dist/cdn.min.js"></script>
  <script defer src="https://cdn.jsdelivr.net/npm/@alpinejs/focus@3.x.x/dist/cdn.min.js"></script>
  <script defer src="https://cdn.jsdelivr.net/npm/@alpinejs/intersect@3.x.x/dist/cdn.min.js"></script>
  <script defer src="https://cdn.jsdelivr.net/npm/@alpinejs/mask@3.x.x/dist/cdn.min.js"></script>

  <!-- Alpine.js Core -->
  <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>

  <style>
    /* Prevent Alpine flash of unstyled content */
    [x-cloak] { display: none !important; }

    body {
      font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
      background-color: ${bgColor};
      color: ${textColor};
      min-height: 100vh;
      padding: 1.5rem;
      margin: 0;
      box-sizing: border-box;
    }

    /* Custom scrollbars inside preview */
    ::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }
    ::-webkit-scrollbar-track {
      background: rgba(0, 40, 60, 0.05);
    }
    ::-webkit-scrollbar-thumb {
      background: rgba(250, 100, 50, 0.3);
      border-radius: 3px;
    }
  </style>

  ${PREVIEW_INJECTED_SCRIPT}
</head>
<body>
  <div id="playground-root">
    ${userCode}
  </div>
</body>
</html>`;
}

export function exportStandaloneHtml(code: string, title = 'Alpine.js Component'): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} - Thomas More</title>

  <!-- Google Fonts: Plus Jakarta Sans -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">

  <!-- Tailwind CSS v4 CDN -->
  <script src="https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4"></script>
  <style type="text/tailwindcss">
    @custom-variant dark (&:where(.dark, .dark *));
  </style>

  <!-- Alpine.js Plugins -->
  <script defer src="https://cdn.jsdelivr.net/npm/@alpinejs/collapse@3.x.x/dist/cdn.min.js"></script>
  <script defer src="https://cdn.jsdelivr.net/npm/@alpinejs/persist@3.x.x/dist/cdn.min.js"></script>
  <script defer src="https://cdn.jsdelivr.net/npm/@alpinejs/focus@3.x.x/dist/cdn.min.js"></script>
  <script defer src="https://cdn.jsdelivr.net/npm/@alpinejs/intersect@3.x.x/dist/cdn.min.js"></script>
  <script defer src="https://cdn.jsdelivr.net/npm/@alpinejs/mask@3.x.x/dist/cdn.min.js"></script>

  <!-- Alpine.js Core -->
  <script defer src="https://cdn.jsdelivr.net/npm/alpinejs@3.x.x/dist/cdn.min.js"></script>

  <style>
    [x-cloak] { display: none !important; }
    body {
      font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
      min-height: 100vh;
      background-color: #f8fafc;
      padding: 2rem 1rem;
    }
  </style>
</head>
<body>
  <!-- Generated by Thomas More Alpine.js Playground -->
  ${code}
</body>
</html>`;
}
