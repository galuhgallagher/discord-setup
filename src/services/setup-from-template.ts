import { Guild, ChannelType } from "discord.js";
import { loadTemplate } from "../utils/load-template";

export async function setupFromTemplate(guild: Guild, templateName: string) {
  const template = loadTemplate(templateName);

  for (const categoryData of template.categories) {
    const category = await guild.channels.create({
      name: categoryData.name,
      type: ChannelType.GuildCategory,
    });

    for (const channel of categoryData.channels) {
      await guild.channels.create({
        name: channel.name,
        type:
          channel.type === "voice"
            ? ChannelType.GuildVoice
            : ChannelType.GuildText,
        parent: category.id,
      });
    }
  }
}
