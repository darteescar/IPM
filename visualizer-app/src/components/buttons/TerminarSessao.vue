<template>
  <div class="terminar-sessao">
    <button @click="logout">
      Terminar sessão
      <span class="icon">⮕</span>
    </button>
  </div>
</template>

<script>
/**
 * Botão de terminar sessão
 * 
 * Permite ao utilizador fazer logout da aplicação.
 * Remove os dados do utilizador do localStorage e redireciona para a página de login.
 * 
 * @component
 * @example
 * <TerminarSessao />
 */
export default {
  name: 'TerminarSessao',
  methods: {
    /**
     * Executa o logout do utilizador
     * - Remove os dados do utilizador do localStorage
     * - Redireciona para a página de login
     */
    logout() {
      localStorage.removeItem('user')
      this.$router.push('/login')
    },
  },
}
</script>

<style scoped>
.terminar-sessao {
  display: flex;
  justify-content: flex-end;
  margin-top: 50px;
}

.terminar-sessao button {
  background-color: var(--collor-airbnb);
  color: white;
  border: none;
  padding: 10px 30px;
  border-radius: 50px;
  font-size: 1.3rem;
  font-weight: 500;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 15px;
  box-shadow: 0 4px 15px rgba(255, 107, 122, 0.4);
  transition: all 0.3s ease;
}

.terminar-sessao button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 107, 122, 0.6);
}

.terminar-sessao button:active {
  transform: translateY(0);
}

.icon {
  font-size: 1.5rem;
  font-weight: bold;
}
</style>
