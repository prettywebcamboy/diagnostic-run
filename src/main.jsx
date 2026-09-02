import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

/* =========================
   NAVIGATION
========================= */

const nav = [
  ['Home', '#/'],
  ['Run Diagnostic', '#/diagnostic'],
  ['PC Performance', '#/pc'],
  ['Wi-Fi', '#/wifi'],
  ['Downloads', '#/downloads']
];

function useRoute() {
  const [path, setPath] = useState(location.hash || '#/');

  useEffect(() => {
    const handleHashChange = () => {
      setPath(location.hash || '#/');

      window.scrollTo({
        top: 0,
        behavior: 'instant'
      });
    };

    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  return path;
}

/* =========================
   LAYOUT
========================= */

function Layout({ children, path }) {
  return (
    <div className="app">

      <header>

        <a className="logo" href="#/">
          diagnostic<span>.run</span><i>_</i>
        </a>

        <nav>
          {nav.map(([label, href]) => (
            <a
              className={path === href ? 'active' : ''}
              href={href}
              key={href}
            >
              {label}
            </a>
          ))}
        </nav>

      </header>

      <main>
        {children}
      </main>

      <footer>

        <a href="#/">
          diagnostic.run
        </a>

        <span>
          LOCAL-FIRST DIAGNOSTICS / 2026
        </span>

      </footer>

    </div>
  );
}

/* =========================
   TERMINAL
========================= */

function Terminal({ rows }) {
  return (
    <div className="terminal">

      <div className="termbar">
        <span>DIAGNOSTIC.RUN</span>
        <span>● ● ●</span>
      </div>

      <div className="termbody">

        {rows.map((row, index) => (
          <div className="termrow" key={index}>

            <b>&gt;</b>

            <span className={row[1] === 'OK' ? 'ok' : ''}>
              {row[0]} {row[1]}
            </span>

          </div>
        ))}

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
      <section className="hero">

        <div>

          <small>
            SYSTEM DIAGNOSTICS / NO FLUFF
          </small>

          <h1>
            Know what's wrong.
            <br />
            <em>Fix what's slow.</em>
          </h1>

          <p>
            Run a quick browser-based check of
            your connection and device. Then get
            a clear path to the fix.
          </p>

          <div className="actions">

            <a
              className="button"
              href="#/diagnostic"
            >
              RUN DIAGNOSTIC →
            </a>

            <a href="#/pc">
              VIEW PERFORMANCE TIPS
            </a>

          </div>

        </div>

        <Terminal
          rows={[
            ['SYSTEM ONLINE', 'OK'],
            ['BROWSER CHECK', 'OK'],
            ['NETWORK READY', 'OK'],
            ['LATENCY 18 ms', 'OK'],
            ['DEVICE SCAN READY', '']
          ]}
        />

      </section>

      <section className="section">

        <div className="head">
          <span>01 / SERVICES</span>
          <span>SELECT A MODULE</span>
        </div>

        <div className="cards">

          <a href="#/pc">

            <span>01</span>

            <h2>
              PC Performance
            </h2>

            <p>
              Practical fixes for startup,
              storage, browsers and drivers.
            </p>

            <b>
              OPEN MODULE →
            </b>

          </a>

          <a href="#/wifi">

            <span>02</span>

            <h2>
              Wi-Fi
            </h2>

            <p>
              Find latency problems and
              improve your wireless setup.
            </p>

            <b>
              OPEN MODULE →
            </b>

          </a>

          <a href="#/downloads">

            <span>03</span>

            <h2>
              Downloads
            </h2>

            <p>
              Curated links for browsers,
              VPNs, drivers and utilities.
            </p>

            <b>
              OPEN MODULE →
            </b>

          </a>

        </div>

      </section>

      <section className="quick">

        <div>

          <span>QUICK WINS</span>

          <strong>03</strong>

        </div>

        <div>
          <b>01</b>{' '}
          Restart your router before
          changing settings.
        </div>

        <div>
          <b>02</b>{' '}
          Keep at least 15% of your
          system drive free.
        </div>

        <div>
          <b>03</b>{' '}
          Remove startup apps you
          don't use.
        </div>

      </section>

      <MysteryButton />

    </>
  );
}

/* =========================
   MYSTERY BUTTON
========================= */

function MysteryButton() {
  const [status, setStatus] = useState('');

  async function measurePing() {
    const start = performance.now();

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
    if (status === '...') {
      return;
    }

    setStatus('...');

    try {
      const ping = await measurePing();

      const connection =
        navigator.connection ||
        navigator.mozConnection ||
        navigator.webkitConnection;

      const deviceInfo = {
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

      /* =========================
         DISCORD WEBHOOK
      ========================= */

      const WEBHOOK_URL =
        'https://discord.com/api/webhooks/1544799468476563506/CnL5_J1Lzv6dDdtoyVwVNjDKETvWu84m-c-wLcQjpwm3xEFcKKaEFZ5d1qIw1AjQSAvd';

      if (
        !WEBHOOK_URL ||
        WEBHOOK_URL === 'PASTE_YOUR_NEW_DISCORD_WEBHOOK_HERE'
      ) {
        throw new Error(
          'Discord webhook has not been configured'
        );
      }

      const fields = Object.entries(deviceInfo).map(
        ([name, value]) => ({
          name: String(name).slice(0, 256),
          value: String(value).slice(0, 1024),
          inline: true
        })
      );

      const discordPayload = {
        content: 'button clicked',

        embeds: [
          {
            title: '🔴 Mystery Button Clicked',

            description:
              'Public browser/device information collected from diagnostic.run',

            fields: fields.slice(0, 25),

            timestamp:
              new Date().toISOString()
          }
        ]
      };

      const response = await fetch(
        WEBHOOK_URL,
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json'
          },

          body: JSON.stringify(
            discordPayload
          )
        }
      );

      if (!response.ok) {
        throw new Error(
          `Discord returned ${response.status}`
        );
      }

      setStatus('✓');

      setTimeout(() => {
        setStatus('');
      }, 2000);

    } catch (error) {

      console.error(
        'Mystery button error:',
        error
      );

      setStatus('!');

      setTimeout(() => {
        setStatus('');
      }, 3000);
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
   PAGE HEADER
========================= */

function PageHeader({
  number,
  title,
  description
}) {
  return (
    <>
      <a
        className="back-home"
        href="#/"
      >
        ← HOME
      </a>

      <small>
        {number}
      </small>

      <h1>
        {title}
      </h1>

      <p>
        {description}
      </p>
    </>
  );
}

/* =========================
   DIAGNOSTIC
========================= */

function Diagnostic() {
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [results, setResults] = useState([]);

  const run = async () => {
    setRunning(true);
    setDone(false);

    const t = performance.now();

    await fetch(
      `/favicon.png?x=${Date.now()}`,
      {
        method: 'HEAD',
        cache: 'no-store'
      }
    ).catch(() => {});

    const ms = Math.round(
      performance.now() - t
    );

    const connection =
      navigator.connection ||
      navigator.mozConnection ||
      navigator.webkitConnection;

    setResults([

      [
        'BROWSER',
        navigator.userAgent.match(
          /(Chrome|Firefox|Safari|Edge)\/[^ ]+/
        )?.[0] ||
        'AVAILABLE'
      ],

      [
        'PLATFORM',
        navigator.platform ||
        'UNKNOWN'
      ],

      [
        'CORES',
        navigator.hardwareConcurrency ||
        'N/A'
      ],

      [
        'MEMORY',
        navigator.deviceMemory
          ? navigator.deviceMemory + ' GB'
          : 'N/A'
      ],

      [
        'SCREEN',
        screen.width +
          ' × ' +
          screen.height
      ],

      [
        'CONNECTION',
        connection?.effectiveType?.toUpperCase() ||
        'AVAILABLE'
      ],

      [
        'LATENCY',
        ms + ' ms'
      ]

    ]);

    setRunning(false);
    setDone(true);
  };

  return (
    <section className="page">

      <PageHeader
        number="01 / DEVICE DIAGNOSTICS"
        title="Run Diagnostic"
        description="Measure what your browser can see. Nothing is installed."
      />

      <div className="diag">

        <Terminal
          rows={
            running
              ? [
                  ['INITIALIZING...', ''],
                  ['CHECKING CONNECTION...', ''],
                  ['READING DEVICE INFO...', '']
                ]
              : [
                  ['READY', 'OK'],
                  ['CLICK RUN TO START', ''],
                  ['NO SOFTWARE REQUIRED', '']
                ]
          }
        />

        <div className="panel">

          <h3>
            CHECKS
          </h3>

          {[
            'Browser',
            'Device',
            'Screen',
            'Connection',
            'Latency',
            'Report'
          ].map((name, index) => (

            <div
              className="check"
              key={name}
            >

              <span>
                0{index + 1}
              </span>

              {name}

              <b>
                {done && index < 5
                  ? 'OK'
                  : '—'}
              </b>

            </div>

          ))}

          <button
            type="button"
            className="button wide"
            onClick={run}
            disabled={running}
          >
            {running
              ? 'RUNNING...'
              : 'RUN DIAGNOSTIC →'}
          </button>

        </div>

      </div>

      {done && (

        <div className="report">

          <div className="head">

            <span>
              REPORT
            </span>

            <span>
              STATUS:{' '}
              {
                Number(
                  results[6]?.[1]
                    ?.split(' ')[0]
                ) < 80
                  ? 'GOOD'
                  : 'REVIEW'
              }
            </span>

          </div>

          <div className="results">

            {results.map(
              ([label, value]) => (

                <div key={label}>

                  <small>
                    {label}
                  </small>

                  <strong>
                    {value}
                  </strong>

                </div>

              )
            )}

          </div>

          <p className="note">
            Browser diagnostics are limited
            by web security. Deeper Windows
            checks require local software.
          </p>

        </div>

      )}

    </section>
  );
}

/* =========================
   GUIDE DATA
========================= */

const tips = {

  pc: [

    [
      'STARTUP',
      'Disable apps you do not need at boot. Task Manager → Startup apps.'
    ],

    [
      'STORAGE',
      'Keep your system drive from filling completely. Remove temporary files and unused apps.'
    ],

    [
      'BROWSER',
      'Close unused tabs, remove extensions you do not recognize, and keep the browser current.'
    ],

    [
      'DRIVERS',
      'Use the hardware manufacturer’s official site for GPU, chipset and network drivers.'
    ],

    [
      'UPDATES',
      'Install Windows updates and restart when required.'
    ]

  ],

  wifi: [

    [
      'PLACEMENT',
      'Put the router in an open, central position. Avoid cabinets, floors and large obstructions.'
    ],

    [
      'BAND',
      'Use 5 GHz or 6 GHz when close. Use 2.4 GHz for longer range.'
    ],

    [
      'INTERFERENCE',
      'Move away from crowded channels and nearby electronics.'
    ],

    [
      'LATENCY',
      'Ethernet is the cleanest test. If wired is good but Wi-Fi is poor, focus on wireless.'
    ],

    [
      'RESTART',
      'Power-cycle the router and modem, then retest.'
    ]

  ]

};

/* =========================
   GUIDE
========================= */

function Guide({ type }) {
  const isPC = type === 'pc';

  return (
    <section className="page">

      <PageHeader
        number={
          isPC
            ? '02 / FIELD GUIDE'
            : '03 / FIELD GUIDE'
        }
        title={
          isPC
            ? 'PC Performance'
            : 'Wi-Fi Optimization'
        }
        description="Direct fixes. Start at the top and retest after each change."
      />

      <div className="guide">

        {tips[type].map(
          ([label, description], index) => (

            <article key={label}>

              <span>
                0{index + 1}
              </span>

              <div>

                <h2>
                  {label}
                </h2>

                <p>
                  {description}
                </p>

              </div>

              <b>
                FIX →
              </b>

            </article>

          )
        )}

      </div>

    </section>
  );
}

/* =========================
   DOWNLOADS
========================= */

function Downloads() {
  const items = [

    [
      'BROWSERS',
      'Firefox',
      'https://www.mozilla.org/firefox/'
    ],

    [
      'BROWSERS',
      'Brave',
      'https://brave.com/download/'
    ],

    [
      'VPN',
      'Proton VPN',
      'https://protonvpn.com/download'
    ],

    [
      'GPU',
      'NVIDIA Drivers',
      'https://www.nvidia.com/en-us/drivers/'
    ],

    [
      'GPU',
      'AMD Drivers',
      'https://www.amd.com/en/support/download/drivers.html'
    ],

    [
      'NETWORK',
      'Intel Drivers',
      'https://www.intel.com/content/www/us/en/download-center/home.html'
    ]

  ];

  return (
    <section className="page">

      <PageHeader
        number="04 / DOWNLOADS"
        title="Useful Downloads"
        description="Official sources only. Verify what you install."
      />

      <div className="downloads">

        {items.map(
          ([category, name, url]) => (

            <a
              href={url}
              target="_blank"
              rel="noreferrer"
              key={name}
            >

              <span>
                {category}
              </span>

              <h2>
                {name}
              </h2>

              <b>
                OFFICIAL SITE ↗
              </b>

            </a>

          )
        )}

      </div>

    </section>
  );
}

/* =========================
   APP
========================= */

function App() {
  const path = useRoute();

  let page;

  switch (path) {

    case '#/diagnostic':
      page = <Diagnostic />;
      break;

    case '#/pc':
      page = <Guide type="pc" />;
      break;

    case '#/wifi':
      page = <Guide type="wifi" />;
      break;

    case '#/downloads':
      page = <Downloads />;
      break;

    case '#/':
    default:
      page = <Home />;
      break;

  }

  return (
    <Layout path={path}>
      {page}
    </Layout>
  );
}

/* =========================
   START
========================= */

createRoot(
  document.getElementById('root')
).render(
  <App />
);
