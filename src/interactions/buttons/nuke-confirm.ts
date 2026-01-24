import {
  ButtonInteraction,
  MessageFlags,
  EmbedBuilder,
  Colors,
} from "discord.js";
import { ComponentCommand } from "../../types";

const component: ComponentCommand = {
  customId: "confirm_nuke_server",

  execute: async (interaction: ButtonInteraction) => {
    if (!interaction.guild) return;

    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    const memberPermissions = interaction.member?.permissions as any;
    if (!memberPermissions?.has("Administrator")) {
      await interaction.editReply({
        content: "You are not authorized to use this button!",
      });
      return;
    }

    try {
      if (interaction.message) {
        await interaction.message.delete();
      }
    } catch (e) {
      console.log(
        "Failed to delete confirmation message (might be already deleted).",
      );
    }

    await interaction.editReply({
      content: "**NUKE STARTED!** Deleting all channels and roles...",
    });

    const currentChannelId = interaction.channelId;

    interaction.guild.channels.cache.forEach((channel) => {
      if (channel.id === currentChannelId) {
        return;
      }
      channel.delete().catch(() => {});
    });

    interaction.guild.roles.cache.forEach((role) => {
      if (role.name !== "@everyone" && !role.managed && role.editable) {
        role.delete().catch(() => {});
      }
    });

    setTimeout(async () => {
      try {
        const channel =
          await interaction.guild?.channels.fetch(currentChannelId);

        if (channel && channel.isTextBased()) {
          const successEmbed = new EmbedBuilder()
            .setTitle("Nuke Complete")
            .setDescription(
              "Server has been successfully reset.\nAll channels and roles have been deleted.",
            )
            .setColor(Colors.DarkRed)
            .setTimestamp()
            .setFooter({ text: "System Cleaned" });

          await channel.send({ embeds: [successEmbed] });
        }
      } catch (e) {
        console.log("Could not send final nuke message.");
      }
    }, 5000);
  },
};

export default component;
