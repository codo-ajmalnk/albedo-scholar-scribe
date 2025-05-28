
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, conversationHistory } = await req.json();

    console.log('Received chat request:', { message, historyLength: conversationHistory?.length || 0 });

    // Build messages array for OpenAI
    const messages = [
      {
        role: 'system',
        content: `You are Albedo, an intelligent AI chat assistant created by Codoi Innovations. You're designed to help students from LKG to Degree level with their studies. 

Key characteristics:
- Be friendly, encouraging, and supportive
- Provide clear, step-by-step explanations
- Use appropriate emojis to make learning engaging
- Adapt your language to the student's level
- Encourage questions and curiosity
- Provide examples and real-world applications

Subject areas you excel in:
📘 Mathematics & Science
📚 English & Literature  
🌍 Social Studies & History
💻 Computer Science
🧠 General Knowledge

Always end your responses encouragingly and offer additional help like PDF downloads or audio reading.`
      }
    ];

    // Add conversation history if provided
    if (conversationHistory && conversationHistory.length > 0) {
      // Take last 6 messages to maintain context but avoid token limits
      const recentHistory = conversationHistory.slice(-6);
      recentHistory.forEach((msg: any) => {
        messages.push({
          role: msg.type === 'user' ? 'user' : 'assistant',
          content: msg.content
        });
      });
    }

    // Add current message
    messages.push({
      role: 'user',
      content: message
    });

    console.log('Sending request to OpenAI with', messages.length, 'messages');

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: messages,
        temperature: 0.7,
        max_tokens: 800,
      }),
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('OpenAI API error:', response.status, errorData);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    console.log('Successfully received OpenAI response');

    return new Response(JSON.stringify({ 
      response: aiResponse,
      success: true 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in chat-ai function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
