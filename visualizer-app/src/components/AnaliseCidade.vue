<template>
  <div class="container-cidade" v-if="cidade">
    <div class="header-cidade">
      <h2>Análise da Cidade de {{ cidadeNome }}</h2>
      <p v-if="loading">A carregar dados da cidade de {{ cidadeNome }}...</p>
    </div>

    <div v-if="!loading" class="conteudo-analise">
      <div class="zona-stats">
        <h3>Estatísticas Gerais</h3>
        <div class="stats-grid">
          <div class="stat-card">
            <p class="stat-label">Total de Listagens</p>
            <h4 class="stat-value">{{ totalListagens.toLocaleString('pt-PT') }}</h4>
          </div>
          <div class="stat-card">
            <p class="stat-label">Preço Médio por Noite</p>
            <h4 class="stat-value">{{ precoMedio }} €</h4>
          </div>
          <div class="stat-card">
            <p class="stat-label"> Número de Hosts</p>
            <h4 class="stat-value">{{ hostsUnicos.toLocaleString('pt-PT') }}</h4>
          </div>
          <div class="stat-card">
            <p class="stat-label">Número Médio de Reviews</p>
            <h4 class="stat-value">{{ mediaReviews }}</h4>
          </div>
        </div>
      </div>

      
      </div><div class="zona-graficos">
        <div class="graficos-grid">
          <GraficoComp
            titulo="Preço médio por tipo de alojamento"
            tipo="bar"
            :dados="graficoPrecoPorTipo"
          />
          <GraficoComp
            titulo="Número total de reviews por tipo de alojamento"
            tipo="bar"
            :dados="graficoTotalReviewsPorTipo"
          />
        </div>

      <div class="zona-tipos">
        <h3>Distribuição por Tipo de Alojamento</h3>
        <div class="tipos-grid">
          <div v-for="(count, type) in tiposDistribuicao" :key="type" class="tipo-card">
            <p class="tipo-label">{{ type }}</p>
            <h4 class="tipo-value">{{ count.toLocaleString('pt-PT') }}</h4>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * Componente AnaliseCidade
 * 
 * Exibe uma análise detalhada dos dados de Airbnb para uma cidade específica,
 * incluindo estatísticas gerais, gráficos e distribuição por tipo de alojamento.
 * Permite a aplicação de filtros como vizinhança, preço, tipo de alojamento e data.
 * 
 * @component
 * @example
 * <AnaliseCidade
 *   :cidade="'lisboa'"
 *   :vizinhanca="'Centro'"
 *   :preco="'51-100'"
 *   :tipo="'Entire home/apt'"
 *   :data="'2023-12-31'"
 * />
 */
import GraficoComp from './graficos/GraficoComp.vue'

