<template>
  <nav id="nav">
    <div class="nav-title">
      <h1>Inside Airbnb Visualizer</h1>
      <p class="subtitle">Bem vindo, {{ user }}</p>
    </div>
    <div class="nav-links">
      <router-link to="/inicio">Início</router-link>
      <router-link to="/comparar">Comparar</router-link>
      <router-link to="/analise">Análise</router-link>
      <router-link to="/mapa">Mapa</router-link>
      <router-link to="/sobre">Sobre</router-link>
    </div>
  </nav>
</template>

<script>
  /**
   * Barra de navegação principal da aplicação
   * 
   * Exibe o título da aplicação, uma saudação ao utilizador e links de navegação.
   * Os links incluem:
   * - Início: Visão geral da aplicação
   * - Comparar: Comparação entre cidades
   * - Análise: Análise detalhada de uma cidade
   * - Mapa: Visualização de anomalias no mapa
   * - Sobre: Informações do projeto
   * 
   * @component
   */
  export default {
    name: 'NavBar',
    computed: {
      /**
       * Obtém o nome do utilizador autenticado do localStorage
       * @returns {string} Nome do utilizador
       */
      user() {
        const user = JSON.parse(localStorage.getItem('user'))
        return user.nome
      },
    },
  }
</script>

<style scoped>
#nav {
  background-color: var(--collor-airbnb);
  padding: 1.5rem 3rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.nav-title h1 {
  color: white;
  font-size: 1.6rem;
  font-weight: 600;
  margin: 0;
  margin-bottom: 0.25rem;
}

.subtitle {
  color: white;
  font-size: 1.2rem;
  margin: 0;
  opacity: 0.95;
  font-weight: 300;
}

.nav-links {
  display: flex;
  gap: 2.5rem;
  align-items: center;
}

.nav-links a {
  color: white;
  text-decoration: none;
  font-size: 1.1rem;
  font-weight: 400;
  transition: all 0.3s ease;
  padding: 0.5rem 0;
  border-bottom: 2px solid transparent;
}

.nav-links a:hover {
  opacity: 0.8;
  border-bottom: 2px solid white;
}

.nav-links a.router-link-active {
  font-weight: 600;
  border-bottom: 2px solid white;
}
</style>
