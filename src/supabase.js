import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://quzrpdkoytvgzecknwfi.supabase.co'
const supabasePublishableKey = 'sb_publishable_-rrirHchT1Kx1Sx4IOlJGQ_aBYYnKFf'

export const supabase = createClient(
  supabaseUrl,
  supabasePublishableKey
)
