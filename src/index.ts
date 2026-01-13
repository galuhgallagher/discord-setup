import { ExtendedClient } from "./structures/client";
import { config } from "dotenv";
import fs from "fs";
import path from "path";
import { SlashCommand, ComponentCommand } from "./types";

config();

const client = new ExtendedClient();

const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);

console.log("Loading commands...");

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".ts"));

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const commandModule = require(filePath);
    const command: SlashCommand = commandModule.default || commandModule;

    if ("command" in command && "execute" in command) {
      client.commands.set(command.command.name, command);
      console.log(`Loaded command: ${command.command.name}`);
    }
  }
}

const interactionsPath = path.join(__dirname, "interactions");

const loadComponents = (folderName: string, collection: any) => {
  const folderPath = path.join(interactionsPath, folderName);
  if (fs.existsSync(folderPath)) {
    const files = fs
      .readdirSync(folderPath)
      .filter((file) => file.endsWith(".ts"));
    for (const file of files) {
      const filePath = path.join(folderPath, file);
      const module = require(filePath);
      const component: ComponentCommand = module.default || module;
      if (component.customId && "execute" in component) {
        collection.set(component.customId, component);
        console.log(`Loaded ${folderName}: ${component.customId}`);
      }
    }
  }
};

if (fs.existsSync(interactionsPath)) {
  console.log("Loading interactions...");
  loadComponents("buttons", client.buttons);
  loadComponents("select-menus", client.selectMenus);
  loadComponents("modals", client.modals);
}

const eventsPath = path.join(__dirname, "events");
if (fs.existsSync(eventsPath)) {
  const eventFiles = fs
    .readdirSync(eventsPath)
    .filter((file) => file.endsWith(".ts"));

  console.log("Loading events...");

  for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const eventModule = require(filePath);
    const event = eventModule.default || eventModule;

    if (event.name) {
      if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
      } else {
        client.on(event.name, (...args) => event.execute(...args));
      }
      console.log(`Loaded event: ${event.name}`);
    }
  }
}

client.start();
