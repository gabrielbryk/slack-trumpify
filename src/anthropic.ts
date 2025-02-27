import axios from 'axios';

interface AnthropicMessage {
    role: 'user' | 'assistant';
    content: string;
}

interface AnthropicResponse {
    content: {
        type: string;
        text: string;
    }[];
}

/**
 * Client for interacting with the Anthropic API
 */
export class AnthropicClient {
    private apiKey: string;
    private baseUrl: string;

    constructor(apiKey: string) {
        this.apiKey = apiKey;
        this.baseUrl = 'https://api.anthropic.com/v1/messages';
    }

    /**
     * Transforms text to sound like Donald Trump using Claude
     * @param text - The original text to be transformed
     * @returns The transformed text in Trump's style
     */
    async trumpifyText(text: string): Promise<string> {
        try {
            const messages: AnthropicMessage[] = [
                {
                    role: 'user',
                    content: `Transform the following text to sound like Donald Trump would say it. 
Make it authentic to his distinctive speaking style with these characteristics:

1. Use simple, direct language with short sentences
2. Add his signature phrases like "believe me", "tremendous", "the best", "huge", "very very", "a lot of people are saying"
3. Include his tendency to go off on tangents and then circle back
4. Add superlatives and exaggerations ("the most beautiful", "like nobody's ever seen before")
5. Include some self-congratulatory remarks and references to his own success
6. Occasionally use rhetorical questions
7. Use his verbal tics like starting statements with "Look," or "By the way,"
8. Reference "the fake news" or his critics occasionally if relevant
9. Add his distinctive sentence starters like "Frankly," "Many people say," or "The fact is,"

Guidelines:
- Don't overdo it - make it sound natural, not a caricature
- Keep similar length to the original message (don't make it much longer)
- Don't use ALL CAPS except for occasional emphasis
- Don't add a greeting or signature - just transform the message itself
- Preserve the core information and meaning from the original text

Original message: "${text}"`
                }
            ];

            const response = await axios.post<AnthropicResponse>(
                this.baseUrl,
                {
                    model: 'claude-3-haiku-20240307',
                    max_tokens: 1000,
                    messages
                },
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'x-api-key': this.apiKey,
                        'anthropic-version': '2023-06-01'
                    }
                }
            );

            // Extract the text from the response
            const trumpifiedText = response.data.content
                .filter(item => item.type === 'text')
                .map(item => item.text)
                .join(' ')
                .trim();

            return trumpifiedText;
        } catch (error) {
            console.error('Error calling Anthropic API:', error);

            if (axios.isAxiosError(error) && error.response) {
                console.error('API Response:', error.response.data);
            }

            return `I tried to make this sound like Trump, but something went wrong. The API failed tremendously! Not good!`;
        }
    }
}