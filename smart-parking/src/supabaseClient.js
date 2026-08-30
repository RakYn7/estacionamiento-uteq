import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://xpqfbegmspildvauinlh.supabase.co'
const supabaseAnonKey = 'sb_publishable_yxLTg9L913FIyF2r015oig_7ksmXC3A'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)