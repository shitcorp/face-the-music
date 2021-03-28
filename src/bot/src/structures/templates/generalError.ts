import Embed from '../Embed';

export default (message: string): Embed =>
  new Embed()
    .setTitle('Error')
    .setDescription(message)
    .setColor(0xcc0000)
    .setTimestamp();
