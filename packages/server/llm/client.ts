import OpenAI from 'openai';
import { InferenceClient } from '@huggingface/inference';
import summarizePrompt from './prompts/summarize-review.txt';
const inferenceClient = new InferenceClient(process.env.HF_TOKEN);

const client = new OpenAI({
   apiKey: process.env.OPENAI_API_KEY,
});

type GenerateTextoptions = {
   model?: string;
   prompt: string;
   instructions?: string;
   temperature?: number;
   maxTokens?: number;
   previousResponseId?: string;
};

type GenerateTextResult = {
   id: string;
   text: string;
};

export const llmClient = {
   async generateText({
      model = 'gpt-4.1',
      prompt,
      instructions,
      temperature = 0.2,
      previousResponseId,
      maxTokens = 300,
   }: GenerateTextoptions): Promise<GenerateTextResult> {
      const response = await client.responses.create({
         model,
         input: prompt,
         instructions,
         temperature,
         previous_response_id: previousResponseId,
         max_output_tokens: maxTokens,
      });
      return {
         id: response.id,
         text: response.output_text,
      };
   },
   async summarizeReviews(reviews: string) {
      const chatCompletion = await inferenceClient.chatCompletion({
         provider: 'sambanova',
         model: 'meta-llama/Llama-3.1-8B-Instruct',

         messages: [
            {
               role: 'system',
               content: summarizePrompt,
            },
            {
               role: 'user',
               content: reviews,
            },
         ],
      });
      return chatCompletion.choices[0]?.message.content || '';
   },
};
