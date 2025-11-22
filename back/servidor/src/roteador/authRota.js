import express from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import pool from '../controladores/bd.js';

const router = express.Router();

// Validação de entrada
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

// Rota de login
router.post('/login', validarLogin, async (req, res) => {
  const { login, senha } = req.body;

  console.log('\n🔐 === TENTATIVA DE LOGIN ===');
  console.log('Login recebido:', login);
  console.log('Senha recebida:', senha);
  console.log('Login normalizado:', login.trim());

  try {
    // Busca usuário no banco
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

    // Gera token JWT
    const token = jwt.sign(
      { 
        id: usuario.id_adm,
        login: usuario.login 
      }, 
      process.env.JWT_SECRET, 
      { expiresIn: '8h' }
    );

    console.log('✅ Token gerado:', token.substring(0, 50) + '...');
    console.log('🎉 LOGIN BEM-SUCEDIDO!\n');

    res.json({ 
      token,
      login: usuario.login 
    });

  } catch (err) {
    console.error('❌ ERRO NO LOGIN:', err);
    res.status(500).json({ 
      message: 'Erro ao processar login' 
    });
  }
});

// Rota para criar/atualizar usuário admin (protegida)
router.post('/criar-admin', async (req, res) => {
  const { login, senha } = req.body;

  if (!login || !senha) {
    return res.status(400).json({ 
      message: 'Login e senha são obrigatórios' 
    });
  }

  try {
    // Hash da senha com bcrypt
    const senhaHash = await bcrypt.hash(senha, 10);

    const result = await pool.query(
    'INSERT INTO tb_adm (login, senha) VALUES ($1, $2) RETURNING id_adm, login',
    [login.trim(), senhaHash]  // ✅ Mantém maiúsculas/minúsculas
    );

    res.status(201).json({ 
      message: 'Admin criado com sucesso',
      admin: result.rows[0]
    });

  } catch (err) {
    if (err.code === '23505') { // duplicate key
      return res.status(409).json({ 
        message: 'Login já existe' 
      });
    }
    console.error('Erro ao criar admin:', err);
    res.status(500).json({ 
      message: 'Erro ao criar admin' 
    });
  }
});

// Rota para verificar se token é válido
router.get('/verificar', (req, res) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(403).json({ valido: false });
  }

  const token = authHeader.split(' ')[1];

  try {
    jwt.verify(token, process.env.JWT_SECRET);
    res.json({ valido: true });
  } catch (err) {
    res.status(401).json({ valido: false });
  }
});

export default router;