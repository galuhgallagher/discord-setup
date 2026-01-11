import fs from "fs";
import path from "path";

export function loadTemplate(templateName: string) {
  const filePath = path.join(
    process.cwd(),
    "src",
    "templates",
    `${templateName}.json`
  );

  if (!fs.existsSync(filePath)) {
    throw new Error(`Template ${templateName} does not exist.`);
  }

  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}
