import {
  ModalSubmitInteraction,
  ChannelType,
  EmbedBuilder,
  PermissionFlagsBits,
} from "discord.js";

export async function handleSetupModal(interaction: ModalSubmitInteraction) {
  if (interaction.customId !== "server-setup-modal") return;

  if (!interaction.guild) {
    return interaction.reply({
      content: "Discord server not found.",
      ephemeral: true,
    });
  }

  if (!interaction.memberPermissions?.has(PermissionFlagsBits.Administrator)) {
    return interaction.reply({
      content: "You need to be an administrator to use this setup.",
      ephemeral: true,
    });
  }

  const categoryName = interaction.fields.getTextInputValue("category-name");
  const channelsRaw = interaction.fields.getTextInputValue("channels");

  const channelNames = channelsRaw
    .split(",")
    .map((name) => name.trim())
    .filter(Boolean);

  await interaction.reply({
    content: "Setting up your server...",
    ephemeral: true,
  });

  try {
    const category = await interaction.guild.channels.create({
        name: categoryName,
        type: ChannelType.GuildCategory,
      });

    for (const name of channelNames) {
      await interaction.guild.channels.create({
        name: name,
        type: ChannelType.GuildText,
        parent: category.id,
      });
    }
  } catch (err) {
    console.error("Error during server setup:", err);
    return interaction.editReply({
      content:
        "An error occurred while setting up the server. Please try again later.",
    });
  }
}
