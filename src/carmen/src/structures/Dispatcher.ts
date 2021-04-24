import Registry from './Registry';

export default class {
  /**
   * Regitry of all commands and their groups
   */
  readonly registry: Registry;

  constructor() {
    this.registry = new Registry();
  }
}
