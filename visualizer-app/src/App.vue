<template>
  <div id="app">
    <NavBar v-if="!hideNavbar" />
    <main class="main-content" :class="{ 'full-height': hideNavbar }">
      <router-view />
    </main>
    <RodapeComp v-if="!hideNavbar" />
  </div>
</template>

<script>
/**
 * Componente raiz da aplicação
 * 
 * Responsável pela estrutura principal da aplicação, incluindo:
 * - Navbar (barra de navegação superior)
 * - Área de conteúdo principal (router-view)
 * - Rodapé
 * 
 * A navbar e rodapé são ocultados em páginas específicas (ex: login)
 * através da propriedade meta.hideNavbar nas rotas.
 */
import NavBar from './components/NavBar.vue'
import RodapeComp from './components/RodapeComp.vue'

export default {
  name: 'App',

  components: {
    NavBar,
    RodapeComp,
  },
  computed: {
    /**
     * Determina se a navbar e rodapé devem ser ocultados
     * Verifica a propriedade meta.hideNavbar da rota atual
     * 
     * @returns {boolean} true se a navbar deve ser ocultada
     */
    hideNavbar() {
      return this.$route.meta.hideNavbar
    },
  },
}
</script>

<style scoped>
html,
body {
  height: 100%;
}

#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
}

.main-content.full-height {
  min-height: 100vh;
}
</style>
