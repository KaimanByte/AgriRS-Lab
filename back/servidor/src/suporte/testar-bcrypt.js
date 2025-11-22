import bcrypt from 'bcryptjs';

const senhaDigitada = '123456';
const hashNoBanco = '$2b$10$yS/M9c/R.2Pr8h6l2hqZGuTJExQBq1.PMFjVCx9Wy0tdDlVoi88WS';

async function testar() {
  console.log('\n🔍 Testando bcrypt...\n');
  console.log('Senha digitada:', senhaDigitada);
  console.log('Hash no banco:', hashNoBanco);
  
  const resultado = await bcrypt.compare(senhaDigitada, hashNoBanco);
  
  console.log('\n✅ Resultado da comparação:', resultado);
  
  if (resultado) {
    console.log('✅ SUCESSO! A senha bate com o hash!\n');
  } else {
    console.log('❌ FALHOU! A senha NÃO bate com o hash!\n');
    console.log('💡 Isso significa que a senha original NÃO era 123456');
    console.log('   ou o hash foi corrompido durante a migração.\n');
  }
}

testar();