import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChatInputCommandInteraction,
  EmbedBuilder,
  Colors,
} from "discord.js";
import { SlashCommand } from "../../types";

const command: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName("cleanup")
    .setDescription(
      "Delete duplicate channels and roles (keeps the oldest one).",
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  execute: async (interaction: ChatInputCommandInteraction) => {
    if (!interaction.guild) return;

    await interaction.deferReply();

    let deletedChannels = 0;
    let deletedRoles = 0;

    try {
      const channels = await interaction.guild.channels.fetch();
      const channelMap = new Map<string, string>();

      const sortedChannels = channels.sorted(
        (a, b) => (a?.createdTimestamp || 0) - (b?.createdTimestamp || 0),
      );

      for (const [id, channel] of sortedChannels) {
        if (!channel || !channel.name) continue;

        const key = `${channel.name}-${channel.type}`;

        if (channelMap.has(key)) {
          await channel.delete("Cleanup duplicate");
          deletedChannels++;
        } else {
          channelMap.set(key, id);
        }
      }

      const roles = await interaction.guild.roles.fetch();
      const roleMap = new Map<string, string>();

      const sortedRoles = roles.sorted(
        (a, b) => a.createdTimestamp - b.createdTimestamp,
      );

      for (const [id, role] of sortedRoles) {
        if (role.name === "@everyone" || role.managed) continue;

        if (roleMap.has(role.name)) {
          if (role.editable) {
            await role.delete("Cleanup duplicate");
            deletedRoles++;
          }
        } else {
          roleMap.set(role.name, id);
        }
      }

      const summaryEmbed = new EmbedBuilder()
        .setTitle("Cleanup Complete")
        .setColor(Colors.Green)
        .setDescription("Successfully processed duplicate channels and roles.")
        .addFields(
          {
            name: "Deleted Channels",
            value: `${deletedChannels}`,
            inline: true,
          },
          { name: "Deleted Roles", value: `${deletedRoles}`, inline: true },
        )
        .setTimestamp();

      await interaction.editReply({
        content: null,
        embeds: [summaryEmbed],
      });
    } catch (error) {
      console.error(error);
      await interaction.editReply({
        content: "Error during cleanup. Check my permissions.",
      });
    }
  },
};

export default command;
