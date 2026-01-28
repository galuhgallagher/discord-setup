import {
  SlashCommandBuilder,
  PermissionFlagsBits,
  Colors,
  EmbedBuilder,
  ChatInputCommandInteraction,
} from "discord.js";
import { SlashCommand } from "../../types";
import { emojiPacks } from "../../templates/emoji/emoji-packs";

export const command: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName("emoji-pack")
    .setDescription("Create a pack of emojis from template.")
    .addStringOption((option) =>
      option
        .setName("template")
        .setDescription("The template of the emoji pack.")
        .setRequired(true)
        .addChoices(
          { name: "🐸 Pepe (Memes)", value: "pepe" },
          { name: "Block Fruits", value: "blox_fruit" },
          { name: "Memes", value: "memes" },
        ),
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuildExpressions),

  execute: async (interaction: ChatInputCommandInteraction) => {
    if (!interaction.guild) return;

    await interaction.deferReply();

    const template = interaction.options.getString("template", true);
    const urls = emojiPacks[template];

    if (!urls || urls.length === 0) {
      await interaction.editReply("Invalid emoji pack template selected.");
      return;
    }

    let successCount = 0;
    let failCount = 0;

    await interaction.editReply(
      `Starting to add emojis from the **${template}** pack...`,
    );

    for (const [index, url] of urls.entries()) {
      try {
        const emojiName = `${template}_${index + 1}`;

        await interaction.guild.emojis.create({
          attachment: url,
          name: emojiName,
        });
        successCount++;
      } catch (error) {
        console.error(`Failed to upload ${url}`, error);
        failCount++;
      }
    }

    const embed = new EmbedBuilder()
      .setTitle("Emoji Pack Uploaded")
      .setDescription(
        `**Theme:** ${template.toUpperCase()}\n` +
          `Success: ${successCount}\n` +
          `Failed: ${failCount}`,
      )
      .setColor(failCount === 0 ? Colors.Green : Colors.Orange)
      .setFooter({ text: "Use /steal for individual emojis" });

    await interaction.editReply({ content: null, embeds: [embed] });
  },
};

export default command;
