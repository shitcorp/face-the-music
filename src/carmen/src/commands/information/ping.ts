import { Message } from 'eris';
import { logger } from '@face-the-music/logging';
import i18next from 'i18next';
import { Command, Embed, success } from '../../structures';
import { CommandObjects } from '../../@types/command';
import { formatMessage } from '../../utils';

export default class extends Command {
  constructor(commandObjects: CommandObjects) {
    super(commandObjects, {
      name: 'ping',
      description: 'Sends basic latency info.',
      module: 'information',
      aliases: [],
      disabled: false,
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async execute(message: Message, _args: string[]) {
    const pingEmbed = new Embed().setTitle(
      i18next.t('information:ping.ping'),
    );

    const m = await this.sendMessage(
      message.channel.id,
      pingEmbed,
    );

    if (m instanceof Message) {
      // try and get shard
      const shard = this.bot.shards.get(this.workerID - 1);

      // if shard is undefined, return
      if (shard === undefined) return;

      await m
        .edit(
          formatMessage(
            success(
              i18next.t('information:info.title', {
                roundTrip: m.createdAt - message.createdAt,
                api: Math.round(shard.latency),
              }),
            ),
          ),
        )
        .catch((err) => {
          logger.error(err);
        });
    }
  }
}
