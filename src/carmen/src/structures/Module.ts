export default class {
  /**
   * Name of the module
   */
  readonly name: string;

  /**
   * Id of the module
   */
  readonly id: string;

  constructor(name: string, id: string) {
    this.name = name;
    this.id = id;
  }
}
