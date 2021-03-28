import Redis from 'ioredis';
import { logger } from '@face-the-music/logging';
import hasNumber from './hasNumber';

const redis = new Redis({ keyPrefix: 'user:' });

/**
 * Checks if user has proper security clearance
 * @param userID
 * @param requiredClearanceLevel
 */
export default async (
  userID: string,
  requiredClearanceLevel: number,
): Promise<boolean> => {
  const response = await redis
    .get(userID)
    .catch((err: any) => {
      logger.error(err);
    });

  if (typeof response === 'string' && hasNumber(response)) {
    // eslint-disable-next-line radix
    const userClearanceLevel = parseInt(response);

    // if clearance level is greater than or equal to required level, return true
    if (userClearanceLevel >= requiredClearanceLevel)
      return true;
  }

  return false;
};
