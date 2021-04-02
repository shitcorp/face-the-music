import { Message } from 'eris';
import i18next from 'i18next';
import { Command, Embed } from '../../structures';
import { CommandObjects } from '../../@types/command';

export default class extends Command {
  constructor(commandObjects: CommandObjects) {
    super(commandObjects, {
      name: 'support',
      description:
        'Get the link to the support & feedback server for the bot.',
      module: 'information',
      aliases: ['feedback'],
      disabled: false,
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async execute(message: Message, _args: string[]) {
    await this.startTyping(message.channel.id);

    const supportEmbed = new Embed()
      .setTitle(i18next.t('information:support.title'))
      .setDescription(
        i18next.t('information:support.description'),
      )
      .setTimestamp();

    await this.sendMessage(
      message.channel.id,
      supportEmbed,
    );
  }
}
