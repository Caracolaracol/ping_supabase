import { createClient } from '@supabase/supabase-js';

// Supabase configuration using environment variables


async function insertRandomNumber(env) {
    const supabaseUrl = env.SUPABASE_URL;
    const supabaseAnonKey = env.SUPABASE_KEY; // Set in Cloudflare Workers environment variables
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey);
    const randomNumber = Math.floor(Math.random() * 1000);

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
}



addEventListener('scheduled', event => {
    event.waitUntil(insertRandomNumber(event.env));
  });