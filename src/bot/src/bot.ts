import { BaseClusterWorker } from 'eris-fleet';
import { Message } from 'eris';
import * as Sentry from '@sentry/node';
import { Setup } from 'eris-fleet/dist/clusters/BaseClusterWorker';
import { readdirSync } from 'fs';
import { join } from 'path';
import { inspect } from 'util';
import Collection from '@discordjs/collection';
import Logger from "@face-the-music/logging"

const logger = new Logger();

export default class JanusWorker extends BaseClusterWorker {
  Commands = new Collection<string, Command>();

  constructor(setup: Setup) {
    // Worker Cluster.

    // Do not delete this super.
    super(setup);

    /**
     * Set sentry tags
     */
    // set worker id
    Sentry.setTag('workerID', this.workerID);
    // set cluster id
    Sentry.setTag('clusterID', this.clusterID);

    //  launch bot
    this.launch();
  }

  /**
   * Launches the necessary services for the bot
   */
  launch(): void {
    // await this.loadcmds();

    this.bot.on('messageCreate', (message) => {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      this.handleMessage(message);
    });
  }

  /**
   * Handles inbound messages
   * @param {Message} msg
   */
  async handleMessage(msg: Message): Promise<void> {
    if (msg.content === 'hello world') {
      await this.bot.createMessage(
        msg.channel.id,
        'hello world',
      );
    }
  }

  /**
   * Loads/reloads all commands
   */
  async loadcmds() {
    // loads the commands

    // loading cmds breadcrumb
    Sentry.addBreadcrumb({
      category: 'loadingCMDs',
      message: 'Loading Commands',
      level: Sentry.Severity.Info,
    });

    const folders = await readdirSync(
      join(__dirname, '/commands/'),
    );

    logger.debug(`Modules: ${inspect(folders)}`);

    for (const folder of folders) {
      const loadModule = Sentry.startTransaction({
        name: 'Load Module',
        op: 'loadModule',
        data: {
          folder,
        },
      });

      // get every command in module folder
      const commands = readdirSync(
        `./dist/commands/${folder}`,
      ).filter((file) => file.endsWith('.js'));

      logger.debug(`Commands: ${inspect(commands)}`);

      for (const file of commands) {
        const loadCommand = Sentry.startTransaction({
          name: 'Load Command',
          op: 'loadCMD',
          data: {
            file,
          },
        });

        try {
          const commandObjects: CommandObjects = {
            bot: this.bot,
            ipc: this.ipc,
            workerID: this.workerID,
            clusterID: this.clusterID,
          };

          // import is technically the type 'CommandImport', but is negated through #default
          const command: Command = new (
            await import(`./commands/${folder}/${file}`)
          ).default(commandObjects);

          // logger.debug(
          //   inspect(
          //     (await import(`./commands/${folder}/${file}`))
          //       .default,
          //     false,
          //     6,
          //     true,
          //   ),
          // );

          // log cmd object
          // logger.debug(
          //   `Command: ${inspect(command, false, 2, true)}`,
          // );

          // if command isn't disabled
          if (!command.disabled) {
            // register command
            this.Commands.set(command.name, command);

            // log cmd was loaded
            logger.debug(
              `Loaded the command ${command.name} from module ${folder}`,
            );
          }
        } catch (error) {
          logger.handleException(error);
        } finally {
          // finish cmd load transaction
          loadCommand.finish();
        }
      }

      // finish module load transaction
      loadModule.finish();
  }
}
