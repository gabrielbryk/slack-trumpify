/**
 * Type definitions for Slack API requests and responses
 */

/**
 * Interface for Slack slash command request
 * Based on the payload sent by Slack when a user invokes a slash command
 * https://api.slack.com/interactivity/slash-commands#app_command_handling
 */
export interface SlackSlashCommandRequest {
    token: string;
    team_id: string;
    team_domain: string;
    channel_id: string;
    channel_name: string;
    user_id: string;
    user_name: string;
    command: string;
    text: string;
    response_url: string;
    trigger_id: string;
    api_app_id: string;
    // Optional fields
    enterprise_id?: string;
    enterprise_name?: string;
    // Thread information
    thread_ts?: string;
    // Additional information when used in a modal
    view?: any;
}

/**
 * Interface for Slack mention events
 * Used when the bot is mentioned in a channel
 */
export interface SlackMentionEvent {
    type: string;
    user: string;
    text: string;
    channel: string;
    ts: string;
    event_ts: string;
    team: string;
    // Additional fields that may be present
    thread_ts?: string;
    event_id?: string;
    channel_type?: string;
} 