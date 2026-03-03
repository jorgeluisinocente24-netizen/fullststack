// api/track.js
import { createClient } from '@supabase/supabase-js';

export default async function handler(req, res) {
  // --- 1. CONFIGURACIÓN SUPABASE ---
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );

  // --- 2. OBTENER DATOS DE LA PETICIÓN ---
  const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'unknown';
  const userAgent = req.headers['user-agent'] || 'unknown';
  const destino = req.query.url || 'https://google.com';
  const fecha = new Date().toISOString();

  // --- 3. GUARDAR EN SUPABASE ---
  try {
    await supabase.from('tracking_logs').insert([
      {
        ip_address: ip,
        user_agent: userAgent,
        destination_url: destino,
        captured_at: fecha
      }
    ]);
  } catch (error) {
    console.error('Error guardando en Supabase:', error.message);
  }

  // --- 4. REDIRIGIR AL DESTINO FINAL ---
  res.redirect(destino);
}