export default {
  name: 'AnaliseCidade',
  components: {
    /** Componente para renderização de gráficos (barras, linhas, etc.) */
    GraficoComp,
  },
  props: {
    /**
     * Identificador da cidade a analisar (ex: 'lisboa', 'porto', 'madrid', 'barcelona').
     * Este valor é usado para fazer o fetch dos dados.
     */
    cidade: {
      type: String,
      default: '',
    },
    /**
     * Nome da vizinhança para filtrar os resultados.
     * Quando especificado, apenas listagens desta vizinhança são consideradas.
     */
    vizinhanca: {
      type: String,
      default: '',
    },
    /**
     * Faixa de preço para filtrar os resultados.
     * Formato: 'min-max' (ex: '51-100') ou '151+' para valores acima de 151€.
     */
    preco: {
      type: String,
      default: '',
    },
    /**
     * Tipo de alojamento para filtrar os resultados.
     * Valores possíveis: 'Entire home/apt', 'Private room', 'Shared room', 'Hotel room'.
     */
    tipo: {
      type: String,
      default: '',
    },
    /**
     * Data limite para filtrar reviews (formato ISO: 'YYYY-MM-DD').
     * Apenas listagens com last_review anterior ou igual a esta data são incluídas.
     */
    data: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      /** Indica se os dados estão a ser carregados */
      loading: false,
      /** Array com todos os dados brutos das listagens da cidade */
      dadosCidade: [],
      /** Número total de listagens (após aplicação de filtros) */
      totalListagens: 0,
      /** Preço médio por noite em euros (após aplicação de filtros) */
      precoMedio: 0,
      /** Número de hosts únicos (após aplicação de filtros) */
      hostsUnicos: 0,
      /** Média do número de reviews por listagem (após aplicação de filtros) */
      mediaReviews: 0,
      /** Objeto com a contagem de listagens por tipo de alojamento */
      tiposDistribuicao: {},
    }
  },
  computed: {
    /**
     * Retorna o nome formatado da cidade para exibição.
     * Converte o identificador da cidade (ex: 'lisboa') para o nome completo (ex: 'Lisboa').
     * 
     * @returns {string} Nome formatado da cidade
     */
    cidadeNome() {
      const nomes = {
        lisboa: 'Lisboa',
        porto: 'Porto',
        madrid: 'Madrid',
        barcelona: 'Barcelona',
      }
      return nomes[this.cidade] || this.cidade
    },
    /**
     * Gera os dados para o gráfico de preço médio por tipo de alojamento.
     * Aplica todos os filtros ativos (vizinhança, preço, tipo, data) antes do cálculo.
     * 
     * @returns {Object} Objeto com estrutura compatível com Chart.js contendo labels e datasets
     * @property {string[]} labels - Array com os tipos de alojamento
     * @property {Object[]} datasets - Array com os dados do gráfico
     */
    graficoPrecoPorTipo() {
      if (!this.dadosCidade.length) {
        return { labels: [], datasets: [] }
      }

      // Aplicar filtros
      let dados = [...this.dadosCidade]

      if (this.vizinhanca) {
        dados = dados.filter((l) => l.neighbourhood === this.vizinhanca)
      }

      if (this.preco) {
        if (this.preco === '151+') {
          dados = dados.filter((l) => l.price >= 151)
        } else {
          const [min, max] = this.preco.split('-').map(Number)
          dados = dados.filter((l) => l.price >= min && l.price <= max)
        }
      }

      if (this.tipo) {
        dados = dados.filter((l) => l.room_type === this.tipo)
      }

      if (this.data) {
        dados = dados.filter((l) => {
          if (!l.last_review) return false
          return new Date(l.last_review) <= new Date(this.data)
        })
      }

      // Agrupar preços por tipo
      const mapa = {}

      dados.forEach((l) => {
        if (!l.room_type || !l.price) return

        if (!mapa[l.room_type]) {
          mapa[l.room_type] = { total: 0, count: 0 }
        }

        mapa[l.room_type].total += l.price
        mapa[l.room_type].count++
      })

      const labels = Object.keys(mapa)
      const valores = labels.map((tipo) =>
        Math.round(mapa[tipo].total / mapa[tipo].count)
      )

      // Paleta de cores fixa
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
     * Gera os dados para o gráfico do número total de reviews por tipo de alojamento.
     * Soma todas as reviews de cada tipo de alojamento sem aplicar filtros adicionais.
     * 
     * @returns {Object} Objeto com estrutura compatível com Chart.js contendo labels e datasets
     * @property {string[]} labels - Array com os tipos de alojamento
     * @property {Object[]} datasets - Array com os dados do gráfico
     */
    graficoTotalReviewsPorTipo() {
      if (!this.dadosCidade.length) return { labels: [], datasets: [] }

      // Agrupar total de reviews por tipo de alojamento
      const mapa = {}

      this.dadosCidade.forEach((l) => {
        if (!l.room_type || l.number_of_reviews == null) return

        if (!mapa[l.room_type]) {
          mapa[l.room_type] = 0
        }

        mapa[l.room_type] += l.number_of_reviews
      })

      const labels = Object.keys(mapa)
      const valores = labels.map((tipo) => mapa[tipo])

      // Cores
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
    }
  },
  watch: {
    /**
     * Observa mudanças na prop 'cidade'.
     * Quando a cidade muda, faz o fetch dos novos dados da API.
     * 
     * @param {string} newValue - Nova cidade selecionada
     */
    cidade: {
      immediate: true,
      handler(newValue) {
        if (newValue) {
          this.fetchDadosCidade()
        }
      },
    },
    /**
     * Observa mudanças no filtro de preço.
     * Reaplica os filtros quando o preço é alterado.
     */
    preco() {
      this.aplicarFiltros()
    },
    /**
     * Observa mudanças no filtro de vizinhança.
     * Reaplica os filtros quando a vizinhança é alterada.
     */
    vizinhanca() {
      this.aplicarFiltros()
    },
    /**
     * Observa mudanças no filtro de tipo de alojamento.
     * Reaplica os filtros quando o tipo é alterado.
     */
    tipo() {
      this.aplicarFiltros()
    },
    /**
     * Observa mudanças no filtro de data.
     * Reaplica os filtros quando a data é alterada.
     */
    data() {
      this.aplicarFiltros()
    },
  },
  methods: {
    /**
     * Faz o fetch dos dados da cidade selecionada do backend.
     * Define o estado de loading, busca os dados e calcula as estatísticas iniciais.
     * 
     * @async
     * @returns {Promise<void>}
     * @throws {Error} Caso ocorra um erro ao buscar os dados da API
     */
    async fetchDadosCidade() {
      if (!this.cidade) return

      this.loading = true
      try {
        const response = await fetch(`http://localhost:3000/${this.cidade}.listings`)
        this.dadosCidade = await response.json()
        this.calcularEstatisticas(this.dadosCidade)
        this.loading = false
      } catch (error) {
        console.error('Erro ao buscar dados da cidade:', error)
        this.loading = false
      }
    },
    /**
     * Aplica todos os filtros ativos (vizinhança, preço, tipo, data) aos dados da cidade.
     * Filtra os dados e recalcula as estatísticas com base nos dados filtrados.
     * 
     * Filtros aplicados:
     * - Vizinhança: filtra por vizinhança específica
     * - Preço: filtra por faixa de preço (ex: '51-100' ou '151+')
     * - Tipo: filtra por tipo de alojamento
     * - Data: filtra listagens com last_review anterior ou igual à data especificada
     * 
     * @returns {void}
     */
    aplicarFiltros() {
      if (!this.dadosCidade.length) return

      let dadosFiltrados = [...this.dadosCidade]

      // Filtro por vizinhança
      if (this.vizinhanca) {
        dadosFiltrados = dadosFiltrados.filter((l) => l.neighbourhood === this.vizinhanca)
      }

      // Filtro por preço
      if (this.preco) {
        if (this.preco === '151+') {
          dadosFiltrados = dadosFiltrados.filter((l) => l.price >= 151)
        } else {
          const [min, max] = this.preco.split('-').map(Number)
          dadosFiltrados = dadosFiltrados.filter((l) => l.price >= min && l.price <= max)
        }
      }

      // Filtro por tipo
      if (this.tipo) {
        dadosFiltrados = dadosFiltrados.filter((l) => l.room_type === this.tipo)
      }

      // Filtro por data (last_review <= data escolhida)
      if (this.data) {
        dadosFiltrados = dadosFiltrados.filter((l) => {
          if (!l.last_review) return false
          return new Date(l.last_review) <= new Date(this.data)
        })
      }

      this.calcularEstatisticas(dadosFiltrados)
    },
    /**
     * Calcula as estatísticas gerais com base no conjunto de dados fornecido.
     * Atualiza as propriedades reativas: totalListagens, precoMedio, hostsUnicos,
     * mediaReviews e tiposDistribuicao.
     * 
     * Estatísticas calculadas:
     * - Total de listagens
     * - Preço médio por noite (apenas preços válidos > 0)
     * - Número de hosts únicos
     * - Média de reviews por listagem
     * - Distribuição de listagens por tipo de alojamento
     * 
     * @param {Array} dados - Array de objetos com os dados das listagens
     * @returns {void}
     */
    calcularEstatisticas(dados) {
      // Total de listagens
      this.totalListagens = dados.length

      // Preço médio
      const validPrices = dados.filter((l) => l.price != null && l.price > 0)
      if (validPrices.length > 0) {
        const totalPrice = validPrices.reduce((sum, l) => sum + l.price, 0)
        this.precoMedio = Math.round(totalPrice / validPrices.length)
      } else {
        this.precoMedio = 0
      }

      // Hosts únicos
      const uniqueHosts = new Set(dados.map((l) => l.host_id))
      this.hostsUnicos = uniqueHosts.size

      // Média de reviews
      const validReviews = dados.filter((l) => l.number_of_reviews != null)
      if (validReviews.length > 0) {
        const totalReviews = validReviews.reduce((sum, l) => sum + l.number_of_reviews, 0)
        this.mediaReviews = Math.round(totalReviews / validReviews.length)
      } else {
        this.mediaReviews = 0
      }

      // Distribuição por tipo
      this.tiposDistribuicao = dados.reduce((acc, l) => {
        const tipo = l.room_type || 'Não especificado'
        acc[tipo] = (acc[tipo] || 0) + 1
        return acc
      }, {})
    },
  },
}
</script>

<style scoped>
.container-cidade {
  margin-top: 5px;
}

.header-cidade {
  margin-bottom: 30px;
}

.header-cidade h2 {
  color: var(--collor-airbnb);
  font-size: 2rem;
  margin-bottom: 10px;
}

.header-cidade p {
  color: #666;
  font-size: 1.1rem;
}

.conteudo-analise {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.zona-stats h3,
.zona-tipos h3 {
  font-size: 1.5rem;
  margin-bottom: 20px;
  color: #333;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
}

.stat-card {
  background: white;
  padding: 20px;
  border-radius: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
}

.stat-label {
  font-size: 0.95rem;
  color: #666;
  margin-bottom: 10px;
}

.stat-value {
  font-size: 2rem;
  font-weight: bold;
  color: var(--collor-airbnb);
  margin: 0;
}

.graficos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(100px, 1fr));
  gap: 30px;
}

.tipos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(180px, 1fr));
  gap: 15px;
}

.tipo-card {
  background: white;
  padding: 15px;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  text-align: center;
}

.tipo-label {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 8px;
}

.tipo-value {
  font-size: 1.5rem;
  font-weight: bold;
  color: #333;
  margin: 0;
}
</style>
