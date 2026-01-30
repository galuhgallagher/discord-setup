import {
  SlashCommandBuilder,
  EmbedBuilder,
  Colors,
  ChatInputCommandInteraction,
} from "discord.js";
import { SlashCommand } from "../../types";
import { ExtendedClient } from "../../structures/client";

const command: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Show the list of available commands and guides.")
    .addStringOption((option) =>
      option
        .setName("command")
        .setDescription("Get specific info about a command")
        .setRequired(false),
    ),

  execute: async (interaction: ChatInputCommandInteraction) => {
    const client = interaction.client as ExtendedClient;
    const specificCommandName = interaction.options.getString("command");

    if (specificCommandName) {
      const cmd = client.commands.get(specificCommandName.toLowerCase());

      if (!cmd) {
        await interaction.reply({
          content: "Command not found.",
          ephemeral: true,
        });
        return;
      }

      const embed = new EmbedBuilder()
        .setTitle(`Command: /${cmd.command.name}`)
        .setColor(Colors.Blue)
        .setDescription(cmd.command.description || "No description provided.")
        .addFields(
          {
            name: "Category",
            value: cmd.category || "General",
            inline: true,
          },
          {
            name: "Permissions",
            value: cmd.permissions ? "Restricted" : "Everyone",
            inline: true,
          },
        );

      await interaction.reply({ embeds: [embed] });
      return;
    }

    const commands = client.commands;
    const categories = [
      ...new Set(commands.map((cmd) => cmd.category || "General")),
    ];

    const categoryEmojis: Record<string, string> = {
      Admin: "🔒",
      Utility: "🛠️",
      General: "🌍",
      Security: "🛡️",
      Services: "🏗️",
    };

    const embed = new EmbedBuilder()
      .setTitle("Bot Command Guide")
      .setDescription(
        "Here is the list of all available commands.\nType `/help [command]` for more details.",
      )
      .setColor(Colors.Yellow)
      .setThumbnail(client.user?.displayAvatarURL() || null)
      .setTimestamp();

    categories.sort().forEach((cat) => {
      const categoryCommands = commands
        .filter((cmd) => (cmd.category || "General") === cat)
        .map((cmd) => `\`/${cmd.command.name}\``)
        .join(", ");

      const emoji = categoryEmojis[cat] || "fp";

      if (categoryCommands) {
        embed.addFields({
          name: `${emoji} ${cat} Commands`,
          value: categoryCommands,
          inline: false,
        });
      }
    });

    embed.setFooter({ text: `Total Commands: ${commands.size}` });

    await interaction.reply({ embeds: [embed] });
  },
};

export default command;
