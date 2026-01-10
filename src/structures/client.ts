import { Client, Collection, GatewayIntentBits } from "discord.js";
import { SlashCommand } from "../types";

export class ExtendedClient extends Client {
  commands: Collection<string, SlashCommand> = new Collection();

  constructor() {
    super({
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessageReactions,
      ],
    });
  }

  start() {
    const token = process.env.DISCORD_BOT_TOKEN;
    if (!token) {
      throw new Error(
        "DISCORD_BOT_TOKEN is not defined in environment variables."
      );
    }
    this.login(token);
  }
}
