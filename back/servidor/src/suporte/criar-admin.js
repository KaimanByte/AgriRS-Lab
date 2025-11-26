/**
 * Script interativo para criar usuário admin
 * Execute: node src/suporte/criar-admin.js
 */

import bcrypt from 'bcryptjs';
import pool from '../controladores/bd.js';
import dotenv from 'dotenv';
import readline from 'readline';

dotenv.config();

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function pergunta(query) {
  return new Promise(resolve => rl.question(query, resolve));
}

async function criarAdmin() {
  console.log('\n🔐 Criação de Usuário Admin\n');

  try {
    // Verifica se a tabela existe
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'tb_adm'
      );
    `);

    if (!tableCheck.rows[0].exists) {
      console.log('⚠️  Tabela tb_adm não existe. Criando...\n');
      await pool.query(`
        CREATE TABLE tb_adm (
          id_adm SERIAL PRIMARY KEY,
          login VARCHAR(100) UNIQUE NOT NULL,
          senha VARCHAR(255) NOT NULL,
          criado_em TIMESTAMP DEFAULT NOW()
        );
      `);
      console.log('✅ Tabela tb_adm criada com sucesso!\n');
    }

    // Solicita dados do admin
    const login = await pergunta('Digite o login do admin: ');
    
    if (login.trim().length < 3) {
      console.log('\n❌ Login deve ter no mínimo 3 caracteres\n');
      rl.close();
      await pool.end();
      return;
    }

    const senha = await pergunta('Digite a senha (mínimo 6 caracteres): ');
    
    if (senha.length < 6) {
      console.log('\n❌ Senha deve ter no mínimo 6 caracteres\n');
      rl.close();
      await pool.end();
      return;
    }

    // Verifica se login já existe
    const existeResult = await pool.query(
      'SELECT id_adm FROM tb_adm WHERE login = $1',
      [login.trim()]
    );

    if (existeResult.rows.length > 0) {
      console.log('\n❌ Este login já existe!\n');
      rl.close();
      await pool.end();
      return;
    }

    // Hash da senha
    console.log('\n⏳ Criando hash da senha...');
    const senhaHash = await bcrypt.hash(senha, 10);

    // Insere no banco
    const result = await pool.query(
      'INSERT INTO tb_adm (login, senha) VALUES ($1, $2) RETURNING id_adm, login',
      [login.trim(), senhaHash]
    );

    console.log('\n✅ Admin criado com sucesso!');
    console.log(`   ID: ${result.rows[0].id_adm}`);
    console.log(`   Login: ${result.rows[0].login}`);

  } catch (error) {
    console.error('\n❌ Erro ao criar admin:', error.message, '\n');
  } finally {
    rl.close();
    await pool.end();
  }
}

criarAdmin();