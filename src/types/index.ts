import {
  SlashCommandBuilder,
  ChatInputCommandInteraction,
  PermissionResolvable,
  ButtonInteraction,
  StringSelectMenuInteraction,
  ModalSubmitInteraction,
} from "discord.js";

export interface SlashCommand {
  command: SlashCommandBuilder | any;
  execute: (interaction: ChatInputCommandInteraction) => Promise<void>;
  cooldown?: number;
  permissions?: PermissionResolvable[];
}

export interface ComponentCommand {
  customId: string;
  execute: (
    interaction:
      | ButtonInteraction
      | StringSelectMenuInteraction
      | ModalSubmitInteraction
      | any
  ) => Promise<void>;
}

export interface BotConfig {
  token: string;
  clientId: string;
}

export { SlashCommandBuilder };
