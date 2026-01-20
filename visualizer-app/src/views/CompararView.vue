<template>
  <div class="main-container">
    <BarraLateral
      @update:cidade1="cidade1 = $event"
      @update:cidade2="cidade2 = $event"
      @update:filtro="filtroAtivo = $event"
    />
    <div class="info">
      <div id="conteudo">
        <CompararCidades :cidade1="cidade1" :cidade2="cidade2" :filtroAtivo="filtroAtivo" />
      </div>
      <VoltarButton />
    </div>
  </div>
</template>

<script>
import BarraLateral from '@/components/BarraLateral.vue'
import VoltarButton from '@/components/buttons/VoltarButton.vue'
import CompararCidades from '@/components/CompararCidades.vue'

/**
 * View de comparação entre duas cidades.
 * 
 * Esta view permite ao utilizador comparar informações de Airbnb entre duas cidades diferentes,
 * com a possibilidade de aplicar filtros específicos para refinar a comparação.
 * Utiliza uma barra lateral para seleção das cidades e filtros, e exibe a comparação
 * lado a lado no componente principal.
 * 
 * @component
 * @example
 * // Navegação para a view de comparação
 * <router-link to="/comparar">Comparar Cidades</router-link>
 */
export default {
  name: 'CompararView',
  components: {
    /** Botão para retornar à página anterior */
    VoltarButton,
    /** Barra lateral com seleção das duas cidades e filtros de comparação */
    BarraLateral,
    /** Componente que exibe a comparação detalhada entre as duas cidades */
    CompararCidades,
  },
  data() {
    return {
      /** Primeira cidade selecionada para comparação */
      cidade1: '',
      /** Segunda cidade selecionada para comparação */
      cidade2: '',
      /** Filtro ativo aplicado à comparação (ex: preço, tipo de alojamento) */
      filtroAtivo: '',
    }
  },
}
</script>

<style scoped>
.main-container {
  margin: 50px;
  display: flex;
  flex-direction: row;
  gap: 2rem;
}

.info {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  flex: 1;
  min-height: 69vh;
}

#conteudo {
  flex: 1;
}
</style>
