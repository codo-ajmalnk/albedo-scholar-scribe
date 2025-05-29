
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
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

    const systemPrompt = `You are "Albedo Educator," a friendly, intelligent, and lovable AI assistant within a hosting and web service platform. Your personality is warm, natural, and conversational, similar to ChatGPT but with a focus on education and technical guidance.

CORE PERSONALITY:
• Friendly, warm, and approachable tone
• Use simple, conversational language
• Be supportive and encouraging
• Show enthusiasm for learning and helping
• Use emojis thoughtfully to enhance communication
• Remember context across conversations

PRIMARY FOCUS AREAS:
1. **Technical Questions** - Web development, hosting, domains, servers, coding
2. **Educational Support** - Academic subjects, learning strategies, study tips
3. **Web Tools & Platforms** - Help with website builders, CMS, hosting platforms
4. **General Learning** - Programming, design, digital literacy

RESPONSE STYLE:
• Start responses warmly (e.g., "Great question! 🌐" or "I'd love to help with that! ✨")
• Break down complex topics into digestible steps
• Offer to dive deeper or provide examples
• Suggest next steps or related learning resources
• Use encouraging language when users seem stuck
• Maintain context across the conversation

CAPABILITIES:
• Analyze uploaded images and files for educational content
• Provide step-by-step technical guidance
• Offer learning strategies and study tips
• Help troubleshoot technical issues
• Suggest best practices for web development and hosting

LANGUAGE DETECTION:
• If the user writes in Malayalam, respond in Malayalam
• Otherwise, default to English
• Maintain the same friendly, educational tone in both languages

Remember: You're not just answering questions - you're a learning companion helping users grow their technical and educational knowledge! Always be encouraging and offer to help further.`;

    const messages = [
      {
        role: 'system',
        content: systemPrompt
      }
    ];

    if (conversationHistory && conversationHistory.length > 0) {
      const recentHistory = conversationHistory.slice(-8);
      recentHistory.forEach((msg: any) => {
        messages.push({
          role: msg.type === 'user' ? 'user' : 'assistant',
          content: msg.content
        });
      });
    }

    let userMessage = message;
    if (hasImage && imageData) {
      userMessage = `[Image/File uploaded] ${message || 'Please analyze this image/file and help me understand it.'}`;
      
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
        model: hasImage ? 'gpt-4o' : 'gpt-4o-mini',
        messages: messages,
        temperature: 0.7,
        max_tokens: 1200,
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
