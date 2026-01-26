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
    .setName("setup-message")
    .setDescription(
      "Send a pre-made embed message (Rules, Verify, etc) to this channel.",
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  execute: async (interaction: ChatInputCommandInteraction) => {
    const selectMenu = new StringSelectMenuBuilder()
      .setCustomId("setup_embed_select")
      .setPlaceholder("Choose an embed template...")
      .addOptions(
        new StringSelectMenuOptionBuilder()
          .setLabel("📜 Server Rules")
          .setDescription("Rules embed with 'I Agree' button")
          .setValue("rules"),
        new StringSelectMenuOptionBuilder()
          .setLabel("🎫 Ticket Panel")
          .setDescription("Support ticket embed")
          .setValue("ticket"),
        new StringSelectMenuOptionBuilder()
          .setLabel("🔗 Social Media")
          .setDescription("List of social media links")
          .setValue("socials"),
        new StringSelectMenuOptionBuilder()
          .setLabel("👋 Welcome Message")
          .setDescription("Welcome new members with an acknowledge button")
          .setValue("welcome"),
      );

    const row = new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
      selectMenu,
    );

    const embed = new EmbedBuilder()
      .setTitle("Embed Setup Wizard")
      .setDescription("Select a template below to post it in **this channel**.")
      .setColor(Colors.Blue);

    await interaction.reply({
      embeds: [embed],
      components: [row],
      ephemeral: false,
    });
  },
};

export default command;
