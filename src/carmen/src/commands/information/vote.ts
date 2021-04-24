import { Message } from 'eris';
import i18next from 'i18next';
import { Command, Embed } from '../../structures';
import { CommandObjects } from '../../@types/command';

export default class extends Command {
  constructor(commandObjects: CommandObjects) {
    super(commandObjects, {
      name: 'vote',
      description: 'Get the link to vote for the bot.',
      module: 'info',
      aliases: [],
      disabled: true,
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async execute(message: Message, _args: string[]) {
    await this.startTyping(message.channel.id);

    const voteEmbed = new Embed()
      .setTitle(i18next.t('information:vote.title'))
      .setDescription(
        i18next.t('information:vote.description'),
      )
      .setTimestamp();

    await this.sendMessage(message.channel.id, voteEmbed);
  }
}
