import {
  logger,
  useSentry,
  i18nextLogger,
  useConsole,
} from '@face-the-music/logging';
import { isMaster } from 'cluster';
import { Fleet } from 'eris-fleet';
import { join, resolve } from 'path';
import * as Sentry from '@sentry/node';
import { platform, version, release } from 'os';
import i18next from 'i18next';
import HttpApi from 'i18next-http-backend';
import { config } from 'dotenv';
import Redis from 'ioredis';

// check if node version is below 14
if (Number(process.version.slice(1).split('.')[0]) < 14) {
  logger.error(
    'Node 14.0.0 or higher is required. Please upgrade Node.js on your computer / server.',
  );
  process.exit(1);
}

if (process.env.NODE_ENV !== 'production') {
  useConsole();

  const path = resolve(process.cwd(), '../..', 'bot.env');
  logger.debug(path);

  config({
    path,
  });
}

useSentry({
  // dsn: DSN,
  dsn: undefined,
  release: `janus-bot@${process.env.npm_package_version}`,
  environment: process.env.NODE_ENV || 'dev',
  maxBreadcrumbs: 100,
  serverName: process.env.SERVERNAME || 'dev',

  beforeSend(event) {
    // if user
    if (event.user) {
      // scrub any possible sensitive data

      // don't send email address
      // eslint-disable-next-line no-param-reassign
      delete event.user.email;
      // don't send username
      // eslint-disable-next-line no-param-reassign
      delete event.user.username;
      // don't send ip address
      // eslint-disable-next-line no-param-reassign
      delete event.user.ip_address;
    }
    return event;
  },

  tracesSampler: (samplingContext) => {
    switch (samplingContext.transactionContext.op) {
      case 'loadCMD':
        return 0.2;
      case 'loadModule':
        return 0.3;
      case 'cacheStats':
        return 0.4;
      case 'command':
        return 0.1;
      case 'reloadCMD':
        return 0.8;
      case 'shutdown':
        return 1;
      default:
        return 0.5;
    }
  },
});

// set sentry tags
Sentry.setTag('platform', platform());
Sentry.setTag('os.name', version());
Sentry.setTag('os', `${version()} ${release()}`);
Sentry.setTag('node', process.version);

const redis = new Redis(process.env.REDIS);

// docs: https://github.com/i18next/i18next-http-backend
i18next
  .use(i18nextLogger)
  .use(HttpApi)
  .init({
    lng: 'en',
    fallbackLng: 'en',
    preload: ['en'],
    ns: ['error', 'common', 'information'],
    defaultNS: 'common',
    saveMissing: true,
    missingKeyHandler: (lng, ns, key, fallbackvalue) => {
      logger.alert(`The key '${key}' is missing`, {
        key,
        language: lng,
        namespace: ns,
        fallbackvalue,
      });
    },
    backend: {
      // path where resources get loaded from, or a function
      // returning a path:
      // function(lngs, namespaces) { return customPath; }
      // the returned path will interpolate lng, ns if provided like giving a static path
      loadPath: `${process.env.API}/locales/{{lng}}/{{ns}}.json`,

      // path to post missing resources
      addPath: `${process.env.API}/locales/{{lng}}/{{ns}}.missing.json`,

      reloadInterval: false,
    },
    debug: process.env.NODE_ENV === 'production',
  });

const Admiral = new Fleet({
  path: join(__dirname, './bot.js'),
  token: process.env.DISCORD_TOKEN,
  lessLogging: process.env.NODE_ENV === 'production',
  serviceTimeout: 6000,
  clientOptions: {
    allowedMentions: {
      everyone: false,
    },
  },
  startingStatus: {
    status: 'online',
    game: {
      name: '*help | ',
      type: 0,
    },
  },
  // services: [
  //   {
  //     name: 'HandleMessage',
  //     path: join(__dirname, './services/HandleMessage.js'),
  //   },
  // ],
});

if (isMaster) {
  // standard logs
  Admiral.on('log', (m) => logger.info(m));
  // debug info
  // Admiral.on('debug', (m) => logger.debug(m));
  // warnings
  Admiral.on('warn', (m) => {
    // logger.handleWarning(m);
    logger.warn(m);
  });
  // errors
  Admiral.on('error', (m) => {
    // logger.handleException(m);
    logger.error(m);
  });

  // Logs stats when they arrive
  Admiral.on('stats', (m) => {
    // logger.debug(m);
    const pipeline = redis.pipeline();

    // set values
    pipeline
      .set('guilds', m.guilds)
      .set('users', m.users)
      .set('clustersRam', m.clustersRam)
      .set('servicesRam', m.servicesRam)
      .set('masterRam', m.masterRam)
      .set('totalRam', m.totalRam)
      .set('voice', m.voice)
      .set('largeGuilds', m.largeGuilds)
      .set('shardCount', m.shardCount)
      .set('clusters', m.clusters)
      .set('services', m.services);

    // execute pipeline
    pipeline.exec().catch((err) => {
      logger.error(err);
    });
  });
}

// Capture unhandledRejections
process.on('unhandledRejection', (error: Error) => {
  // If not a permission denied discord api error
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  if (error.code !== 50013) {
    // logger.handleException(error);
    logger.error(error);
  }
  // logger.error(error);
});

// Capture uncaughtExceptionMonitors
process.on(
  'uncaughtExceptionMonitor',
  (error: Error, origin: string) => {
    // logger.handleException(error);
    logger.error(error);
    logger.error(`Exception origin: ${origin}`);
  },
);

// Capture warnings
process.on('warning', (warning: Error) => {
  // logger.handleWarning(warning);
  logger.warn(warning);
});

// Close event sent
// need to remove this disable later
// eslint-disable-next-line @typescript-eslint/no-misused-promises
process.on('SIGTERM', async () => {
  logger.info('SIGTERM signal received.');

  // close Sentry connection
  await Sentry.close(4000);

  // exit
  process.exit(0);
});
