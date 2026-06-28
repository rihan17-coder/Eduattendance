import { createClient } from '@supabase/supabase-js';

// Fallback to the real EduAttendance Supabase credentials directly so it works out-of-the-box everywhere
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://cxqckhtnqkzmnlgnxshi.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN4cWNraHRucWt6bW5sZ254c2hpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI2NDg3NDYsImV4cCI6MjA5ODIyNDc0Nn0.qNZeJzqxEVFj_GarZD1AW-Op1X7M9aehMeSDylw9Qks';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
