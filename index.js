import { createClient } from '@supabase/supabase-js';

// Supabase configuration using environment variables
const supabaseUrl = SUPABASE_URL;
const supabaseAnonKey = SUPABASE_KEY; // Set in Cloudflare Workers environment variables

const supabase = createClient(supabaseUrl, supabaseAnonKey);


async function insertRandomNumber() {
    const randomNumber = Math.floor(Math.random() * 1000);

    const { data, error } = await supabase
        .from('random_numbers')
        .insert([{ number: randomNumber }])
        .select();

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

insertRandomNumber();

