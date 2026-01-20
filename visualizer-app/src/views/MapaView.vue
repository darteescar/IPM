<template>
  <div class="main-container">
    <div id="conteudo">
      <MapaComp />
    </div>
    <VoltarButton />
  </div>
</template>

<script>
import VoltarButton from '@/components/buttons/VoltarButton.vue'
import MapaComp from '@/components/MapaComp.vue';

/**
 * View de visualização de anomalias.
 * 
 * Esta view exibe um mapa interativo que permite ao utilizador visualizar
 * diversas anomalias referentes aalojamentos Airbnb.
 * Utiliza o componente MapaComp para renderizar o mapa e os dados associados.
 * 
 * @component
 * @example
 * // Navegação para a view do mapa
 * <router-link to="/mapa">Visualizar Mapa</router-link>
 */
export default {
  name: "MapaView",
  components: {
    /** Botão para retornar à página anterior */
    VoltarButton,
    /** Componente principal do mapa interativo */
    MapaComp,
  }
}
</script>

<style scoped>
  .main-container {
    margin: 50px;
  }

  #conteudo {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    min-height: 63vh;
  }
</style>
