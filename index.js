import { createClient } from '@supabase/supabase-js';

// Supabase configuration using environment variables


async function pingGarden(env) {
    const supabaseUrl = env.SUPABASE_URL;
    const supabaseAnonKey = env.SUPABASE_KEY; // Set in Cloudflare Workers environment variables
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const { data, error } = await supabase
        .from('garden').select()

    if (error) {
        console.error('Error inserting data:', error);
        return;
    }

    if (data) {
        console.log('Inserted data:', data);
    } else {
        console.log('No data returned, but no error encountered. Check table configuration.');
    }
    return new Response("Hello from Gleam!", {
        headers: { "Content-Type": "text/plain" },
      });
}


export default {
    async scheduled(event, env, ctx) {
      console.log("cron processed");
      console.log(event)
    console.log(env)
      //await pingGarden(env);
      ctx.waitUntil(pingGarden(env));
    },
  };


addEventListener('scheduled', event => {
    event.waitUntil(pingGarden(event.env));
  });

  addEventListener("fetch", event => {
    event.respondWith(pingGarden(event));
  });
  