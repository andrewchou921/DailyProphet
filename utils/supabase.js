import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://rdpufoepqoqjfuhtgaao.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJkcHVmb2VwcW9xamZ1aHRnYWFvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAxMjk2NjIsImV4cCI6MjA2NTcwNTY2Mn0.BJplPHAkGZZ56mRHYPlxriE4rlLvKlqrSlht0Y-DBDc'

export const supabase = createClient(supabaseUrl, supabaseKey)
