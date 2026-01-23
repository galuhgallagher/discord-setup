import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChatInputCommandInteraction,
  AttachmentBuilder,
  ChannelType,
  GuildBasedChannel,
  Colors,
  EmbedBuilder,
  OverwriteType,
} from "discord.js";
import { SlashCommand } from "../../types";

const command: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName("copy-server")
    .setDescription(
      "Export full server layout (roles, channels, perms) to JSON.",
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  execute: async (interaction: ChatInputCommandInteraction) => {
    if (!interaction.guild) return;

    try {
      await interaction.deferReply();

      await interaction.guild.roles.fetch();
      await interaction.guild.channels.fetch();

      const guild = interaction.guild;

      const templateData: any = {
        name: `Template from ${guild.name}`,
        roles: [],
        categories: [],
      };
      const roles = guild.roles.cache
        .sort((a, b) => a.position - b.position)
        .filter((role) => !role.managed && role.name !== "@everyone");

      const everyoneRole = guild.roles.everyone;
      templateData.roles.push({
        name: "@everyone",
        color: everyoneRole.hexColor,
        hoist: everyoneRole.hoist,
        permissions: everyoneRole.permissions.bitfield.toString(),
        isEveryone: true,
      });

      roles.forEach((role) => {
        templateData.roles.push({
          name: role.name,
          color: role.hexColor,
          hoist: role.hoist,
          mentionable: role.mentionable,
          permissions: role.permissions.bitfield.toString(),
        });
      });

      const getPermissions = (
        channel: GuildBasedChannel,
      ): { roleName: string; allow: string; deny: string }[] => {
        if (!("permissionOverwrites" in channel)) return [];
        return Array.from(channel.permissionOverwrites.cache.values())
          .map((overwrite: any) => {
            let roleName: string | undefined;
            if (overwrite.type === OverwriteType.Role) {
              const role = guild.roles.cache.get(overwrite.id);
              if (role) roleName = role.name;
              if (overwrite.id === guild.id) roleName = "@everyone";
            }
            if (!roleName) return null;
            return {
              roleName: roleName,
              allow: overwrite.allow.bitfield.toString(),
              deny: overwrite.deny.bitfield.toString(),
            };
          })
          .filter(
            (p: any): p is { roleName: string; allow: string; deny: string } =>
              p !== null,
          );
      };

      const sortByPos = (a: GuildBasedChannel, b: GuildBasedChannel) => {
        return ((a as any).position || 0) - ((b as any).position || 0);
      };

      const categories = guild.channels.cache
        .filter((c) => c.type === ChannelType.GuildCategory)
        .sort(sortByPos);

      categories.forEach((category) => {
        const catPerms = getPermissions(category);

        const childChannels = guild.channels.cache
          .filter((c) => c.parentId === category.id)
          .sort(sortByPos)
          .map((child) => {
            let type = "text";
            if (child.type === ChannelType.GuildVoice) type = "voice";
            else if (child.type === ChannelType.GuildAnnouncement)
              type = "announcement";

            return {
              name: child.name,
              type: type,
              permissions: getPermissions(child),
            };
          });

        templateData.categories.push({
          name: category.name,
          permissions: catPerms,
          channels: childChannels,
        });
      });

      const orphanChannels = guild.channels.cache
        .filter(
          (c) =>
            c.parentId === null &&
            c.type !== ChannelType.GuildCategory &&
            !c.isThread(),
        )
        .sort(sortByPos)
        .map((child) => {
          let type = "text";
          if (child.type === ChannelType.GuildVoice) type = "voice";
          return {
            name: child.name,
            type: type,
            permissions: getPermissions(child),
          };
        });

      if (orphanChannels.length > 0) {
        templateData.categories.unshift({
          name: "NO CATEGORY",
          permissions: [],
          channels: orphanChannels,
        });
      }

      const jsonString = JSON.stringify(templateData, null, 2);
      const buffer = Buffer.from(jsonString, "utf-8");

      const attachment = new AttachmentBuilder(buffer, {
        name: `${guild.name.replace(/\s+/g, "_")}-FULL-template.json`,
      });

      const successEmbed = new EmbedBuilder()
        .setTitle("Full Server Backup Created!")
        .setDescription(
          "Successfully exported Roles, Categories, Channels, and Permissions.\n" +
            "Use this JSON file to setup a new server.",
        )
        .addFields(
          {
            name: "Roles Exported",
            value: `${templateData.roles.length}`,
            inline: true,
          },
          {
            name: "Categories",
            value: `${templateData.categories.length}`,
            inline: true,
          },
        )
        .setColor(Colors.Green);

      await interaction.editReply({
        embeds: [successEmbed],
        files: [attachment],
      });
    } catch (error: any) {
      if (error.code === 10062 || error.code === 404) return;
      console.error("Copy Server Error:", error);
      try {
        await interaction.editReply("Failed to copy server layout.");
      } catch (e) {}
    }
  },
};

export default command;
