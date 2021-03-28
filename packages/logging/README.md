# @face-the-music/logging

> Logging util for face the music

## Info:

- auto creates log files
- allows for preconfiured output of logs to sentry and elastic

## Example:

```js
import logger from '@face-the-music/logging';

logger.info('hello');

// tell logger to start logging to console
logger.useConsole();
// tell logger to start using sentry
logger.useSentry(/* pass all sentry options here*/);
// tell logger to start using elastic
logger.useElastic(/* pass all elastic options here*/);

try {
  // stuff
} catch (error) {
  // sends error to all appropriate locations
  logger.handleException(error);
  // can also use #handleWarning(warning) variant for all warnings
}
```
