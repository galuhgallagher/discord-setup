import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChatInputCommandInteraction,
  EmbedBuilder,
  Colors,
  Role,
} from "discord.js";
import { SlashCommand } from "../../types";

const command: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName("scan-permissions")
    .setDescription("Scans the server for roles with dangerous permissions."),

  execute: async (interaction: ChatInputCommandInteraction) => {
    if (!interaction.guild) return;

    await interaction.deferReply();
    await interaction.guild.roles.fetch();

    const roles = interaction.guild.roles.cache;
    const dangerousRoles: string[] = [];
    const adminRoles: string[] = [];
    let everyoneIssues: string[] = [];

    const sensitivePerms = [
      { name: "Ban Members", bit: PermissionFlagsBits.BanMembers },
      { name: "Kick Members", bit: PermissionFlagsBits.KickMembers },
      { name: "Manage Channels", bit: PermissionFlagsBits.ManageChannels },
      { name: "Manage Guild", bit: PermissionFlagsBits.ManageGuild },
      { name: "Manage Roles", bit: PermissionFlagsBits.ManageRoles },
      { name: "Mention Everyone", bit: PermissionFlagsBits.MentionEveryone },
    ];

    roles.forEach((role) => {
      if (role.permissions.has(PermissionFlagsBits.Administrator)) {
        if (role.name !== "@everyone") {
          adminRoles.push(role.toString());
        }
      } else {
        const hasSensitive = sensitivePerms.some((perm) =>
          role.permissions.has(perm.bit),
        );
        if (hasSensitive && role.name !== "@everyone") {
          dangerousRoles.push(role.toString());
        }
      }

      if (role.name === "@everyone") {
        if (role.permissions.has(PermissionFlagsBits.Administrator)) {
          everyoneIssues.push("CRITICAL: Administrator");
        }
        sensitivePerms.forEach((perm) => {
          if (role.permissions.has(perm.bit)) {
            everyoneIssues.push(`WARNING: ${perm.name}`);
          }
        });
      }
    });

    const embed = new EmbedBuilder()
      .setTitle("Security Audit Report")
      .setDescription(`Security scan results for **${interaction.guild.name}**`)
      .setColor(Colors.DarkRed)
      .setTimestamp();

    embed.addFields({
      name: `Administrator Roles (${adminRoles.length})`,
      value: adminRoles.length > 0 ? adminRoles.join(", ") : "None (Safe)",
      inline: false,
    });

    const dangerousList = dangerousRoles.join(", ");
    embed.addFields({
      name: `Roles with Sensitive Permissions (${dangerousRoles.length})`,
      value:
        dangerousRoles.length > 0
          ? dangerousList.length > 1000
            ? dangerousList.substring(0, 1000) + "..."
            : dangerousList
          : "None",
      inline: false,
    });

    if (everyoneIssues.length > 0) {
      embed.addFields({
        name: "@everyone Role Security Issues",
        value: everyoneIssues.join("\n"),
        inline: false,
      });
      embed.setColor(Colors.Red);
    } else {
      embed.addFields({
        name: "@everyone Role",
        value: "Safe configuration.",
        inline: false,
      });
    }

    await interaction.editReply({ embeds: [embed] });
  },
};

export default command;
