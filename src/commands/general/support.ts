import {
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  Colors,
  ChatInputCommandInteraction,
  SlashCommandBuilder,
} from "discord.js";
import { SlashCommand } from "../../types";

const command: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName("support")
    .setDescription("Support the development of this bot!"),

  execute: async (interaction: ChatInputCommandInteraction) => {
    const supportEmbed = new EmbedBuilder()
      .setTitle("Support the Bot Development")
      .setDescription(
        "If you find this bot useful and would like to support its development, " +
          "consider donating or contributing in other ways!\n\n" +
          "You can support the bot by clicking the button below.\n\n" +
          "Your support helps keep the bot running and allows for new features to be added. " +
          "**Thank you for your generosity!**",
      )
      .setColor(Colors.Blue);

    const kofiButton = new ButtonBuilder()
      .setLabel("Support on Ko-fi")
      .setStyle(ButtonStyle.Link)
      .setURL("https://ko-fi.com/galuhpzh")
      .setEmoji("<:kofi:1464634568274481288>");

    const saweriaButton = new ButtonBuilder()
      .setLabel("Support on Saweria")
      .setStyle(ButtonStyle.Link)
      .setURL("https://saweria.co/galuhpzh")
      .setEmoji("<:saweria:1464634621324034255>");

    const sociabuzzButton = new ButtonBuilder()
      .setLabel("Support on Sociabuzz")
      .setStyle(ButtonStyle.Link)
      .setURL("https://sociabuzz.com/galuhpzh")
      .setEmoji("<:sociabuzz:1464634675531354185>");

    await interaction.reply({
      embeds: [supportEmbed],
      components: [
        {
          type: 1,
          components: [kofiButton, saweriaButton, sociabuzzButton],
        },
      ],
      ephemeral: false,
    });
  },
};

export default command;
