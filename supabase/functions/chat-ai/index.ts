
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.5.0';

const OPENAI_API_KEY = Deno.env.get('OPENAI_API_KEY') || "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";

serve(async (req: Request) => {
  try {
    const { message, conversationHistory, hasImage, imageData } = await req.json();
    
    console.log("Processing request with message:", message.substring(0, 50) + "...");
    if (hasImage) console.log("Request includes an image");

    // Prepare the messages array for the API
    const messages = conversationHistory.map((msg: any) => ({
      role: msg.type === 'user' ? 'user' : 'assistant',
      content: msg.content,
    }));

    // Add the new message
    messages.push({
      role: 'user',
      content: hasImage 
        ? [
            { type: "text", text: message },
            { type: "image_url", image_url: { url: imageData } }
          ]
        : message,
    });

    console.log(`Sending ${messages.length} messages to OpenAI API`);

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: hasImage ? 'gpt-4o' : 'gpt-4o',
        messages,
        temperature: 0.7,
        max_tokens: 2000,
        top_p: 1,
        frequency_penalty: 0,
        presence_penalty: 0,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      console.error('OpenAI API error:', error);
      throw new Error(`OpenAI API error: ${error.error?.message || 'Unknown error'}`);
    }

    const responseData = await response.json();
    console.log('OpenAI response received successfully');

    return new Response(
      JSON.stringify({
        success: true,
        response: responseData.choices[0].message.content,
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in chat-ai function:', error.message);
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message,
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});
