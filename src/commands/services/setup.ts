import {
  SlashCommandBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  EmbedBuilder,
  PermissionFlagsBits,
  ChatInputCommandInteraction,
  Colors,
} from "discord.js";
import { SlashCommand } from "../../types";

const command: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName("setup")
    .setDescription("Setup server channels using a template.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  execute: async (interaction: ChatInputCommandInteraction) => {
    const embed = new EmbedBuilder()
      .setTitle("Server Setup")
      .setDescription(
        "Select a template below to start setting up your server automatically.\n\n" +
          "**Available Templates:**\n" +
          "**Gaming**: Channels for gaming communities.\n" +
          "**Study**: Channels for study groups and classes.\n" +
          "**Creator Community**: Channels for creator community servers.\n" +
          "**Developer**: Channels for developer and programming communities.\n" +
          "**Crypto & NFT**: Channels for crypto and NFT communities.",
      )
      .setColor(Colors.DarkRed);

    const selectMenu = new StringSelectMenuBuilder()
      .setCustomId("setup_select_template")
      .setPlaceholder("Select Server Template...")
      .addOptions(
        new StringSelectMenuOptionBuilder()
          .setLabel("Gaming Server")
          .setDescription("Complete setup for gaming communities")
          .setValue("gaming"),
        new StringSelectMenuOptionBuilder()
          .setLabel("Study Group")
          .setDescription("Complete setup for study groups and classes")
          .setValue("study"),
        new StringSelectMenuOptionBuilder()
          .setLabel("Creator Community")
          .setDescription("Complete setup for creator community servers")
          .setValue("community"),
        new StringSelectMenuOptionBuilder()
          .setLabel("Developer Hub")
          .setDescription(
            "Complete setup for developer and programming communities",
          )
          .setValue("developer"),
        new StringSelectMenuOptionBuilder()
          .setLabel("Crypto & NFT Hub")
          .setDescription("Complete setup for crypto and NFT communities")
          .setValue("crypto"),
      );

    const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
      selectMenu,
    );

    await interaction.reply({
      embeds: [embed],
      components: [row],
    });
  },
};

export default command;
