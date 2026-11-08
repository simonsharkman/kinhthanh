with open('E:/kinhthanh/index.html', 'r', encoding='utf-8') as f:
    html = f.read()

target = '''  <!-- Google AdSense Integration (Cho phép Google hiển thị quảng cáo duy trì Website) -->
  <meta name="google-adsense-account" id="google-adsense-meta" content="ca-pub-9368045059000000">
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9368045059000000" crossorigin="anonymous" id="google-adsense-script"></script>

  <!-- Stylesheets -->
  <link rel="stylesheet" href="css/design-tokens.css?v=4.6.0">
  <link rel="stylesheet" href="css/animations.css?v=4.6.0">
  <link rel="stylesheet" href="css/layout.css?v=4.6.0">
  <link rel="stylesheet" href="css/components.css?v=4.6.8">'''

replacement = '''  <!-- Critical Inline CSS (Instant First Paint & Zero CLS) -->
  <style>
    :root {
      --bg-primary: #0f141c;
      --bg-surface: #171f2c;
      --text-primary: #e6edf3;
      --accent-gold: #e5a93c;
    }
    html, body {
      margin: 0;
      padding: 0;
      background-color: #0f141c;
      color: #e6edf3;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
      min-height: 100vh;
      -webkit-font-smoothing: antialiased;
    }
    #admin-banner-container { min-height: 38px; }
    #main-header { min-height: 52px; background: #131b26; }
    .portal-main-tabs { min-height: 48px; }
    .omni-search-wrapper { min-height: 38px; }
    .adsbygoogle { display: block; min-height: 90px; }
  </style>

  <!-- Google AdSense Integration (Deferred load to eliminate 225KiB unused JS, long tasks & CLS on initial render) -->
  <meta name="google-adsense-account" id="google-adsense-meta" content="ca-pub-9368045059000000">
  <script>
    window.addEventListener('load', function() {
      function loadAdSense() {
        if (window._adsenseLoaded) return;
        window._adsenseLoaded = true;
        var s = document.createElement('script');
        s.src = "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9368045059000000";
        s.async = true;
        s.crossOrigin = "anonymous";
        s.id = "google-adsense-script";
        document.head.appendChild(s);
      }
      if ('requestIdleCallback' in window) {
        requestIdleCallback(loadAdSense, { timeout: 3500 });
      } else {
        setTimeout(loadAdSense, 2000);
      }
      ['mousemove', 'touchstart', 'scroll', 'keydown'].forEach(function(e) {
        window.addEventListener(e, loadAdSense, { once: true, passive: true });
      });
    });
  </script>

  <!-- Stylesheets (Loaded asynchronously with preload to eliminate 2,860ms render-blocking) -->
  <link rel="preload" href="css/design-tokens.css?v=4.7.2" as="style" onload="this.onload=null;this.rel='stylesheet'">
  <link rel="preload" href="css/animations.css?v=4.7.2" as="style" onload="this.onload=null;this.rel='stylesheet'">
  <link rel="preload" href="css/layout.css?v=4.7.2" as="style" onload="this.onload=null;this.rel='stylesheet'">
  <link rel="preload" href="css/components.css?v=4.7.2" as="style" onload="this.onload=null;this.rel='stylesheet'">
  <noscript>
    <link rel="stylesheet" href="css/design-tokens.css?v=4.7.2">
    <link rel="stylesheet" href="css/animations.css?v=4.7.2">
    <link rel="stylesheet" href="css/layout.css?v=4.7.2">
    <link rel="stylesheet" href="css/components.css?v=4.7.2">
  </noscript>'''

# Normalize line endings to avoid CRLF mismatch
html_norm = html.replace('\r\n', '\n')
target_norm = target.replace('\r\n', '\n')
replacement_norm = replacement.replace('\r\n', '\n')

if target_norm in html_norm:
    html_norm = html_norm.replace(target_norm, replacement_norm, 1)
    with open('E:/kinhthanh/index.html', 'w', encoding='utf-8') as f:
        f.write(html_norm)
    print('Successfully applied performance and zero-CLS optimizations to index.html!')
else:
    print('ERROR: target string not found in index.html')
