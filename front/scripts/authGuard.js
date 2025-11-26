/**
 * AuthGuard - Sistema de Proteção de Páginas
 * Arquivo: /front/scripts/authGuard.js
 */

const AuthGuard = {
    API_URL: 'http://localhost:3030',
    
    // Obter token do localStorage
    getToken() {
      return localStorage.getItem('token');
    },
    
    // Salvar token
    setToken(token) {
      if (token) {
        localStorage.setItem('token', token);
      } else {
        localStorage.removeItem('token');
      }
    },
    
    // Obter dados do usuário
    getUsuario() {
      return localStorage.getItem('usuario');
    },
    
    // Salvar dados do usuário
    setUsuario(usuario) {
      if (usuario) {
        localStorage.setItem('usuario', usuario);
      } else {
        localStorage.removeItem('usuario');
      }
    },
    
    // Verificar se está autenticado
    async isAuthenticated() {
      const token = this.getToken();
      if (!token) {
        console.log('❌ [AuthGuard] Sem token no localStorage');
        return false;
      }
      
      try {
        console.log('🔍 [AuthGuard] Verificando token com o servidor...');
        const response = await fetch(`${this.API_URL}/auth/verificar`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        
        const data = await response.json();
        console.log('📡 [AuthGuard] Resposta do servidor:', data);
        
        return data.valido === true && data.autenticado === true;
      } catch (erro) {
        console.error('❌ [AuthGuard] Erro ao verificar autenticação:', erro);
        return false;
      }
    },
    
    // Proteger página atual
    async protectPage() {
      console.log('🔒 [AuthGuard] Protegendo página...');
      const authenticated = await this.isAuthenticated();
      
      if (!authenticated) {
        console.log('❌ [AuthGuard] Não autenticado - redirecionando para login');
        const currentPath = window.location.pathname;
        this.logout(currentPath);
      } else {
        console.log('✅ [AuthGuard] Acesso permitido');
      }
    },
    
    // Fazer logout
    logout(redirectTo = null) {
      console.log('🚪 [AuthGuard] Fazendo logout...');
      this.setToken(null);
      this.setUsuario(null);
      
      const redirect = redirectTo || window.location.pathname;
      window.location.href = `/login?redirect=${encodeURIComponent(redirect)}`;
    },
    
    // Navegar para uma rota
    navigateTo(rota) {
      window.location.href = rota;
    },
    
    // Fazer requisição autenticada
    async fetch(url, options = {}) {
      const token = this.getToken();
      
      const defaultOptions = {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        ...options
      };
      
      // Merge headers se options já tiver headers
      if (options.headers) {
        defaultOptions.headers = {
          ...defaultOptions.headers,
          ...options.headers
        };
      }
      
      try {
        const response = await fetch(url, defaultOptions);
        
        // Se não autorizado, fazer logout
        if (response.status === 401 || response.status === 403) {
          console.warn('⚠️ [AuthGuard] Sessão expirada ou sem permissão');
          this.logout();
          throw new Error('Sessão expirada. Faça login novamente.');
        }
        
        return response;
      } catch (erro) {
        console.error('❌ [AuthGuard] Erro na requisição:', erro);
        throw erro;
      }
    }
};

// Disponibilizar globalmente
if (typeof window !== 'undefined') {
  window.AuthGuard = AuthGuard;
}

// Export para usar em módulos
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AuthGuard;
}