import {
  Guild,
  ChannelType,
  TextChannel,
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  Colors,
  ColorResolvable,
  OverwriteResolvable,
} from "discord.js";
import {
  loadMessageTemplate,
  loadServerTemplate,
} from "../utils/load-template";

export async function setupServerTemplate(guild: Guild, templateName: string) {
  const template = loadServerTemplate(templateName);
  const roleMap = new Map<string, string>();

  if (template.roles) {
    console.log(`Setting up roles for ${templateName}...`);

    const sortedRoles = template.roles.sort((a: any, b: any) => {
      if (a.isEveryone) return -1;
      if (b.isEveryone) return 1;
      return 0;
    });

    for (const roleData of sortedRoles) {
      try {
        if (roleData.isEveryone || roleData.name === "@everyone") {
          const everyoneRole = guild.roles.everyone;
          const perms = BigInt(roleData.permissions ?? 0);
          await everyoneRole.setPermissions(perms);
          roleMap.set("@everyone", everyoneRole.id);
          roleMap.set(roleData.name, everyoneRole.id);
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
          permissions: BigInt(roleData.permissions ?? 0),
          reason: `Setup from template: ${templateName}`,
        });

        roleMap.set(roleData.name, newRole.id);
      } catch (error) {
        console.error(`Failed to create role ${roleData.name}:`, error);
      }
    }
  }

  const getPermissionOverwrites = (jsonPerms: any[]): OverwriteResolvable[] => {
    if (!jsonPerms) return [];

    return jsonPerms
      .map((perm) => {
        const targetId = roleMap.get(perm.roleName);
        if (!targetId) return null;

        return {
          id: targetId,
          allow: BigInt(perm.allow ?? 0),
          deny: BigInt(perm.deny ?? 0),
        } as OverwriteResolvable;
      })
      .filter((p): p is OverwriteResolvable => p !== null);
  };

  if (template.categories) {
    console.log(`Setting up channels for ${templateName}...`);

    for (const categoryData of template.categories) {
      try {
        const category = await guild.channels.create({
          name: categoryData.name,
          type: ChannelType.GuildCategory,
          permissionOverwrites: getPermissionOverwrites(
            categoryData.permissions,
          ),
        });

        for (const channelData of categoryData.channels) {
          let type = ChannelType.GuildText;
          if (channelData.type === "voice") type = ChannelType.GuildVoice;
          else if (channelData.type === "announcement")
            type = ChannelType.GuildAnnouncement;

          await guild.channels.create({
            name: channelData.name,
            type: type,
            parent: category.id,
            permissionOverwrites: getPermissionOverwrites(
              channelData.permissions,
            ),
          });
        }
      } catch (error) {
        console.error(`Failed to create category/channel:`, error);
      }
    }
  }
}

export async function setupMessageTemplate(
  channel: TextChannel,
  templateName: string,
) {
  console.log(`Loading template: ${templateName}`);
  const template = loadMessageTemplate(templateName);

  const title = template.title || null;
  const description = template.description || null;

  if (!title && !description) {
    throw new Error(
      "Template JSON must have at least a 'title' or 'description'.",
    );
  }

  let embedColor: ColorResolvable = Colors.Blue;
  if (template.color) embedColor = template.color as ColorResolvable;

  const embed = new EmbedBuilder();
  if (title) embed.setTitle(title);
  if (description) embed.setDescription(description);
  embed.setColor(embedColor);

  if (template.footer) {
    if (typeof template.footer === "string") {
      embed.setFooter({ text: template.footer });
    } else if (template.footer.text) {
      embed.setFooter({
        text: template.footer.text,
        iconURL: template.footer.icon_url || undefined,
      });
    }
  }

  if (template.image) embed.setImage(template.image);
  if (template.thumbnail) embed.setThumbnail(template.thumbnail);

  const components: ActionRowBuilder<ButtonBuilder>[] = [];

  if (templateName === "rules") {
    const btn = new ButtonBuilder()
      .setCustomId("btn_agree_rules")
      .setLabel("I Agree")
      .setStyle(ButtonStyle.Success)
      .setEmoji("✅");
    components.push(new ActionRowBuilder<ButtonBuilder>().addComponents(btn));
  } else if (templateName === "verification") {
    const btn = new ButtonBuilder()
      .setCustomId("btn_verify_member")
      .setLabel("Verify Me")
      .setStyle(ButtonStyle.Primary)
      .setEmoji("🛡️");
    components.push(new ActionRowBuilder<ButtonBuilder>().addComponents(btn));
  } else if (templateName === "ticket") {
    const btn = new ButtonBuilder()
      .setCustomId("btn_open_ticket")
      .setLabel("Open Ticket")
      .setStyle(ButtonStyle.Secondary)
      .setEmoji("📩");
    components.push(new ActionRowBuilder<ButtonBuilder>().addComponents(btn));
  }

  await channel.send({ embeds: [embed], components });

  return JSON.stringify(template, null, 2);
}
