import OpenAI from 'openai';

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
};
