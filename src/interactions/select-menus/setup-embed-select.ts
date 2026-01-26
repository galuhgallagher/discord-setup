import {
  StringSelectMenuInteraction,
  EmbedBuilder,
  AttachmentBuilder,
  Colors,
  MessageFlags,
  TextChannel,
} from "discord.js";
import { setupMessageTemplate } from "../../services/setup-from-template";
import { ComponentCommand } from "../../types";

const component: ComponentCommand = {
  customId: "setup_embed_select",

  execute: async (interaction: any) => {
    const selectInteraction = interaction as StringSelectMenuInteraction;

    const selectedTemplate = selectInteraction.values[0];
    const channel = selectInteraction.channel as TextChannel;

    if (!channel) return;

    try {
      const jsonString = await setupMessageTemplate(
        channel,
        selectedTemplate || "",
      );

      const buffer = Buffer.from(jsonString, "utf-8");
      const attachment = new AttachmentBuilder(buffer, {
        name: `${selectedTemplate}.json`,
      });

      const successEmbed = new EmbedBuilder()
        .setTitle("✅ Embed Posted Successfully!")
        .setDescription(
          `The **${selectedTemplate}** embed has been sent to ${channel}.\n\n` +
            "📂 **JSON Template File:**\n" +
            "I have attached the raw JSON file below. You can download it and use it with other bots (like Sapphire, Carl-bot, or Embed Builder) if needed.",
        )
        .setColor(Colors.Green);

      await selectInteraction.update({
        embeds: [successEmbed],
        components: [],
        files: [attachment],
      });
    } catch (error) {
      console.error("Error sending embed:", error);
      await selectInteraction.reply({
        content: `Failed to send embed: ${error}`,
        flags: MessageFlags.Ephemeral,
      });
    }
  },
};

export default component;
