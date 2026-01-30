import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChatInputCommandInteraction,
  EmbedBuilder,
  Colors,
} from "discord.js";
import { SlashCommand } from "../../types";
import { restoreServer } from "../../services/restore-service";
import axios from "axios";

const command: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName("restore-server")
    .setDescription("Restore server layout from a JSON backup file.")
    .addAttachmentOption((option) =>
      option
        .setName("file")
        .setDescription("The .json backup file")
        .setRequired(true),
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  execute: async (interaction: ChatInputCommandInteraction) => {
    if (!interaction.guild) return;

    await interaction.deferReply();

    const attachment = interaction.options.getAttachment("file", true);

    if (!attachment.name.endsWith(".json")) {
      await interaction.editReply("Please upload a valid **.json** file.");
      return;
    }

    try {
      const response = await axios.get(attachment.url);
      const backupData = response.data;

      if (!backupData.categories && !backupData.roles) {
        await interaction.editReply("Invalid backup file format.");
        return;
      }

      await interaction.editReply(
        "**Restoration started!** Creating roles and channels... This may take a while.",
      );

      await restoreServer(interaction.guild, backupData);

      const successEmbed = new EmbedBuilder()
        .setTitle("Server Restored Successfully")
        .setDescription(
          `Layout has been applied from **${attachment.name}**.\n\n**Note:** Bots and members need to be assigned roles manually if the IDs have changed.`,
        )
        .setColor(Colors.Green)
        .setTimestamp();

      await interaction.editReply({ content: null, embeds: [successEmbed] });
    } catch (error) {
      console.error(error);
      await interaction.editReply(
        "Failed to process the backup file. Check console for details.",
      );
    }
  },
};

export default command;
