import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import * as Sentry from '@sentry/node';
import SentryWinston from 'winston-transport-sentry-node';
import {
  ElasticsearchTransport,
  ElasticsearchTransportOptions,
} from 'winston-elasticsearch';
import { inspect } from 'util';

/**
 * Logging util for face the music
 */
export default class Logger {
  /**
   * Logging object for winston
   */
  private logger: winston.Logger;

  /**
   * Console transport instance
   */
  private console?: winston.transports.ConsoleTransportInstance;

  /**
   * Sentry transport instance
   */
  private sentry?: SentryWinston;

  /**
   * Elasticsearch transport instance
   */
  private elastic?: ElasticsearchTransport;

  /**
   * Creates the logging util for face the music
   */
  constructor() {
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

    // create logging object
    this.logger = winston.createLogger({
      exitOnError: false,
      transports: [dailyRotateFile, dailyRotatErrorFile],
      format: winston.format.printf(
        (log) =>
          `[${log.level.toUpperCase()}] - ${log.message}`,
      ),
    });

    //
  }

  /**
   * Adds console transport for logging
   */
  useConsole() {
    // initalize transport
    this.console = new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple(),
      ),
      level: 'debug',
    });

    // add console transport
    this.logger.add(this.console);

    // log
    this.logger.debug('added console transport');
  }

  /**
   * Adds Sentry transport for logging
   * @param sentryOptions
   */
  useSentry(sentryOptions: Sentry.NodeOptions) {
    // initalize transport
    this.sentry = new SentryWinston({
      sentry: sentryOptions,
      level: 'info',
    });

    // add sentry transport
    this.logger.add(this.sentry);

    // log
    this.logger.debug('added sentry transport');
  }

  /**
   * Adds Elasticsearch transport for logging
   * @param elasticOptions
   */
  useElastic(
    elasticOptions: ElasticsearchTransportOptions,
  ) {
    // initalize transport
    this.elastic = new ElasticsearchTransport(
      elasticOptions,
    );

    // add elastic transport
    this.logger.add(this.elastic);

    // log
    this.logger.debug('added elasticsearch transport');
  }

  /**
   *
   * @param message
   * @returns this
   */
  emerg(message: string) {
    // emergancy
    this.logger.emerg(message);
    return this;
  }

  /**
   *
   * @param message
   * @returns this
   */
  alert(message: string) {
    // alert
    this.logger.alert(message);
    return this;
  }

  /**
   *
   * @param message
   * @returns this
   */
  crit(message: string) {
    // critical
    this.logger.crit(message);
    return this;
  }

  /**
   *
   * @param message
   * @returns this
   */
  error(message: string) {
    // error
    this.logger.error(message);
    return this;
  }

  /**
   *
   * @param message
   * @returns this
   */
  warning(message: string) {
    // warning
    this.logger.warning(message);
    return this;
  }

  /**
   *
   * @param message
   * @returns this
   */
  notice(message: string) {
    // notice
    this.logger.notice(message);
    return this;
  }

  /**
   *
   * @param message
   * @returns this
   */
  info(message: string) {
    // info
    this.logger.info(message);
    return this;
  }

  /**
   *
   * @param message
   * @returns this
   */
  debug(message: string) {
    // debug
    this.logger.debug(message);
    return this;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleException(exception: any) {
    // capture expection
    Sentry.captureException(exception);
    // inspect and log exception
    this.logger.error(
      inspect(exception, false, null, true),
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  handleWarning(warning: any) {
    // capture expection
    Sentry.captureException(warning);
    // inspect and log exception
    this.logger.warning(
      inspect(warning, false, null, true),
    );
  }
}
