<template>
  <div class="main-container">
    <div id="conteudo">
      <BarraFiltros
        :cidadeInicial="cidadeSelecionada"
        @update:cidade="cidadeSelecionada = $event"
        @update:vizinhanca="vizinhancaSelecionada = $event"
        @update:preco="precoSelecionado = $event"
        @update:tipo="tipoSelecionado = $event"
        @update:data="dataSelecionada = $event"
      />

      <AnaliseCidade
        v-if="cidadeSelecionada"
        :cidade="cidadeSelecionada"
        :vizinhanca="vizinhancaSelecionada"
        :preco="precoSelecionado"
        :tipo="tipoSelecionado"
        :data="dataSelecionada"
      />

      <div v-else class="mensagem-inicial">
        <p>Escolha uma cidade para analisar</p>
      </div>
    </div>
    <VoltarButton />
  </div>
</template>

<script>
import BarraFiltros from '@/components/BarraFiltros.vue'
import AnaliseCidade from '@/components/AnaliseCidade.vue'
import VoltarButton from '@/components/buttons/VoltarButton.vue'

/**
 * View de análise de dados de uma cidade específica.
 * 
 * Esta view permite ao utilizador analisar informações detalhadas sobre Airbnb
 * de uma cidade escolhida, aplicando diversos filtros (vizinhança, preço, tipo de alojamento, data).
 * Integra a barra de filtros para seleção de parâmetros e o componente de análise para visualização dos dados.
 * 
 * @component
 * @example
 * // Navegação direta para a view
 * <router-link to="/analise">Analisar Cidade</router-link>
 * 
 * // Navegação com cidade pré-selecionada
 * <router-link to="/analise?cidade=Lisboa">Analisar Lisboa</router-link>
 */
export default {
  name: 'AnaliseView',
  components: {
    /** Componente para seleção de cidade e aplicação de filtros */
    BarraFiltros,
    /** Componente que exibe a análise detalhada da cidade selecionada */
    AnaliseCidade,
    /** Botão para retornar à página anterior */
    VoltarButton,
  },
  data() {
    return {
      /** Cidade atualmente selecionada para análise */
      cidadeSelecionada: '',
      /** Vizinhança selecionada como filtro (opcional) */
      vizinhancaSelecionada: '',
      /** Intervalo de preços selecionado como filtro (opcional) */
      precoSelecionado: '',
      /** Tipo de alojamento selecionado como filtro (opcional) */
      tipoSelecionado: '',
      /** Período temporal selecionado como filtro (opcional) */
      dataSelecionada: '',
    }
  },
  /**
   * Executado após a criação da instância.
   * Verifica se existe uma cidade pré-selecionada nos query parameters da rota.
   */
  created() {
    // Verificar se há uma cidade pré-selecionada via query parameter
    if (this.$route.query.cidade) {
      this.cidadeSelecionada = this.$route.query.cidade
    }
  },
  watch: {
    /**
     * Observa mudanças no query parameter 'cidade' da rota.
     * Atualiza a cidade selecionada quando o utilizador navega com uma cidade pré-definida.
     * 
     * @param {string} newCidade - Nova cidade recebida via query parameter
     */
    '$route.query.cidade': {
      immediate: true,
      handler(newCidade) {
        if (newCidade) {
          this.cidadeSelecionada = newCidade
        }
      },
    },
  },
}
</script>

<style scoped>
.main-container {
  margin: 50px;
}

#conteudo {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  min-height: 63vh;
}

.mensagem-inicial {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 400px;
}

.mensagem-inicial p {
  font-size: 1.5rem;
  color: #999;
  text-align: center;
}
</style>
