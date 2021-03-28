import Embed from '../Embed';

export default (message: string): Embed =>
  new Embed()
    .setTitle('Success')
    .setDescription(message)
    .setColor(0x32cd32)
    .setTimestamp();
