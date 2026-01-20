<template>
  <div>
    <!-- Filtro extra -->
    <CompararFiltro
      v-if="cidade1 && cidade2 && filtroAtivo"
      :cidade1="cidade1"
      :cidade2="cidade2"
      :filtroAtivo="filtroAtivo"
    />

    <div v-else-if="cidade1 && cidade2" class="comparacao-container">
      <!-- Coluna cidade 1 -->
      <div class="coluna-cidade">
        <h2 class="titulo-cidade">{{ getCidadeNome(cidade1) }}</h2>
        <div class="graficos-grid">
          <GraficoComp
            titulo="Preço médio por tipo de alojamento"
            tipo="bar"
            :dados="graficoPrecoPorTipoCidade1"
          />
          <GraficoComp
            titulo="Distribuição de preços"
            tipo="bar"
            :dados="histogramaPrecosCidade1"
          />
          <GraficoComp
            titulo="Número total de reviews por tipo de alojamento"
            tipo="bar"
            :dados="graficoTotalReviewsPorTipoCidade1"
          />
          <GraficoComp
            titulo="Média de dias disponíveis por ano por tipo de alojamento"
            tipo="pie"
            :dados="mediaDisponibilidadeCidade1"
          />
        </div>
      </div>

      <!-- Coluna cidade 2 -->
      <div class="coluna-cidade">
        <h2 class="titulo-cidade">{{ getCidadeNome(cidade2) }}</h2>
        <div class="graficos-grid">
          <GraficoComp
            titulo="Preço médio por tipo de alojamento"
            tipo="bar"
            :dados="graficoPrecoPorTipoCidade2"
          />
          <GraficoComp
            titulo="Distribuição de preços"
            tipo="bar"
            :dados="histogramaPrecosCidade2"
          />
          <GraficoComp
            titulo="Número total de reviews por tipo de alojamento"
            tipo="bar"
            :dados="graficoTotalReviewsPorTipoCidade2"
          />
          <GraficoComp
            titulo="Média de dias disponíveis por ano por tipo de alojamento"
            tipo="pie"
            :dados="mediaDisponibilidadeCidade2"
          />
        </div>
      </div>
    </div>

    <div v-else class="mensagem-inicial">
      <p>Escolha duas cidades para comparar</p>
    </div>
  </div>
</template>

<script>
/**
 * Componente de comparação lado a lado entre duas cidades.
 * 
 * Exibe gráficos comparativos de estatísticas de Airbnb entre duas cidades selecionadas,
 * mostrando métricas como preços médios, distribuição de preços, reviews e disponibilidade
 * por tipo de alojamento. Permite também aplicar filtros específicos através do componente
 * CompararFiltro.
 * 
 * @component
 * @example
 * <CompararCidades
 *   :cidade1="'lisboa'"
 *   :cidade2="'madrid'"
 *   :filtroAtivo="'preco'"
 * />
 */
import GraficoComp from '@/components/graficos/GraficoComp.vue'
import CompararFiltro from '@/components/CompararFiltro.vue'

