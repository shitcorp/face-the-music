import Collection from '@discordjs/collection';
import { Command } from '.';
import Module from './Module';

export default class {
  /**
   * A collection of registered modules
   */
  readonly modules = new Collection<string, Module>();

  /**
   * A collection of registered commands
   */
  readonly commands = new Collection<string, Command>();

  // constructor() {
  //   // this.modules = new Collection();
  //   // this.commands = new Collection();
  // }

  /**
   * Registers a module
   * @param moduleName
   */
  registerModule(module: Module | RegisterModuleObject) {
    if (module instanceof Module) {
      this.modules.set(module.id, module);
    } else {
      const moduleClass = new Module(
        module.name,
        module.id,
      );

      this.modules.set(moduleClass.id, moduleClass);
    }
  }

  /**
   * Register modules
   * @param modules
   * @example
   * #registerModules([
   * {id: 'mod', name: 'moderation'},
   * {id: 'info', name: 'information'}
   * ])
   */
  registerModules(
    modules: Array<Module | RegisterModuleObject>,
  ) {
    modules.forEach((module) => {
      this.registerModule(module);
    });
  }
}
