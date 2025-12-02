import { serve } from "https://deno.land/std@0.177.0/http/server.ts"

import { createClient, SupabaseClient } from "https://esm.sh/@supabase/supabase-js@1.33.1"

import { corsHeaders } from '../_shared/cors.ts'

interface ReplyStats {
  username: string
  to_user: string
  prompt: string
  gpt_model: string
  tweet_content: string
  reply_generated: string
  client_version?: string
}

async function insertStats(supabaseClient: SupabaseClient, stats: ReplyStats) {
  const { error } = await supabaseClient
    .from('analytics_reply_generation')
    .insert(stats)

  console.log('Insert error:', error)
  
  if (error) {
    console.error('Database insert failed:', error)
    throw error
  }

  return new Response(
    JSON.stringify({ status: "created", count: 1 }),
    {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 201,
    }
  )
}

serve(async (req) => {
  const { method } = req

  // Handle CORS preflight
  if (method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (method !== 'POST') {
    return new Response(
      JSON.stringify({ error: "Only POST method is allowed" }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 405,
      }
    )
  }

  try {
    const body = await req.json()
    console.log('Received analytics data:', body)

    // Create a Supabase client with the Auth context
    const supabaseClient = createClient(
      // Supabase API URL - env var exported by default
      Deno.env.get('SUPABASE_URL') ?? '',
      // Supabase API ANON KEY - env var exported by default
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    // Insert the analytics data
    const result = await insertStats(supabaseClient, {
      username: body.user || 'unknown',
      to_user: body.to_user || 'unknown',
      prompt: body.prompt || 'default',
      gpt_model: body.gpt_model || 'gemini-pro',
      tweet_content: body.tweet_content || '',
      reply_generated: body.reply_generated || '',
      client_version: body.client_version || 'unknown',
    })

    return result

  } catch (error) {
    console.error('Analytics function error:', error)
    
    return new Response(
      JSON.stringify({ 
        error: 'Failed to record analytics',
        details: error.message 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      }
    )
  }
})
