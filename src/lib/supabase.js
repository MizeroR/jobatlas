import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://alasnuzhfaongskteymm.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFsYXNudXpoZmFvbmdza3RleW1tIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcwMDI5OTgsImV4cCI6MjA3MjU3ODk5OH0.xDD9yBNi7M-F8HFWfnl7v1afRwKU966faxm2xcIStBo'

export const supabase = createClient(supabaseUrl, supabaseKey)