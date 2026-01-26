import fs from "fs";
import path from "path";

export function loadServerTemplate(templateName: string) {
  const filePath = path.join(
    process.cwd(),
    "src",
    "templates",
    "server",
    `${templateName}.json`,
  );

  if (!fs.existsSync(filePath)) {
    throw new Error(`Template ${templateName} does not exist.`);
  }

  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

export function loadMessageTemplate(templateName: string) {
  const filePath = path.join(
    process.cwd(),
    "src",
    "templates",
    "messages",
    `${templateName}.json`,
  );

  if (!fs.existsSync(filePath)) {
    throw new Error(`Message template ${templateName} does not exist.`);
  }

  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}
