import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  ChatInputCommandInteraction,
  EmbedBuilder,
  Colors,
} from "discord.js";
import { SlashCommand } from "../../types";

export const command: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName("steal-emoji")
    .setDescription("Steal an emoji from another server.")
    .addStringOption((option) =>
      option
        .setName("emoji")
        .setDescription("The emoji to steal (paste the emoji here).")
        .setRequired(true),
    )
    .addStringOption((option) =>
      option
        .setName("name")
        .setDescription("The name for the new emoji(optional).")
        .setRequired(false),
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuildExpressions),

  execute: async (interaction: ChatInputCommandInteraction) => {
    if (!interaction.guild) return;

    await interaction.deferReply();

    const emojiInput = interaction.options.getString("emoji", true);
    const nameInput = interaction.options.getString("name");

    const customEmojiRegex = /<?(a)?:?(\w{2,32}):(\d{17,19})>?/;
    const match = emojiInput.match(customEmojiRegex);

    if (!match) {
      await interaction.editReply("Please provide a valid custom emoji.");
      return;
    }

    const isAnimated = match[1] === "a";
    const originalName = match[2];
    const emojiId = match[3];
    const newName = nameInput || originalName || "";

    const emojiUrl = `https://cdn.discordapp.com/emojis/${emojiId}.${isAnimated ? "gif" : "png"}`;

    try {
      const createdEmoji = await interaction.guild.emojis.create({
        attachment: emojiUrl,
        name: newName,
      });

      const embed = new EmbedBuilder()
        .setTitle("Emoji Stolen!")
        .setDescription(
          `Successfully stole the emoji as :${createdEmoji.name}:`,
        )
        .setColor(Colors.Green)
        .setThumbnail(createdEmoji.url);

      await interaction.editReply({ embeds: [embed] });
    } catch (error: any) {
      console.error(error);

      if (error.code === 30008) {
        await interaction.editReply(
          "Maximum number of emojis reached for this server.",
        );
      } else if (error.code === 50013) {
        await interaction.editReply("Missing permissions to manage emojis.");
      } else {
        await interaction.editReply(
          "Failed to upload emoji. Make sure the image is valid.",
        );
      }
    }
  },
};

export default command;
