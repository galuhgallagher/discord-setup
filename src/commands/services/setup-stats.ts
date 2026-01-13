import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChannelType,
  ChatInputCommandInteraction,
  Colors,
  EmbedBuilder,
} from "discord.js";
import { SlashCommand } from "../../types";

const command: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName("server-stats")
    .setDescription("Create a locked voice channel to display server stats.")
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  execute: async (interaction: ChatInputCommandInteraction) => {
    if (!interaction.guild) return;

    await interaction.deferReply();

    try {
      await interaction.guild.members.fetch();

      const totalMembers = interaction.guild.memberCount;
      const botCount = interaction.guild.members.cache.filter(
        (member) => member.user.bot
      ).size;
      const humanCount = totalMembers - botCount;
      const boosterCount = interaction.guild.premiumSubscriptionCount || 0;

      const category = await interaction.guild.channels.create({
        name: "Server Stats",
        type: ChannelType.GuildCategory,
        permissionOverwrites: [
          {
            id: interaction.guild.id,
            allow: [PermissionFlagsBits.ViewChannel],
            deny: [PermissionFlagsBits.Connect],
          },
        ],
      });

      const statsToCreate = [
        `Total Members: ${totalMembers}`,
        `Humans: ${humanCount}`,
        `Bots: ${botCount}`,
        `Boosters: ${boosterCount}`,
      ];

      for (const name of statsToCreate) {
        await interaction.guild.channels.create({
          name: name,
          type: ChannelType.GuildVoice,
          parent: category.id,
          permissionOverwrites: [
            {
              id: interaction.guild.id,
              allow: [PermissionFlagsBits.ViewChannel],
              deny: [PermissionFlagsBits.Connect],
            },
          ],
        });
      }

      const embed = new EmbedBuilder()
        .setTitle("Server Stats Setup Complete")
        .setDescription(
          "The server stats channels have been created successfully."
        )
        .setColor(Colors.Green);

      await interaction.editReply({ embeds: [embed] });
    } catch (error) {
      await interaction.editReply({
        content: "Failed to create stats channels.",
      });
    }
  },
};

export default command;
