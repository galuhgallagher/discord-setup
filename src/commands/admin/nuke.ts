import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChatInputCommandInteraction,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  EmbedBuilder,
  Colors,
} from "discord.js";
import { SlashCommand } from "../../types";

const command: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName("nuke")
    .setDescription("☢️ DELETE ALL CHANNELS AND ROLES (Reset Server).")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  execute: async (interaction: ChatInputCommandInteraction) => {
    const embed = new EmbedBuilder()
      .setTitle("☢️ WARNING: SERVER NUKE INITIATED")
      .setDescription(
        "Are you sure you want to **DELETE ALL** channels and roles?\n" +
          "This action cannot be undone.\n\n" +
          "**Click the button below to confirm.**",
      )
      .setColor(Colors.DarkRed);

    const confirmButton = new ButtonBuilder()
      .setCustomId("confirm_nuke_server")
      .setLabel("YES, NUKE EVERYTHING")
      .setStyle(ButtonStyle.Danger)
      .setEmoji("💣");

    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
      confirmButton,
    );

    await interaction.reply({
      embeds: [embed],
      components: [row],
    });
  },
};

export default command;
