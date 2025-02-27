import express from 'express';
import { createEventAdapter, SlackEventAdapter } from '@slack/events-api';
import { WebClient } from '@slack/web-api';
import { createMessageAdapter, SlackMessageAdapter } from '@slack/interactive-messages';
import dotenv from 'dotenv';
import { AnthropicClient } from './anthropic';
import { SlackSlashCommandRequest, SlackMentionEvent } from './types/slack';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const port = process.env.PORT || 3000;

// Initialize Slack components
const slackSigningSecret = process.env.SLACK_SIGNING_SECRET || '';
const slackInteractive = createMessageAdapter(slackSigningSecret);
const slackEvents = createEventAdapter(slackSigningSecret);
const slackToken = process.env.SLACK_BOT_TOKEN || '';
const slackClient = new WebClient(slackToken);

// Initialize Anthropic client
const anthropicApiKey = process.env.ANTHROPIC_API_KEY || '';
const anthropicClient = new AnthropicClient(anthropicApiKey);

// Validate required environment variables
if (!slackSigningSecret || !slackToken || !anthropicApiKey) {
    console.error('Missing required environment variables. Please check your .env file.');
    process.exit(1);
}

// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/slack/events', slackEvents.requestListener());
app.use('/slack/interactive', slackInteractive.requestListener());

// Health check endpoint
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'OK',
        message: 'Trump Talk Bot is running tremendously well, believe me!',
        timestamp: new Date().toISOString()
    });
});

// Handle slash command
app.post('/slack/commands', async (req, res) => {
    const slackRequest = req.body as SlackSlashCommandRequest;
    console.log('Received slash command:', slackRequest.command);

    // Only respond to the /trumpify command
    if (slackRequest.command === '/trumpify') {
        // Acknowledge receipt of the command immediately
        res.status(200).send();

        try {
            // Get the original text
            const originalText = slackRequest.text;

            if (!originalText || originalText.trim() === '') {
                await slackClient.chat.postMessage({
                    channel: slackRequest.channel_id,
                    text: "You didn't give me anything to trumpify. Sad! Try again with some text, it'll be tremendous. Many people say I give the best responses when you actually give me something to work with!",
                    thread_ts: slackRequest.thread_ts
                });
                return;
            }

            // Track processing time
            const startTime = Date.now();

            // Show a typing indicator (ephemeral message that will be replaced)
            const loadingMessage = await slackClient.chat.postMessage({
                channel: slackRequest.channel_id,
                text: "Making your message tremendous... believe me, it's gonna be the best transformation you've ever seen!",
                thread_ts: slackRequest.thread_ts,
            });

            // Transform the text using Anthropic API
            const trumpifiedText = await anthropicClient.trumpifyText(originalText);

            // Calculate processing time
            const processingTime = ((Date.now() - startTime) / 1000).toFixed(2);
            console.log(`Trumpification completed in ${processingTime}s`);

            // Delete the loading message
            try {
                await slackClient.chat.delete({
                    channel: slackRequest.channel_id,
                    ts: loadingMessage.ts as string
                });
            } catch (deleteError) {
                console.warn('Could not delete loading message:', deleteError);
                // Continue with posting the result even if we couldn't delete the loading message
            }

            // Post the transformed message
            await slackClient.chat.postMessage({
                channel: slackRequest.channel_id,
                text: trumpifiedText,
                username: 'Trump Talk',
                icon_url: 'https://i.imgur.com/Ob7VNge.png', // Trump cartoon image URL (replace with actual image)
                // If it's in a thread, maintain the thread
                thread_ts: slackRequest.thread_ts,
            });

        } catch (error) {
            console.error('Error processing slash command:', error);

            // Notify the user of the error
            try {
                await slackClient.chat.postMessage({
                    channel: slackRequest.channel_id,
                    text: "There was a tremendous failure, believe me. The biggest! We had the best servers, but something went wrong. We're going to fix it and make it great again. Nobody has better error handling than me!",
                    thread_ts: slackRequest.thread_ts,
                });
            } catch (postError) {
                console.error('Error sending error message:', postError);
            }
        }
    } else {
        // Unknown command
        res.status(200).send('Unknown command. The Trump Talk Bot only responds to /trumpify.');
    }
});

// Handle mentions and direct messages
slackEvents.on('app_mention', async (event: SlackMentionEvent) => {
    console.log('Bot was mentioned:', event);
    // Future implementation for responding to mentions
});

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Server error:', err);
    res.status(500).json({
        error: 'Something went wrong',
        message: 'The server encountered a tremendous problem. The best problem, actually. But we\'re fixing it!'
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Trump Talk Bot server is running on port ${port}`);
    console.log(`Health check available at http://localhost:${port}/health`);
});