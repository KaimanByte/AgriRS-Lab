/**
 * Script para migrar senhas de texto plano para bcrypt
 * Execute: node src/suporte/migrar-senhas.js
 */

import bcrypt from 'bcryptjs';
import pool from '../controladores/bd.js';
import dotenv from 'dotenv';

dotenv.config();

async function migrarSenhas() {
  console.log('🔐 Iniciando migração de senhas...\n');

  try {
    // Busca todos os usuários
    const result = await pool.query('SELECT id_adm, login, senha FROM tb_adm');
    
    if (result.rows.length === 0) {
      console.log('⚠️  Nenhum usuário encontrado na tabela tb_adm');
      console.log('💡 Crie um usuário admin primeiro usando a rota POST /auth/criar-admin\n');
      return;
    }

    let migrados = 0;
    let jaHasheados = 0;

    for (const usuario of result.rows) {
      // Verifica se já está em bcrypt (começa com $2)
      if (usuario.senha.startsWith('$2')) {
        console.log(`✓ ${usuario.login} - Já possui hash bcrypt`);
        jaHasheados++;
        continue;
      }

      // Cria hash da senha
      const senhaHash = await bcrypt.hash(usuario.senha, 10);

      // Atualiza no banco
      await pool.query(
        'UPDATE tb_adm SET senha = $1 WHERE id_adm = $2',
        [senhaHash, usuario.id_adm]
      );

      console.log(`✓ ${usuario.login} - Senha migrada com sucesso`);
      migrados++;
    }

    console.log('\n📊 Resumo da migração:');
    console.log(`   Total de usuários: ${result.rows.length}`);
    console.log(`   Migrados agora: ${migrados}`);
    console.log(`   Já estavam hasheados: ${jaHasheados}`);
    console.log('\n✅ Migração concluída!\n');

  } catch (error) {
    console.error('❌ Erro na migração:', error.message);
    process.exit(1);
  } finally {
    await pool.end();
  }
}

// Executa a migração
migrarSenhas();