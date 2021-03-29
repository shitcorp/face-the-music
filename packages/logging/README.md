# @face-the-music/logging

> Logging util for face the music

## Info:

- auto creates log files
- allows for preconfiured output of logs to sentry and elastic

## Example:

```js
// example imports
import {
  logger,
  useConsole,
  useSentry,
  useElastic,
  handleException,
} from '@face-the-music/logging';
// OR
import * as Logging from '@face-the-music/logging';
// then do Logging.logger

logger.info('hello');

// tell logger to start logging to console
useConsole();
// tell logger to start using sentry
useSentry(/* pass all sentry options here*/);
// tell logger to start using elastic
useElastic(/* pass all elastic options here*/);

try {
  // stuff
} catch (error) {
  // sends error to all appropriate locations
  handleException(error);
  // can also use handleWarning(warning) variant for all warnings
}
```
