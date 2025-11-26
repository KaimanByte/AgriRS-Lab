import jwt from 'jsonwebtoken';

// Chave secreta (deve estar no .env)
const JWT_SECRET = process.env.JWT_SECRET || 'sua_chave_secreta_aqui_mude_em_producao';

/**
 * Gera um token JWT com os dados do usuário
 * @param {Object} payload - Dados a serem codificados no token
 * @param {string} expiresIn - Tempo de expiração (padrão: 24h)
 * @returns {string} Token JWT
 */
export const gerarToken = (payload, expiresIn = '24h') => {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
};

/**
 * Middleware para verificar token JWT
 * Verifica se o token está presente e válido
 */
export const verificarToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  console.log('🔐 Verificando token...');
  console.log('Authorization header:', authHeader);

  if (!authHeader) {
    console.log('❌ Token não fornecido');
    return res.status(403).json({ 
      message: 'Token não fornecido',
      autenticado: false
    });
  }

  // Formato esperado: "Bearer TOKEN"
  const parts = authHeader.split(' ');
  
  if (parts.length !== 2 || parts[0] !== 'Bearer') {
    console.log('❌ Formato de token inválido');
    return res.status(403).json({ 
      message: 'Formato de token inválido',
      autenticado: false
    });
  }

  const token = parts[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log('✅ Token válido:', decoded);
    
    // Adiciona os dados do usuário na requisição
    req.usuario = decoded;
    req.user = decoded; // compatibilidade
    
    next();
  } catch (err) {
    console.log('❌ Token inválido:', err.message);
    
    if (err.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        message: 'Token expirado',
        autenticado: false
      });
    }
    
    res.status(401).json({ 
      message: 'Token inválido',
      autenticado: false
    });
  }
};

/**
 * Middleware de autenticação (alias para verificarToken)
 * Mantido para compatibilidade com código antigo
 */
export const autenticarJWT = verificarToken;

// Export default para compatibilidade
export default verificarToken;