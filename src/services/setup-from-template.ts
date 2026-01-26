import {
  Guild,
  ChannelType,
  TextChannel,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
} from "discord.js";
import {
  loadMessageTemplate,
  loadServerTemplate,
} from "../utils/load-template";

export async function setupServerTemplate(guild: Guild, templateName: string) {
  const template = loadServerTemplate(templateName);

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

export async function setupMessageTemplate(
  channel: TextChannel,
  templateName: string,
) {
  const template = loadMessageTemplate(templateName);

  const embed = new EmbedBuilder()
    .setTitle(template.title)
    .setDescription(template.description)
    .setColor(template.color || 0x0099ff);

  if (template.footer) {
    embed.setFooter({ text: template.footer });
  }

  await channel.send({
    embeds: [embed],
  });

  return JSON.stringify(template, null, 2);
}
