interface RateLimitEntry {
  count: number;
  resetTime: number;
}

// Rate limiting simples em memória para desenvolvimento
// Em produção, use Redis ou serviço similar
const rateLimitStore = new Map<string, RateLimitEntry>();

export interface RateLimitConfig {
  windowMs: number; // Janela de tempo em milissegundos
  maxRequests: number; // Máximo de requisições por janela
  message?: string; // Mensagem de erro personalizada
}

export function createRateLimit(config: RateLimitConfig) {
  return {
    config,
    check: (identifier: string): { success: boolean; resetTime?: number; remaining?: number } => {
      const now = Date.now();
      const key = identifier;
      const existing = rateLimitStore.get(key);

      // Limpar entradas expiradas periodicamente
      if (Math.random() < 0.01) { // 1% de chance de limpar
        cleanupExpiredEntries();
      }

      if (!existing || now > existing.resetTime) {
        // Nova entrada ou entrada expirada
        const newEntry: RateLimitEntry = {
          count: 1,
          resetTime: now + config.windowMs,
        };
        rateLimitStore.set(key, newEntry);
        
        return {
          success: true,
          resetTime: newEntry.resetTime,
          remaining: config.maxRequests - 1,
        };
      }

      if (existing.count >= config.maxRequests) {
        return {
          success: false,
          resetTime: existing.resetTime,
          remaining: 0,
        };
      }

      // Incrementar contador
      existing.count++;
      rateLimitStore.set(key, existing);

      return {
        success: true,
        resetTime: existing.resetTime,
        remaining: config.maxRequests - existing.count,
      };
    },
    
    reset: (identifier: string): void => {
      rateLimitStore.delete(identifier);
    },
    
    getRemaining: (identifier: string): number => {
      const entry = rateLimitStore.get(identifier);
      if (!entry || Date.now() > entry.resetTime) {
        return config.maxRequests;
      }
      return Math.max(0, config.maxRequests - entry.count);
    },
  };
}

// Configurações pré-definidas
export const authRateLimit = createRateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  maxRequests: 5, // 5 tentativas de login
  message: "Muitas tentativas de login. Tente novamente em 15 minutos.",
});

export const registerRateLimit = createRateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  maxRequests: 3, // 3 tentativas de registro
  message: "Muitas tentativas de registro. Tente novamente em 1 hora.",
});

export const passwordChangeRateLimit = createRateLimit({
  windowMs: 60 * 60 * 1000, // 1 hora
  maxRequests: 5, // 5 mudanças de senha
  message: "Muitas mudanças de senha. Tente novamente em 1 hora.",
});

export const generalApiRateLimit = createRateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  maxRequests: 100, // 100 requisições gerais
  message: "Muitas requisições. Reduza o ritmo e tente novamente.",
});

function cleanupExpiredEntries(): void {
  const now = Date.now();
  for (const [key, entry] of rateLimitStore.entries()) {
    if (now > entry.resetTime) {
      rateLimitStore.delete(key);
    }
  }
}

// Função para obter identificador único do cliente
export function getClientIdentifier(request: Request): string {
  // Tentar obter IP real
  const forwarded = request.headers.get('x-forwarded-for');
  const realIp = request.headers.get('x-real-ip');
  const ip = forwarded?.split(',')[0] || realIp || 'unknown';
  
  // Adicionar User-Agent para maior especificidade
  const userAgent = request.headers.get('user-agent') || 'unknown';
  
  // Criar hash simples do identificador
  return Buffer.from(`${ip}:${userAgent}`).toString('base64').substring(0, 32);
}

// Middleware helper para Next.js
export function checkRateLimit(
  rateLimit: ReturnType<typeof createRateLimit>,
  identifier: string
): { success: boolean; error?: string; headers?: Record<string, string> } {
  const result = rateLimit.check(identifier);
  
  if (!result.success) {
    return {
      success: false,
      error: rateLimit.config.message || "Rate limit exceeded",
      headers: {
        'X-RateLimit-Limit': rateLimit.config.maxRequests.toString(),
        'X-RateLimit-Remaining': '0',
        'X-RateLimit-Reset': result.resetTime?.toString() || '',
        'Retry-After': Math.ceil(((result.resetTime || 0) - Date.now()) / 1000).toString(),
      },
    };
  }
  
  return {
    success: true,
    headers: {
      'X-RateLimit-Limit': rateLimit.config.maxRequests.toString(),
      'X-RateLimit-Remaining': result.remaining?.toString() || '0',
      'X-RateLimit-Reset': result.resetTime?.toString() || '',
    },
  };
}
