import { Interaction, Events } from "discord.js";
import { ExtendedClient } from "../structures/client";

export default {
  name: Events.InteractionCreate,
  async execute(interaction: Interaction) {
    const client = interaction.client as ExtendedClient;

    if (interaction.isChatInputCommand()) {
      const command = client.commands.get(interaction.commandName);
      if (!command) return;

      try {
        await command.execute(interaction);
      } catch (error) {
        console.error(error);
        const errPayload = {
          content: "Error executing command",
          ephemeral: true,
        };
        if (interaction.replied || interaction.deferred)
          await interaction.followUp(errPayload).catch(() => {});
        else await interaction.reply(errPayload).catch(() => {});
      }
      return;
    }

    let component;

    if (interaction.isButton()) {
      component = client.buttons.get(interaction.customId);
    } else if (interaction.isStringSelectMenu()) {
      component = client.selectMenus.get(interaction.customId);
    } else if (interaction.isModalSubmit()) {
      component = client.modals.get(interaction.customId);
    }

    if (component) {
      try {
        await component.execute(interaction);
      } catch (error) {
        console.error("Component Error:", error);

        const errPayload = {
          content: "There was an error processing this interaction.",
          ephemeral: true,
        };
        if (
          interaction.isRepliable() &&
          !interaction.replied &&
          !interaction.deferred
        ) {
          await interaction.reply(errPayload).catch(() => {});
        }
      }
    }
  },
};
