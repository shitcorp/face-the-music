import { AdvancedMessageContent } from 'eris';
import { Embed } from '../structures';

/**
 * Takes embed and converts it to the AdvancedMessageContent format
 * @param embed
 */
export default (embed: Embed): AdvancedMessageContent => ({
  embed: {
    ...embed.toJSON(),
  },
});
