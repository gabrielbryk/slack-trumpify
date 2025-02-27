# Trump Talk Bot 🗣️

A Slack bot that transforms ordinary messages into Donald Trump's distinctive speaking style using AI.

## 🌟 Overview

Trump Talk Bot leverages the Anthropic Claude API to analyze and transform text into Trump's unique speech patterns. Simply use the `/trumpify` command in any Slack channel, and the bot will respond with your content rewritten to mimic Trump's signature style.

## ✨ Features

- **AI-Powered Transformation**: Uses the Anthropic Claude API to convert text into authentic Trump-speak
- **Slack Integration**: Works seamlessly within Slack via a simple slash command
- **Real-time Processing**: Transforms messages instantly with a "typing" indicator while processing
- **Thread Support**: Maintains conversation threads for organized responses
- **Error Handling**: Gracefully handles errors with themed messages

## 🛠️ Tech Stack

- **TypeScript** for type-safe code
- **Express.js** for handling HTTP requests
- **Slack API** for Slack integration
- **Anthropic API** (Claude) for AI text transformation
- **Axios** for API requests
- **pnpm** for package management
- **Node.js** runtime environment

## 🚀 Setup & Installation

### Prerequisites

- Node.js (v16+)
- pnpm (v7+)
- A Slack workspace with admin privileges
- An Anthropic API key

### Step 1: Clone & Install Dependencies

```bash
git clone <repository-url>
cd trump-talk-bot
pnpm install
```

### Step 2: Create a Slack App

1. Go to [api.slack.com/apps](https://api.slack.com/apps) and click "Create New App"
2. Choose "From scratch" and provide a name and workspace
3. Under "Basic Information", note your Signing Secret
4. Under "OAuth & Permissions", add the following Bot Token Scopes:
   - `commands` - For slash commands
   - `chat:write` - For posting messages
   - `chat:write.customize` - For customizing messages
   - `app_mentions:read` - For future mention functionality
5. Install the app to your workspace and copy the Bot User OAuth Token

### Step 3: Create a Slash Command

1. In your Slack app settings, go to "Slash Commands"
2. Click "Create New Command"
3. Set Command to `/trumpify`
4. Set Request URL to `https://your-domain.com/slack/commands` (you'll set this up in step 5)
5. Add a description and usage hint
6. Save the command

### Step 4: Configure Environment Variables

Create a `.env` file in the project root with the following:

```
# Slack Configuration
SLACK_BOT_TOKEN=xoxb-your-bot-token-here
SLACK_SIGNING_SECRET=your-signing-secret-here

# Anthropic API Configuration
ANTHROPIC_API_KEY=your-anthropic-api-key-here

# Server Configuration
PORT=3000
```

Replace the placeholder values with your actual credentials.

### Step 5: Deploy the Bot

You can deploy the bot to any Node.js hosting service. For development, you can use ngrok to expose your local server:

1. Build the TypeScript code:

   ```bash
   pnpm build
   ```

2. Start the server:

   ```bash
   pnpm start
   ```

3. In another terminal, run ngrok:

   ```bash
   ngrok http 3000
   ```

4. Use the ngrok URL (e.g., `https://abc123.ngrok.io`) as the base URL for your Slack commands and event subscriptions.

### Step 6: Update Slack App with Webhook URLs

1. Go back to your Slack app settings
2. Update the Request URL for your slash command to `https://your-domain.com/slack/commands`
3. Under "Event Subscriptions", enable events and set the Request URL to `https://your-domain.com/slack/events`
4. Subscribe to the `app_mention` bot event

## 📝 Usage

Simply type `/trumpify` followed by your message in any Slack channel:

```
/trumpify We've increased our quarterly sales by 15%.
```

The bot will respond with something like:

```
Let me tell you, our quarterly sales are up 15%. It's tremendous, believe me. Nobody has ever seen numbers like this before. We're winning like nobody's ever won before in the history of quarterly reports. The fake news won't tell you this, but we're doing fantastic. Really fantastic.
```

## 🔧 Development

To run the bot in development mode with auto-reloading:

```bash
pnpm dev
```

## 🧪 Example Transformations

**Original**: "Our team completed the project ahead of schedule."  
**Trumpified**: "Our team finished the project ahead of schedule, it's incredible. Nobody's ever seen a project delivered this fast, believe me. We have the best team, tremendous people, they're doing things nobody thought possible."

**Original**: "The new feature has been released to all users."  
**Trumpified**: "We just released this new feature, a beautiful feature, to all users. Everybody's talking about it. It's going to be huge, believe me. The biggest, most beautiful feature, probably ever."

## 📄 License

MIT License
