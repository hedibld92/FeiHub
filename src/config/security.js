export const securityConfig = {
  // Paramètres de chiffrement
  encryption: {
    algorithm: 'AES-256-GCM',
    keyLength: 256,
    ivLength: 12,
    saltLength: 16,
    iterations: 100000,
  },
  
  // Paramètres de session
  session: {
    maxAge: 3600, // 1 heure
    renewThreshold: 300, // Renouvellement 5 minutes avant expiration
    secure: true,
    sameSite: 'strict',
  },

  // Headers de sécurité
  headers: {
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Content-Security-Policy': process.env.NODE_ENV === 'development' 
      ? "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; connect-src 'self' https://rmqkkvuwwdvrnelnwxie.supabase.co; frame-ancestors 'none';"
      : "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self'; connect-src 'self' https://rmqkkvuwwdvrnelnwxie.supabase.co; frame-ancestors 'none';",
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'geolocation=(), camera=(), microphone=()'
  }
} 