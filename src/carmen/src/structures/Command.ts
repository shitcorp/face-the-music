import {
  AdvancedMessageContent,
  Message,
  Permission,
} from 'eris';
import { logger } from '@face-the-music/logging';
import Embed from './Embed';
import {
  CommandChannelPermsArray,
  CommandObjects,
  CommandOptions,
  CommandPerms,
} from '../@types/command';
import { sendMessage as sendMessageUtil } from '../utils';

/**
 * Represents a command
 */
export default class Command
  implements CommandOptions, CommandObjects, CommandPerms {
  readonly bot;

  readonly ipc;

  readonly workerID;

  readonly clusterID;

  readonly name;

  readonly description;

  readonly module;

  readonly aliases?;

  readonly args?;

  readonly usage?;

  readonly disabled?;

  readonly cooldown?;

  readonly securityClearance?;

  readonly channelPermissions: CommandChannelPermsArray;

  readonly userPermissions: string[];

  readonly guildPermissions: string[];

  /**
   * Creates a command
   * @constructor
   * @param commandObjects
   * @param options
   */
  constructor(
    commandObjects: CommandObjects,
    options: CommandOptions,
  ) {
    // save core items for command
    this.bot = commandObjects.bot;
    this.ipc = commandObjects.ipc;
    this.workerID = commandObjects.workerID;
    this.clusterID = commandObjects.clusterID;

    this.name = options.name;
    this.description = options.description;
    this.module = options.module;
    this.aliases = options.aliases;
    this.args = options.args;
    this.usage = options.usage;
    this.disabled = options.disabled;
    this.cooldown = options.cooldown;
    this.securityClearance = options.securityClearance
      ? options.securityClearance
      : undefined;

    this.channelPermissions = options.perms
      ?.channelPermissions
      ? options.perms.channelPermissions
      : ['sendMessages', 'embedLinks'];
    this.userPermissions = options.perms?.userPermissions
      ? options.perms.userPermissions
      : [];
    this.guildPermissions = options.perms?.guildPermissions
      ? options.perms.guildPermissions
      : [];
  }

  /**
   * Executes a given command
   * @param _message
   * @param _args
   */
  // not using abstract here for reasons I forget
  // eslint-disable-next-line class-methods-use-this
  async execute(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _message: Message,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    _args: string[],
    // eslint-disable-next-line @typescript-eslint/no-empty-function
  ): Promise<void> {}

  /**
   * Checks whether or not the bot has the required channel perms
   * @param permissions eris permissions object
   */
  checkChannelPermissions(
    permissions: Permission,
  ): boolean | string[] {
    const perms: string[] = [];

    // loop through all channel perms
    this.channelPermissions.forEach((perm) => {
      // if doesn't have the permission
      if (!permissions.has(perm)) perms.push(perm);
    });

    if (perms.length > 0) {
      return perms;
    }
    return true;
  }

  /**
   * Checks whether or not the bot has the required user perms
   * @param permissions eris permissions object
   */
  checkUserPermissions(permissions: Permission) {
    const perms: string[] = [];

    // loop through all channel perms
    this.userPermissions.forEach((perm) => {
      // if doesn't have the permission
      if (!permissions.has(perm)) perms.push(perm);
    });

    if (perms.length > 0) {
      return perms;
    }
    return true;
  }

  /**
   * Checks whether or not the bot has the required guild perms
   * @param permissions eris permissions object
   */
  checkGuildPermissions(permissions: Permission) {
    const perms: string[] = [];

    // loop through all channel perms
    this.guildPermissions.forEach((perm) => {
      // if doesn't have the permission
      if (!permissions.has(perm)) perms.push(perm);
    });

    if (perms.length > 0) {
      return perms;
    }
    return true;
  }

  /**
   * Handles message sending
   * @param channelID
   * @param message
   */
  async sendMessage(
    channelID: string,
    message: string | Embed | AdvancedMessageContent,
  ): Promise<Message | void> {
    return sendMessageUtil(this.bot, channelID, message);
  }

  /**
   * Starts the typing status in specified channel
   * @param channelID
   */
  async startTyping(channelID: string) {
    await this.bot
      .sendChannelTyping(channelID)
      .catch((err) => {
        logger.error(err);
      });
  }
}
