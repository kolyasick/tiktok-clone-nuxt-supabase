
import { createClient } from '@supabase/supabase-js'

const bucketUrl = "https://insvrfswdpcvqeihnbup.supabase.co/storage/v1/s3/video-storage"
const supabaseUrl = "https://insvrfswdpcvqeihnbup.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imluc3ZyZnN3ZHBjdnFlaWhuYnVwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjIzNDM2MTEsImV4cCI6MjAzNzkxOTYxMX0.4dOaVl3sDNq1i9SRfbeJ79W91svvXXlW-eUUAscGqWM"
export const supabase = createClient(supabaseUrl, supabaseKey, bucketUrl)