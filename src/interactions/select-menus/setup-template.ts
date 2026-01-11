// src/interactions/select-menus/setup-template.ts
import {
  StringSelectMenuInteraction,
  MessageFlags,
  EmbedBuilder,
  Colors,
} from "discord.js";
import { setupFromTemplate } from "../../services/setup-from-template";
import { ComponentCommand } from "../../types";

const component: ComponentCommand = {
  customId: "setup_select_template",

  execute: async (interaction: any) => {
    const selectInteraction = interaction as StringSelectMenuInteraction;

    try {
      if (!selectInteraction.values || selectInteraction.values.length === 0) {
        await selectInteraction.reply({
          content: "Invalid template selection.",
          flags: MessageFlags.Ephemeral,
        });
        return;
      }

      // Security Check
      const memberPermissions = selectInteraction.member?.permissions as any;
      if (!memberPermissions?.has("Administrator")) {
        await selectInteraction.reply({
          content: "Only administrators can perform this action.",
          flags: MessageFlags.Ephemeral,
        });
        return;
      }

      if (!selectInteraction.guild) {
        await selectInteraction.reply({
          content: "This command can only be used within a server.",
          flags: MessageFlags.Ephemeral,
        });
        return;
      }

      const selectedTemplate = selectInteraction.values[0] as string;

      await selectInteraction.deferUpdate();

      const loadingEmbed = new EmbedBuilder()
        .setTitle("Processing Setup")
        .setDescription(
          `Applying template: ${selectedTemplate}...\nPlease wait.`
        )
        .setColor(Colors.Yellow);

      await selectInteraction.editReply({
        embeds: [loadingEmbed],
        components: [],
        content: null,
      });

      await setupFromTemplate(selectInteraction.guild, selectedTemplate);

      const successEmbed = new EmbedBuilder()
        .setTitle("Setup Complete")
        .setDescription(
          `The server has been successfully configured using the **${selectedTemplate}** template.`
        )
        .setColor(Colors.Green)
        .setTimestamp();

      await selectInteraction.editReply({
        embeds: [successEmbed],
        components: [],
      });
    } catch (error: any) {
      console.error(error);
    }
  },
};

export default component;