export default {
  name: 'CompararCidades',
  components: {
    /** Componente para renderização de gráficos */
    GraficoComp,
    /** Componente para exibir comparação filtrada entre cidades */
    CompararFiltro,
  },
  props: {
    /**
     * Identificador da primeira cidade a comparar (ex: 'lisboa', 'porto', 'madrid', 'barcelona')
     */
    cidade1: {
      type: String,
      default: '',
    },
    /**
     * Identificador da segunda cidade a comparar (ex: 'lisboa', 'porto', 'madrid', 'barcelona')
     */
    cidade2: {
      type: String,
      default: '',
    },
    /**
     * Tipo de filtro ativo para comparação detalhada.
     * Valores possíveis: 'preco', 'tipo', 'hosts', 'reviews'
     */
    filtroAtivo: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      /** Dados brutos dos alojamentos da primeira cidade */
      dadosCidade1: [],
      /** Dados brutos dos alojamentos da segunda cidade */
      dadosCidade2: [],
    }
  },
  watch: {
    /**
     * Observa mudanças na primeira cidade selecionada.
     * Quando alterada, faz o fetch dos dados da nova cidade.
     * 
     * @param {string} newCidade - Nova cidade selecionada
     */
    cidade1(newCidade) {
      if (newCidade) this.fetchDados(newCidade, 'dadosCidade1')
    },
    /**
     * Observa mudanças na segunda cidade selecionada.
     * Quando alterada, faz o fetch dos dados da nova cidade.
     * 
     * @param {string} newCidade - Nova cidade selecionada
     */
    cidade2(newCidade) {
      if (newCidade) this.fetchDados(newCidade, 'dadosCidade2')
    },
  },
  computed: {
    /**
     * Gera dados do gráfico de preço médio por tipo de alojamento para a cidade 1.
     * @returns {Object} Dados formatados para Chart.js
     */
    graficoPrecoPorTipoCidade1() {
      return this.calcularPrecoPorTipo(this.dadosCidade1)
    },
    /**
     * Gera dados do gráfico de preço médio por tipo de alojamento para a cidade 2.
     * @returns {Object} Dados formatados para Chart.js
     */
    graficoPrecoPorTipoCidade2() {
      return this.calcularPrecoPorTipo(this.dadosCidade2)
    },
    /**
     * Gera dados do gráfico de total de reviews por tipo de alojamento para a cidade 1.
     * @returns {Object} Dados formatados para Chart.js
     */
    graficoTotalReviewsPorTipoCidade1() {
      return this.calcularTotalReviewsPorTipo(this.dadosCidade1)
    },
    /**
     * Gera dados do gráfico de total de reviews por tipo de alojamento para a cidade 2.
     * @returns {Object} Dados formatados para Chart.js
     */
    graficoTotalReviewsPorTipoCidade2() {
      return this.calcularTotalReviewsPorTipo(this.dadosCidade2)
    },
    /**
     * Gera dados do histograma de distribuição de preços para a cidade 1.
     * @returns {Object} Dados formatados para Chart.js
     */
    histogramaPrecosCidade1() {
    return this.calcularHistogramaPrecos(this.dadosCidade1)
    },
    /**
     * Gera dados do histograma de distribuição de preços para a cidade 2.
     * @returns {Object} Dados formatados para Chart.js
     */
    histogramaPrecosCidade2() {
      return this.calcularHistogramaPrecos(this.dadosCidade2)
    },
    /**
     * Gera dados do gráfico de reviews por mês para a cidade 1.
     * @returns {Object} Dados formatados para Chart.js
     */
    reviewsPorMesCidade1() {
      return this.calcularReviewsPorMes(this.dadosCidade1)
    },
    /**
     * Gera dados do gráfico de reviews por mês para a cidade 2.
     * @returns {Object} Dados formatados para Chart.js
     */
    reviewsPorMesCidade2() {
      return this.calcularReviewsPorMes(this.dadosCidade2)
    },
    /**
     * Gera dados do gráfico de média de disponibilidade por tipo para a cidade 1.
     * @returns {Object} Dados formatados para Chart.js
     */
    mediaDisponibilidadeCidade1() {
      return this.calcularMediaDisponibilidade(this.dadosCidade1)
    },
    /**
     * Gera dados do gráfico de média de disponibilidade por tipo para a cidade 2.
     * @returns {Object} Dados formatados para Chart.js
     */
    mediaDisponibilidadeCidade2() {
      return this.calcularMediaDisponibilidade(this.dadosCidade2)
    },
    
  },
  methods: {
    /**
     * Faz o fetch dos dados de uma cidade específica
     * 
     * @async
     * @param {string} cidade - Identificador da cidade a buscar
     * @param {string} target - Nome da propriedade data onde armazenar os dados ('dadosCidade1' ou 'dadosCidade2')
     * @returns {Promise<void>}
     * @throws {Error} Caso ocorra um erro ao buscar os dados da API
     */
    async fetchDados(cidade, target) {
      try {
        const response = await fetch(`http://localhost:3000/${cidade}.listings`)
        const dados = await response.json()
        this[target] = dados
      } catch (error) {
        console.error(`Erro ao buscar dados de ${cidade}:`, error)
        this[target] = []
      }
    },
    /**
     * Calcula o preço médio por tipo de alojamento.
     * 
     * @param {Array} dados - Array de objetos com dados dos alojamentos
     * @returns {Object} Objeto com estrutura compatível com Chart.js (labels e datasets)
     */
    calcularPrecoPorTipo(dados) {
      if (!dados.length) return { labels: [], datasets: [] }

      const mapa = {}
      dados.forEach((l) => {
        if (!l.room_type || !l.price) return
        if (!mapa[l.room_type]) mapa[l.room_type] = { total: 0, count: 0 }
        mapa[l.room_type].total += l.price
        mapa[l.room_type].count++
      })

      const labels = Object.keys(mapa)
      const valores = labels.map((tipo) => Math.round(mapa[tipo].total / mapa[tipo].count))

      const backgroundColors = [
        'rgba(255, 90, 95, 0.8)',
        'rgba(54, 162, 235, 0.8)',
        'rgba(255, 206, 86, 0.8)',
        'rgba(75, 192, 192, 0.8)',
      ]
      const borderColors = [
        'rgba(255, 90, 95, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
      ]

      return {
        labels,
        datasets: [
          {
            label: 'Preço médio por noite (€)',
            data: valores,
            backgroundColor: labels.map((_, i) => backgroundColors[i % backgroundColors.length]),
            borderColor: labels.map((_, i) => borderColors[i % borderColors.length]),
            borderWidth: 2,
          },
        ],
      }
    },
    /**
     * Calcula o total de reviews por tipo de alojamento.
     * Soma o campo number_of_reviews de cada tipo.
     * 
     * @param {Array} dados - Array de objetos com dados dos alojamentos
     * @returns {Object} Objeto com estrutura compatível com Chart.js
     */
    calcularTotalReviewsPorTipo(dados) {
      if (!dados.length) return { labels: [], datasets: [] }

      const mapa = {}
      dados.forEach((l) => {
        if (!l.room_type || l.number_of_reviews == null) return
        if (!mapa[l.room_type]) mapa[l.room_type] = 0
        mapa[l.room_type] += l.number_of_reviews
      })

      const labels = Object.keys(mapa)
      const valores = labels.map((tipo) => mapa[tipo])

      const backgroundColors = [
        'rgba(255, 90, 95, 0.8)',
        'rgba(54, 162, 235, 0.8)',
        'rgba(255, 206, 86, 0.8)',
        'rgba(75, 192, 192, 0.8)',
      ]
      const borderColors = [
        'rgba(255, 90, 95, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
      ]

      return {
        labels,
        datasets: [
          {
            label: 'Número total de reviews',
            data: valores,
            backgroundColor: labels.map((_, i) => backgroundColors[i % backgroundColors.length]),
            borderColor: labels.map((_, i) => borderColors[i % borderColors.length]),
            borderWidth: 2,
          },
        ],
      }
    },
    /**
     * Retorna o nome da cidade dado seu identificador.
     * 
     * @param {string} cidade - Identificador da cidade (ex: 'lisboa')
     * @returns {string} Nome da cidade (ex: 'Lisboa')
     */
    getCidadeNome(cidade) {
      const nomes = {
        lisboa: 'Lisboa',
        porto: 'Porto',
        madrid: 'Madrid',
        barcelona: 'Barcelona',
      }
      return nomes[cidade] || cidade
    },

    /**
     * Calcula o histograma de distribuição de preços.
     * 
     * @param {Array} dados - Array de objetos com dados dos alojamentos
     * @returns {Object} Objeto com estrutura compatível com Chart.js (labels e datasets)
     */
    calcularHistogramaPrecos(dados) {
      if (!dados.length) return { labels: [], datasets: [] }

      const bins = [0, 50, 100, 150, 200, 300, 500, 1000]
      const labels = bins.slice(0, -1).map((b, i) => `${b}-${bins[i + 1] - 1} €`)
      const valores = Array(bins.length - 1).fill(0)
    
      dados.forEach((l) => {
        for (let i = 0; i < bins.length - 1; i++) {
          if (l.price >= bins[i] && l.price < bins[i + 1]) {
            valores[i]++
            break
          }
        }
      })

      // Paleta de cores por bin
      const backgroundColors = [
        'rgba(255, 99, 132, 0.8)',
        'rgba(54, 162, 235, 0.8)',
        'rgba(255, 206, 86, 0.8)',
        'rgba(75, 192, 192, 0.8)',
        'rgba(153, 102, 255, 0.8)',
        'rgba(255, 159, 64, 0.8)',
        'rgba(199, 199, 199, 0.8)',
      ]
      const borderColors = backgroundColors.map(c => c.replace('0.8', '1'))

      return {
        labels,
        datasets: [
          {
            label: 'Número de listagens',
            data: valores,
            backgroundColor: backgroundColors,
            borderColor: borderColors,
            borderWidth: 1,
          },
        ],
      }
    },
    /**
     * Calcula o número médio de reviews por mês por tipo de alojamento.
     * 
     * @param {Array} dados - Array de objetos com dados dos alojamentos
     * @returns {Object} Objeto com estrutura compatível com Chart.js
     */
    calcularReviewsPorMes(dados) {
      if (!dados.length) return { labels: [], datasets: [] }

      const tipos = [...new Set(dados.map(l => l.room_type || 'Não especificado'))]
      const valores = tipos.map(tipo => {
        const filtrado = dados.filter(l => (l.room_type || 'Não especificado') === tipo)
        const totalReviews = filtrado.reduce((sum, l) => sum + (l.reviews_per_month || 0), 0)
        return +(totalReviews.toFixed(2))  // arredonda para 2 casas decimais
      })

      const backgroundColors = [
        'rgba(255, 99, 132, 0.8)',
        'rgba(54, 162, 235, 0.8)',
        'rgba(255, 206, 86, 0.8)',
        'rgba(75, 192, 192, 0.8)',
        'rgba(153, 102, 255, 0.8)',
        'rgba(255, 159, 64, 0.8)',
      ]
      const borderColors = backgroundColors.map(c => c.replace('0.8', '1'))

      return {
        labels: tipos,
        datasets: [
          {
            label: 'Reviews por mês',
            data: valores,
            backgroundColor: tipos.map((_, i) => backgroundColors[i % backgroundColors.length]),
            borderColor: tipos.map((_, i) => borderColors[i % borderColors.length]),
            borderWidth: 2,
          },
        ],
      }
    },
    calcularMediaDisponibilidade(dados) {
      if (!dados.length) return { labels: [], datasets: [] }

      const tipos = [...new Set(dados.map(l => l.room_type || 'Não especificado'))]
      const valores = tipos.map(tipo => {
        const filtrado = dados.filter(l => (l.room_type || 'Não especificado') === tipo)
        const totalDisponibilidade = filtrado.reduce((sum, l) => sum + (l.availability_365 || 0), 0)
        return filtrado.length ? Math.round(totalDisponibilidade / filtrado.length) : 0
      })

      const backgroundColors = [
        'rgba(255, 90, 95, 0.8)',
        'rgba(54, 162, 235, 0.8)',
        'rgba(255, 206, 86, 0.8)',
        'rgba(75, 192, 192, 0.8)',
        'rgba(153, 102, 255, 0.8)',
        'rgba(255, 159, 64, 0.8)',
      ]
      const borderColors = backgroundColors.map(c => c.replace('0.8', '1'))

      return {
        labels: tipos,
        datasets: [
          {
            label: 'Média de dias disponíveis por ano',
            data: valores,
            backgroundColor: tipos.map((_, i) => backgroundColors[i % backgroundColors.length]),
            borderColor: tipos.map((_, i) => borderColors[i % borderColors.length]),
            borderWidth: 2,
          },
        ],
      }
    },
    /**
     * Calcula os dados para o gráfico de bolhas de preço vs número de reviews.
     * 
     * @param {Array} dados - Array de objetos com dados dos alojamentos
     * @returns {Object} Objeto com estrutura compatível com Chart.js
     */
    calcularBubblePrecoVsReviews(dados) {
      if (!dados.length) return { datasets: [] }

      const bubbleData = dados
        .filter(l => l.price && l.number_of_reviews != null && l.reviews_per_month != null)
        .map(l => ({
          x: l.price,
          y: l.number_of_reviews,
          r: Math.max(3, l.reviews_per_month * 10) // escala o tamanho da bolha
        }))

      return {
        datasets: [
          {
            label: 'Preço vs Número de Reviews',
            data: bubbleData,
            backgroundColor: 'rgba(54, 162, 235, 0.6)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1,
          },
        ],
      }
    },
  },
}
</script>

<style scoped>
.comparacao-container {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2.5rem;
}

.coluna-cidade {
  display: flex;
  flex-direction: column;
}

.titulo-cidade {
  color: var(--collor-airbnb);
  font-size: 2rem;
  margin-bottom: 25px;
  text-align: center;
}

.graficos-grid {
  display: flex;
  flex-direction: column;
  gap: 25px;
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
