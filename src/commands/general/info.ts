import {
  SlashCommandBuilder,
  EmbedBuilder,
  Colors,
  ChatInputCommandInteraction,
} from "discord.js";
import { SlashCommand } from "../../types";
import pkg from "../../../package.json";

const command: SlashCommand = {
  command: new SlashCommandBuilder()
    .setName("info")
    .setDescription("Get information about the bot."),

  execute: async (interaction: ChatInputCommandInteraction) => {
    const client = interaction.client;

    const days = Math.floor(client.uptime! / 86400000);
    const hours = Math.floor((client.uptime! / 3600000) % 24);
    const minutes = Math.floor((client.uptime! / 60000) % 60);
    const seconds = Math.floor((client.uptime! / 1000) % 60);
    const uptime = `${days}d ${hours}h ${minutes}m ${seconds}s`;

    const embed = new EmbedBuilder()
      .setTitle("Bot Information")
      .setColor(Colors.Yellow)
      .addFields(
        {
          name: "Bot Name",
          value: client.user?.username || "Unknown",
          inline: true,
        },
        { name: "Servers", value: `${client.guilds.cache.size}`, inline: true },
        { name: "Uptime", value: uptime, inline: true },
        { name: "Ping", value: `${client.ws.ping}ms`, inline: true },
        { name: "Version", value: pkg.version, inline: true },
        { name: "Developer", value: "Galuh", inline: true }
      )
      .setTimestamp()
      .setFooter({ text: "Bot Info" });

    await interaction.reply({ embeds: [embed] });
  },
};

export default command;
