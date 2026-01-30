import {
  Guild,
  ChannelType,
  OverwriteResolvable,
  ColorResolvable,
} from "discord.js";

export async function restoreServer(guild: Guild, data: any) {
  const roleMap = new Map<string, string>();

  console.log("Restoring Roles...");
  if (data.roles) {
    for (const roleData of data.roles) {
      try {
        if (roleData.isEveryone) {
          const everyone = guild.roles.everyone;
          await everyone.setPermissions(BigInt(roleData.permissions));
          roleMap.set("@everyone", everyone.id);
          continue;
        }

        const existingRole = guild.roles.cache.find(
          (r) => r.name === roleData.name,
        );
        if (existingRole) {
          roleMap.set(roleData.name, existingRole.id);
          continue;
        }

        const newRole = await guild.roles.create({
          name: roleData.name,
          color: roleData.color as ColorResolvable,
          hoist: roleData.hoist,
          mentionable: roleData.mentionable,
          permissions: BigInt(roleData.permissions),
          reason: "Server Restore",
        });

        roleMap.set(roleData.name, newRole.id);
      } catch (err) {
        console.error(`Failed to create role ${roleData.name}:`, err);
      }
    }
  }

  const getOverwrites = (perms: any[]): OverwriteResolvable[] => {
    if (!perms) return [];

    return perms
      .map((p) => {
        const roleId = roleMap.get(p.roleName);
        if (!roleId) return null;

        return {
          id: roleId,
          allow: BigInt(p.allow),
          deny: BigInt(p.deny),
        } as OverwriteResolvable;
      })
      .filter((p) => p !== null) as OverwriteResolvable[];
  };

  console.log("Restoring Channels...");
  if (data.categories) {
    for (const categoryData of data.categories) {
      try {
        let parentId = null;

        if (categoryData.name !== "NO CATEGORY") {
          const category = await guild.channels.create({
            name: categoryData.name,
            type: ChannelType.GuildCategory,
            permissionOverwrites: getOverwrites(categoryData.permissions),
          });
          parentId = category.id;
        }

        for (const channelData of categoryData.channels) {
          let type = ChannelType.GuildText;
          if (channelData.type === "voice") type = ChannelType.GuildVoice;
          else if (channelData.type === "announcement")
            type = ChannelType.GuildAnnouncement;

          await guild.channels.create({
            name: channelData.name,
            type: type,
            parent: parentId,
            permissionOverwrites: getOverwrites(channelData.permissions),
          });
        }
      } catch (err) {
        console.error(`Failed to restore category/channel:`, err);
      }
    }
  }
}
