import { Message } from 'eris';
import i18next from 'i18next';
import { Command, Embed } from '../../structures';
import { CommandObjects } from '../../@types/command';

export default class extends Command {
  constructor(commandObjects: CommandObjects) {
    super(commandObjects, {
      name: 'help',
      description: 'A generic help command.',
      module: 'information',
      aliases: [],
      disabled: false,
    });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  public async execute(message: Message, _args: string[]) {
    await this.startTyping(message.channel.id);

    const prefix = process.env.PREFIX;

    const helpEmbed = new Embed()
      .setTitle(i18next.t('name'))
      .setDescription(i18next.t('description'))
      .addField(
        i18next.t('information:help.prefix.name'),
        String(
          i18next.t('information:help.prefix.value', {
            prefix,
          }),
        ),
      )
      .addField(
        i18next.t('information:help.commands.name'),
        String(
          i18next.t('information:help.commands.value'),
        ),
      )
      .addField(
        i18next.t('information:help.invite.name'),
        String(i18next.t('information:help.invite.value')),
      )
      .addField(
        i18next.t('information:help.support.name'),
        String(i18next.t('information:help.support.value')),
      )
      .setTimestamp();

    await this.sendMessage(message.channel.id, helpEmbed);
  }
}
