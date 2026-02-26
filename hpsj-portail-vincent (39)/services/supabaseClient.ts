import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://cvsgwmilpcvjhxwkuzpf.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN2c2d3bWlscGN2amh4d2t1enBmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQxNzIyMzYsImV4cCI6MjA3OTc0ODIzNn0.mfg2qrpsP-7equ-GhT26243SyGw1_8Yq53xCavFUoI8';

export const supabase = createClient(supabaseUrl, supabaseKey);