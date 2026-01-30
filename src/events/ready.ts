import { Events, Client, ChannelType } from "discord.js";

export default {
  name: Events.ClientReady,
  once: true,
  execute(client: Client) {
    console.log(`\n--------------------------------------`);
    console.log(`Logged in as: ${client.user?.tag}`);
    console.log(`Status: ONLINE`);
    console.log(`--------------------------------------\n`);

    const UPDATE_INTERVAL = 600_000;

    const updateStats = async () => {
      console.log("Updating server stats...");

      client.guilds.cache.forEach(async (guild) => {
        try {
          await guild.members.fetch();

          const totalMembers = guild.memberCount;
          const botCount = guild.members.cache.filter((m) => m.user.bot).size;
          const humanCount = totalMembers - botCount;
          const boosterCount = guild.premiumSubscriptionCount || 0;

          const checkAndUpdate = async (prefix: string, newValue: number) => {
            const channel = guild.channels.cache.find(
              (c) =>
                c.name.startsWith(prefix) && c.type === ChannelType.GuildVoice,
            );

            if (channel) {
              const newName = `${prefix}${newValue}`;
              if (channel.name !== newName) {
                await channel.setName(newName);
              }
            }
          };

          await checkAndUpdate("All Members: ", totalMembers);
          await checkAndUpdate("Humans: ", humanCount);
          await checkAndUpdate("Bots: ", botCount);
          await checkAndUpdate("Boosters: ", boosterCount);
        } catch (error) {
          console.error(
            `Failed to update stats for guild ${guild.name}:`,
            error,
          );
        }
      });
    };

    updateStats();

    setInterval(updateStats, UPDATE_INTERVAL);
  },
};
