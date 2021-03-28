import {
  AdvancedMessageContent,
  Client,
  Message,
} from 'eris';
import { logger } from '@face-the-music/logging';
import { Embed } from '../structures';
import formatMessage from './formatMessage';

/**
 * Handles message sending
 * @param bot
 * @param channelID
 * @param message
 */
export default async (
  bot: Client,
  channelID: string,
  message: string | Embed | AdvancedMessageContent,
): Promise<Message | void> => {
  // if embed
  if (message instanceof Embed) {
    // return embed as json for Eris to handle
    return bot
      .createMessage(channelID, formatMessage(message))
      .catch((err) => {
        logger.error(err);
      });
  }
  return await bot
    .createMessage(channelID, message)
    .catch((err) => {
      logger.error(err);
    });
};
