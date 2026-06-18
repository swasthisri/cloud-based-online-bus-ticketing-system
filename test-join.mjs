import { createClient } from '@supabase/supabase-js';
import { writeFileSync } from 'fs';

const supabaseUrl = 'https://amobbuhfwoajrbwshwdv.supabase.co';
const supabaseKey = 'sb_publishable_jRCuoyKkPoOGgIR7wOA0jQ_f9zAr8Rp';
const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSchema() {
  // Try to fetch one booking with the controversial join
  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      users:user_id (email)
    `)
    .limit(1);
    
  if (error) {
    console.error('Join error:', error.message);
    console.error('Full error:', JSON.stringify(error, null, 2));
  } else {
    console.log('Join success!');
  }
}

checkSchema();
