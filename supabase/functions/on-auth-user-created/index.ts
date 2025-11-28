import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabaseUrl = Deno.env.get('SUPABASE_URL')
const supabaseSecretKey = Deno.env.get('SUPABASE_SECRET_KEY')

const supabase = createClient(supabaseUrl!, supabaseSecretKey!)

serve(async (req: Request) => {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 })
  }

  try {
    const { data } = await req.json()

    if (!data?.user?.id || !data?.user?.email) {
      return new Response('Invalid user data', { status: 400 })
    }

    const { error } = await supabase.from('profiles').insert({
      id: data.user.id,
      email: data.user.email,
      displayName: data.user.user_metadata?.full_name || null,
      avatarUrl: data.user.user_metadata?.avatar_url || null,
    })

    if (error) {
      console.error('Profile insert error:', error)
      return new Response(JSON.stringify({ error: error.message }), {
        status: 400,
      })
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 201,
    })
  } catch (err) {
    console.error('Function error:', err)
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
    })
  }
})
