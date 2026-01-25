# 🏗️ Discord Setup & Utility Bot

![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Discord.js](https://img.shields.io/badge/Discord.js-5865F2?style=for-the-badge&logo=discord&logoColor=white)
![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)

An advanced "Server Architect" bot designed to build, organize, and secure Discord servers in seconds. From applying full server templates to nuking layouts and auditing permissions this bot handles the heavy lifting of server management.

## ✨ Key Features

### 🏗️ Server Building

- **/setup**: Automatically builds channels and categories using pre-set templates (Gaming, Study, Community).
- **/setup-stats**: Creates auto-updating voice channels to track Member Count, Bots, and Boosters.
- **JSON Templates**: Easily extensible template system.

### 🛠️ Utility & Management

- **/cleanup**: Intelligently detects and deletes duplicate channels and roles to keep the server clean.
- **/copy-server**: Exports the entire server layout (Channels, Categories, Roles, and Permissions) into a JSON file for backup or cloning.

### 🛡️ Security & Admin

- **/scan-permissions**: Audits the server for dangerous roles (Administrator, Ban Members, etc.) and checks `@everyone` safety.
- **/nuke**: (Dangerous) Resets the entire server by deleting all channels and roles with a secure confirmation system.

---

## 🚀 Installation & Setup

### Prerequisites

- Node.js (v16.11.0 or higher)
- A Discord Bot Token ([Get it here](https://discord.com/developers/applications))

### 1. Clone the Repository

```
git clone [https://github.com/YourUsername/discord-setup-bot.git](https://github.com/YourUsername/discord-setup-bot.git)
cd discord-setup-bot
```

### 2. Install Dependencies

```
npm install
```

### 3. Configure Environment Variables

Create a .env file in the root directory and add your credentials:

```
DISCORD_BOT_TOKEN=your_bot_token_here
CLIENT_ID=your_client_id_here
```

### 4. Deploy Commands

Register the slash commands to Discord:

```
npm run deploy
```

### 5. Start the Bot

For development (with auto-restart):

```
npm run dev
```

For production:

```
npm run build
npm start
```

## 📂 Project Structure

```
src/
├── commands/         # Slash command definitions (Admin, General, Services, Security)
├── events/           # Event handlers (ready, interactionCreate)
├── interactions/     # Component handlers (Buttons, Select Menus, Modals)
├── services/         # Core logic (e.g., Template applicator)
├── structures/       # Extended Client class
├── templates/        # JSON files for server layouts
└── types/            # TypeScript interfaces
```

## 🎮 Usage Examples

**Applying a Template**

Run `/setup` and select a template from the dropdown menu.

    Supported Templates: Gaming, Study Group, General Community.

**Backing up a Server**

Run `/copy-server`. The bot will generate a .json file containing your server's structure, roles, and permissions. You can place this file in `src/templates/` to use it with the setup command.
Resetting a Server

**Destroy All Channel & Roles**

Run `/nuke`. A confirmation button will appear.

    Warning: This action is irreversible. The bot preserves the channel where the command is executed to prevent API errors.

## 📜 License

Distributed under the ISC License. See package.json for more information.

---

Developed with ❤️ by [Galuh](https://github.com/galuhpzh)
