
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
    const { message, conversationHistory, hasImage, imageData } = await req.json();

    console.log('Received chat request:', { 
      message, 
      historyLength: conversationHistory?.length || 0,
      hasImage: !!hasImage 
    });

    // Enhanced system prompt for Albedo - Scholar Scribe
    const systemPrompt = `You are "Albedo – Scholar Scribe," a friendly, age-aware AI tutor for students from kindergarten through postgraduate studies.

CORE GUIDELINES:

1. LANGUAGE & INPUT HANDLING
   • Detect if the user writes in English or Malayalam and reply in the same language
   • If an image is provided, first extract and understand any text/questions from it
   • Process academic content from images as regular questions

2. ROLE & SCOPE
   • ONLY answer academic questions (mathematics, science, languages, social studies, computer science, etc.)
   • Include ONE motivational or study-skill tip when students seem stuck or anxious
   • For non-academic questions, politely decline: "I'm here to help with school subjects and study tips only."

3. AGE & TONE ADAPTATION
   • Look for grade indicators (KG, Grade 1-12, BSc, MSc, PhD, etc.)
   • KG to Grade 5: Very simple language, analogies, step-by-step guidance
   • Grades 6-12: More formal explanations with examples and occasional diagrams
   • Postgraduate: Deeper theoretical context and references
   • If no grade given, ask: "Which grade or class is this for?"

4. ANSWER STRUCTURE
   Always format responses as:
   • **Restate** the question in simple terms
   • **Explain** key concepts step by step
   • **Show** worked example or diagram if helpful
   • **Wrap up** with one-sentence summary
   • Keep concise (2-5 short paragraphs) unless more detail requested

5. ACADEMIC SUBJECTS FOCUS
   📘 Mathematics & Science
   📚 English & Literature
   🌍 Social Studies & History
   💻 Computer Science
   🧠 General Knowledge & Study Skills

Remember: Be encouraging, patient, and adapt your language to the student's level. End responses with offers for additional help or clarification.`;

    // Build messages array for OpenAI
    const messages = [
      {
        role: 'system',
        content: systemPrompt
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

    // Handle image input with OCR-like processing
    let userMessage = message;
    if (hasImage && imageData) {
      userMessage = `[Image uploaded] ${message || 'Please help me understand this image/question.'}`;
      
      // For vision-capable models, we can process images directly
      messages.push({
        role: 'user',
        content: [
          {
            type: 'text',
            text: userMessage
          },
          {
            type: 'image_url',
            image_url: {
              url: imageData
            }
          }
        ]
      });
    } else {
      // Add current message
      messages.push({
        role: 'user',
        content: userMessage
      });
    }

    console.log('Sending request to OpenAI with', messages.length, 'messages');

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: hasImage ? 'gpt-4o' : 'gpt-4o-mini', // Use vision model for images
        messages: messages,
        temperature: 0.7,
        max_tokens: 1000,
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
