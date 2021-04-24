import { Message } from 'eris';
import Redis from 'ioredis';
import i18next from 'i18next';
import { logger } from '@face-the-music/logging';
import { Command, Embed } from '../../structures';
import { CommandObjects } from '../../@types/command';

export default class extends Command {
  readonly redis = new Redis(process.env.REDIS);

  constructor(commandObjects: CommandObjects) {
    super(commandObjects, {
      name: 'info',
      description: 'Get basic bot information.',
      module: 'info',
      aliases: ['information', 'stats'],
      disabled: false,
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async execute(message: Message, _args: string[]) {
    await this.startTyping(message.channel.id);

    // const stats = await this.ipc.getStats();

    const statsEmbed = new Embed()
      .setTitle(i18next.t('information:info.title'))
      .addField(
        i18next.t('information:info.version'),
        process.env.npm_package_version,
        true,
      )
      .addField(
        i18next.t('information:info.cluster'),
        this.clusterID,
        true,
      )
      .addField(
        i18next.t('information:info.worker'),
        this.workerID,
        true,
      )
      .setTimestamp();

    this.redis
      .multi()
      .get('shardCount')
      .get('guilds')
      .get('users')
      // .get('totalRam')
      // .get('clustersRam')
      // .get('servicesRam')
      .exec()
      .then(async (responses) => {
        //  need to add proper error handling in future

        statsEmbed
          .addField(
            i18next.t('information:info.shard'),
            responses[0][1],
            true,
          )
          .addField(
            i18next.t('information:info.server'),
            responses[1][1],
            true,
          )
          .addField(
            i18next.t('information:info.user'),
            responses[2][1],
            true,
          );
        // .addField(
        //   'Total Ram:',
        //   `${Math.round(responses[3][1])} MB`,
        //   true,
        // )
        // .addField(
        //   'Clusters Ram:',
        //   `${Math.round(responses[4][1])} MB`,
        //   true,
        // )
        // .addField(
        //   'Services Ram:',
        //   `${Math.round(responses[5][1])} MB`,
        //   true,
        // );

        // try and get shard
        const shard = this.bot.shards.get(
          this.workerID - 1,
        );
        // if shard isn't undefined, add api latency
        if (shard !== undefined)
          statsEmbed.addField(
            'API Latency',
            Math.round(shard.latency),
            true,
          );

        await this.sendMessage(
          message.channel.id,
          statsEmbed,
        );
      })
      .catch((err) => {
        // handleException(err);
        logger.error(err);
      });

    // statsEmbed
    //   .addField('Shard Count:', stats.shardCount, true)
    //   .addField('Server Count:', stats.guilds, true)
    //   .addField('User Count:', stats.users, true)
    //   .addField(
    //     'Total Ram:',
    //     `${Math.round(stats.totalRam)} MB`,
    //     true,
    //   )
    //   .addField(
    //     'Clusters Ram:',
    //     `${Math.round(stats.clustersRam)} MB`,
    //     true,
    //   )
    //   .addField(
    //     'Services Ram:',
    //     `${Math.round(stats.servicesRam)} MB`,
    //     true,
    //   )
  }
}
