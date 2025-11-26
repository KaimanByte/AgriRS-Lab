import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import pool from '../controladores/bd.js'; // Atualizado para usar o path correto
import { verificarToken, gerarToken } from '../middleware/auth.js'; // Importar funções do middleware

const router = express.Router();

// ============================================
// VALIDAÇÃO DE ENTRADA
// ============================================
const validarLogin = (req, res, next) => {
  const { login, senha } = req.body;

  console.log('📥 Validação - Dados recebidos:', { login, senha: '***' });

  if (!login || !senha) {
    console.log('❌ Validação falhou: campos vazios');
    return res.status(400).json({ 
      message: 'Login e senha são obrigatórios' 
    });
  }

  if (typeof login !== 'string' || typeof senha !== 'string') {
    console.log('❌ Validação falhou: tipo inválido');
    return res.status(400).json({ 
      message: 'Formato inválido de dados' 
    });
  }

  if (login.trim().length < 3) {
    console.log('❌ Validação falhou: login muito curto');
    return res.status(400).json({ 
      message: 'Login deve ter no mínimo 3 caracteres' 
    });
  }

  if (senha.length < 6) {
    console.log('❌ Validação falhou: senha muito curta');
    return res.status(400).json({ 
      message: 'Senha deve ter no mínimo 6 caracteres' 
    });
  }

  console.log('✅ Validação passou');
  next();
};

// ============================================
// ROTA DE LOGIN
// ============================================
router.post('/login', validarLogin, async (req, res) => {
  const { login, senha } = req.body;

  console.log('\n🔐 === TENTATIVA DE LOGIN ===');
  console.log('Login recebido:', login);
  console.log('Senha recebida:', senha);
  console.log('Login normalizado:', login.trim());

  try {
    // Busca usuário no banco (mantendo sua tabela tb_adm)
    const result = await pool.query(
      'SELECT * FROM tb_adm WHERE login = $1', 
      [login.trim()]
    );

    console.log('🔍 Usuários encontrados:', result.rows.length);

    // Usuário não encontrado
    if (result.rows.length === 0) {
      console.log('❌ Usuário não existe no banco');
      return res.status(401).json({ 
        message: 'Login ou senha inválidos' 
      });
    }

    const usuario = result.rows[0];
    console.log('👤 Usuário encontrado:', usuario.login);
    console.log('🔑 Hash no banco:', usuario.senha);
    console.log('🔍 É hash bcrypt?', usuario.senha.startsWith('$2'));

    // Verifica se a senha está em hash (bcrypt) ou texto plano
    let senhaValida;
    if (usuario.senha.startsWith('$2')) {
      console.log('⏳ Comparando com bcrypt...');
      senhaValida = await bcrypt.compare(senha, usuario.senha);
      console.log('✅ Resultado bcrypt:', senhaValida);
    } else {
      console.log('⚠️  Comparando texto plano (não deveria acontecer)');
      senhaValida = senha === usuario.senha;
      console.log('✅ Resultado texto plano:', senhaValida);
    }

    if (!senhaValida) {
      console.log('❌ Senha incorreta!');
      return res.status(401).json({ 
        message: 'Login ou senha inválidos' 
      });
    }

    console.log('✅ Senha correta!');
    console.log('🎫 Gerando token JWT...');

    // Usa a função gerarToken do middleware (padronizado)
    const token = gerarToken({
      id: usuario.id_adm,
      idusuario: usuario.id_adm, // compatibilidade
      login: usuario.login,
      nivel: 'admin'
    });

    console.log('✅ Token gerado:', token.substring(0, 50) + '...');
    console.log('🎉 LOGIN BEM-SUCEDIDO!\n');

    // Resposta compatível com seu sistema atual
    res.json({ 
      message: 'Login realizado com sucesso',
      token,
      login: usuario.login,
      usuario: {
        id: usuario.id_adm,
        login: usuario.login
      }
    });

  } catch (err) {
    console.error('❌ ERRO NO LOGIN:', err);
    res.status(500).json({ 
      message: 'Erro ao processar login' 
    });
  }
});

// ============================================
// ROTA PARA CRIAR ADMIN
// ============================================
router.post('/criar-admin', async (req, res) => {
  const { login, senha } = req.body;

  console.log('👤 Tentando criar admin:', login);

  if (!login || !senha) {
    return res.status(400).json({ 
      message: 'Login e senha são obrigatórios' 
    });
  }

  if (login.trim().length < 3) {
    return res.status(400).json({ 
      message: 'Login deve ter no mínimo 3 caracteres' 
    });
  }

  if (senha.length < 6) {
    return res.status(400).json({ 
      message: 'Senha deve ter no mínimo 6 caracteres' 
    });
  }

  try {
    // Hash da senha com bcrypt
    const senhaHash = await bcrypt.hash(senha, 10);
    console.log('🔒 Senha hasheada com sucesso');

    const result = await pool.query(
      'INSERT INTO tb_adm (login, senha) VALUES ($1, $2) RETURNING id_adm, login',
      [login.trim(), senhaHash]
    );

    console.log('✅ Admin criado:', result.rows[0]);

    res.status(201).json({ 
      message: 'Admin criado com sucesso',
      admin: result.rows[0]
    });

  } catch (err) {
    if (err.code === '23505') { // duplicate key
      console.log('⚠️  Login já existe');
      return res.status(409).json({ 
        message: 'Login já existe' 
      });
    }
    console.error('❌ Erro ao criar admin:', err);
    res.status(500).json({ 
      message: 'Erro ao criar admin' 
    });
  }
});

// ============================================
// ROTA PARA VERIFICAR TOKEN (melhorada)
// ============================================
router.get('/verificar', verificarToken, (req, res) => {
  // Se chegou aqui, o token é válido (middleware verificou)
  res.json({ 
    valido: true,
    autenticado: true,
    usuario: req.usuario // Dados do usuário do token
  });
});

// ============================================
// ROTA DE LOGOUT (opcional)
// ============================================
router.post('/logout', (req, res) => {
  // No caso de JWT, o logout é feito no cliente removendo o token
  res.json({ 
    message: 'Logout realizado com sucesso' 
  });
});

// ============================================
// ROTA PARA LISTAR ADMINS (protegida, debug)
// ============================================
router.get('/admins', verificarToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id_adm, login FROM tb_adm ORDER BY id_adm'
    );
    
    res.json({ 
      admins: result.rows,
      total: result.rows.length
    });
  } catch (err) {
    console.error('Erro ao listar admins:', err);
    res.status(500).json({ 
      message: 'Erro ao listar admins' 
    });
  }
});

export default router;