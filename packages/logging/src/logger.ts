import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import * as Sentry from '@sentry/node';
import SentryWinston from 'winston-transport-sentry-node';
import {
  ElasticsearchTransport,
  ElasticsearchTransportOptions,
} from 'winston-elasticsearch';
import { inspect } from 'util';

// daily roate file
const dailyRotateFile = new DailyRotateFile({
  filename: './logs/%DATE%.log',
  datePattern: 'YYYY-MM-DD-HH',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '5d',
});

// daily rotate file for errors
const dailyRotatErrorFile = new DailyRotateFile({
  filename: './logs/%DATE%-Error.log',
  datePattern: 'YYYY-MM-DD-HH',
  zippedArchive: true,
  maxSize: '20m',
  maxFiles: '14d',
  level: 'error',
});

/**
 * Logging object for winston
 */
export const logger = winston.createLogger({
  exitOnError: false,
  transports: [dailyRotateFile, dailyRotatErrorFile],
  format: winston.format.printf(
    (log) =>
      `[${log.level.toUpperCase()}] - ${log.message}`,
  ),
});
export default logger;

/**
 * Adds console transport for logging
 */
export const useConsole = () => {
  // initalize transport
  const console = new winston.transports.Console({
    format: winston.format.combine(
      winston.format.colorize(),
      winston.format.simple(),
    ),
    level: 'debug',
  });

  // add console transport
  logger.add(console);

  // log
  logger.debug('added console transport');
};

/**
 * Adds Sentry transport for logging
 * @param sentryOptions
 */
export const useSentry = (
  sentryOptions: Sentry.NodeOptions,
) => {
  // initalize transport
  const sentry = new SentryWinston({
    sentry: sentryOptions,
    level: 'info',
  });

  // add sentry transport
  logger.add(sentry);

  // log
  logger.debug('added sentry transport');
};

/**
 * Adds Elasticsearch transport for logging
 * @param elasticOptions
 */
export const useElastic = (
  elasticOptions: ElasticsearchTransportOptions,
) => {
  // initalize transport
  const elastic = new ElasticsearchTransport(
    elasticOptions,
  );

  // add elastic transport
  logger.add(elastic);

  // log
  logger.debug('added elasticsearch transport');
};

/**
 * Inspects, reports and logs of an error
 * @param exception
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const handleException = (exception: any) => {
  // capture expection
  Sentry.captureException(exception);
  // inspect and log exception
  logger.error(inspect(exception, false, null, true));
};

/**
 * Inspects, reports and logs of an warning
 * @param warning
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const handleWarning = (warning: any) => {
  // capture expection
  Sentry.captureException(warning);
  // inspect and log exception
  logger.warning(inspect(warning, false, null, true));
};
