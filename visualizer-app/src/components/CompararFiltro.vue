<template>
  <div class="zona-filtrada">
    <h2 class="titulo-comparacao">
      Comparação de {{ getCidadeNome(cidade1) }} e {{ getCidadeNome(cidade2) }}
    </h2>
    <h3 class="subtitulo-filtro">Filtrada por: {{ getNomeFiltro(filtroAtivo) }}</h3>

    <!-- Gráfico combinado -->
    <div class="grafico-filtrado">
      <GraficoComp
        :titulo="getTituloGrafico()"
        tipo="bar"
        :dados="graficoComparativo"
      />
    </div>

    <!-- Informações resumidas -->
    <div v-if="loading" class="loading-message">
      <p>A carregar dados...</p>
    </div>

    <div v-else class="info-boxes">
      <div class="linha-boxes">
        <div class="info-box" v-for="i in 3" :key="'cidade1-'+i">
          <p>{{ getInfoLabel(i-1) }} - {{ getCidadeNome(cidade1) }}</p>
          <h2>{{ getInfoValue(cidade1, i-1) }}</h2>
        </div>
      </div>
      <div class="linha-boxes">
        <div class="info-box" v-for="i in 3" :key="'cidade2-'+i">
          <p>{{ getInfoLabel(i-1) }} - {{ getCidadeNome(cidade2) }}</p>
          <h2>{{ getInfoValue(cidade2, i-1) }}</h2>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * Componente de comparação filtrada entre duas cidades.
 * 
 * Exibe uma comparação detalhada entre duas cidades com base num filtro específico
 * (preço, tipo de alojamento, hosts ou reviews). Apresenta um gráfico comparativo
 * lado a lado e boxes informativos com estatísticas relevantes para cada cidade.
 * 
 * Filtros disponíveis:
 * - preco: Compara preços médios, máximos e mínimos
 * - tipo: Compara quantidade por tipo de alojamento
 * - hosts: Compara número de hosts e suas receitas
 * - reviews: Compara número e médias de reviews
 * 
 * @component
 * @example
 * <CompararFiltro
 *   :cidade1="'lisboa'"
 *   :cidade2="'madrid'"
 *   :filtroAtivo="'preco'"
 * />
 */
import GraficoComp from '@/components/graficos/GraficoComp.vue'

export default {
  name: 'CompararFiltro',
  components: { 
    /** Componente para renderização de gráficos */
    GraficoComp 
  },
  props: {
    /** Identificador da primeira cidade a comparar (obrigatório) */
    cidade1: { type: String, required: true },
    /** Identificador da segunda cidade a comparar (obrigatório) */
    cidade2: { type: String, required: true },
    /** Tipo de filtro ativo: 'preco', 'tipo', 'hosts' ou 'reviews' (obrigatório) */
    filtroAtivo: { type: String, required: true },
  },
  data() {
    return {
      /** Indica se os dados estão a ser carregados */
      loading: true,
      /** Dados brutos dos alojamentos da primeira cidade */
      dadosCidade1: [],
      /** Dados brutos dos alojamentos da segunda cidade */
      dadosCidade2: [],
    }
  },
  /**
   * Executado após o componente ser montado.
   * Carrega os dados das duas cidades.
   */
  async mounted() {
    await this.fetchDados()
  },
  watch: {
    /**
     * Observa mudanças nas cidades ou filtro e recarrega os dados.
     */
    cidade1: 'fetchDados',
    cidade2: 'fetchDados',
    filtroAtivo: 'fetchDados',
  },
  computed: {
    /**
     * Gera o gráfico comparativo com base no filtro ativo.
     * Seleciona o método de cálculo apropriado e combina os dados das duas cidades.
     * 
     * @returns {Object} Dados formatados para Chart.js com datasets para ambas as cidades
     */
      graficoComparativo() {
        switch (this.filtroAtivo) {
          case 'preco':
            return this.gerarGraficoComparativo(
              this.dadosCidade1,
              this.dadosCidade2,
              this.calcularPrecoPorTipo
            )
          case 'tipo':
            return this.gerarGraficoComparativo(
              this.dadosCidade1,
              this.dadosCidade2,
              this.calcularQuantidadePorTipo
            )
          case 'hosts':
            return this.gerarGraficoComparativo(
              this.dadosCidade1,
              this.dadosCidade2,
              this.calcularHostsPorTipo
            )
          case 'reviews':
            return this.gerarGraficoComparativo(
              this.dadosCidade1,
              this.dadosCidade2,
              this.calcularTotalReviewsPorTipo
            )
          default:
            return { labels: [], datasets: [] }
        }
      },
  },
  methods: {
    /**
     * Carrega os dados de ambas as cidades em paralelo usando Promise.all.
     * Define o estado de loading e trata erros.
     * 
     * @async
     * @returns {Promise<void>}
     * @throws {Error} Caso ocorra um erro ao buscar os dados da API
     */
    async fetchDados() {
      this.loading = true
      try {
        const [resp1, resp2] = await Promise.all([
          fetch(`http://localhost:3000/${this.cidade1}.listings`),
          fetch(`http://localhost:3000/${this.cidade2}.listings`),
        ])
        this.dadosCidade1 = await resp1.json()
        this.dadosCidade2 = await resp2.json()
      } catch (err) {
        console.error('Erro ao carregar dados:', err)
        this.dadosCidade1 = []
        this.dadosCidade2 = []
      } finally {
        this.loading = false
      }
    },
    /**
     * Retorna o nome de uma cidade com base no seu identificador.
     * 
     * @param {string} cidade - Identificador da cidade
     * @returns {string} Nome da cidade
     */
    getCidadeNome(cidade) {
      const nomes = { lisboa: 'Lisboa', porto: 'Porto', madrid: 'Madrid', barcelona: 'Barcelona' }
      return nomes[cidade] || cidade
    },
    /**
     * Retorna o nome do filtro com base no seu identificador.
     * 
     * @param {string} filtro - Identificador do filtro
     * @returns {string} Nome do filtro
     */
    getNomeFiltro(filtro) {
      const nomes = { preco: 'Preço', tipo: 'Tipo de Alojamento', hosts: 'Hosts', reviews: 'Reviews' }
      return nomes[filtro] || filtro
    },
    /**
     * Retorna o rótulo informativo para uma métrica específica com base no filtro ativo.
     * 
     * @param {number} index - Índice da métrica (0, 1 ou 2)
     * @returns {string} Rótulo descritivo da métrica
     */
    getInfoLabel(index) {
      const labels = {
        preco: ['Média de Preço por Noite', 'Preço Máximo', 'Preço Mínimo'],
        tipo: ['Número de Entire home/apt', 'Número de Private room', 'Média disponibilidade 365 dias'],
        hosts: ['Número de Hosts', 'Receita Média dos Hosts', 'Percentagem de Hosts com Private Room'],
        reviews: ['Número Médio de Reviews', 'Número Máximo de Reviews', 'Média de Reviews por Mês'],
      }
      return labels[this.filtroAtivo]?.[index] || '-'
    },
    /**
     * Retorna o valor informativo calculado para uma métrica específica com base no filtro ativo.
     * 
     * @param {string} cidade - Identificador da cidade
     * @param {number} index - Índice da métrica (0, 1 ou 2)
     * @returns {string} Valor formatado da métrica
     */
    getInfoValue(cidade, index) {
      const dados = cidade === this.cidade1 ? this.dadosCidade1 : this.dadosCidade2
      if (!dados || dados.length === 0) return '-'
      switch (this.filtroAtivo) {
        case 'preco': return this.calcularPreco(dados, index)
        case 'tipo': return this.calcularTipo(dados, index)
        case 'hosts': return this.calcularHosts(dados, index)
        case 'reviews': return this.calcularReviews(dados, index)
        default: return '-'
      }
    },

    // ------------------- MÉTODOS DE GRÁFICO -------------------
    /**
     * Gera dados para gráfico comparativo entre duas cidades.
     * Aplica o método de cálculo fornecido a ambos os conjuntos de dados
     * e estrutura os resultados para Chart.js.
     * 
     * @param {Array} dados1 - Dados da primeira cidade
     * @param {Array} dados2 - Dados da segunda cidade
     * @param {Function} metodoCalculo - Função para calcular os dados do gráfico
     * @returns {Object} Dados formatados para Chart.js com datasets para ambas as cidades
     */
    gerarGraficoComparativo(dados1, dados2, metodoCalculo) {
      const cores = {
        cidade1: 'rgba(255, 99, 132, 0.7)',
        cidade2: 'rgba(54, 162, 235, 0.7)',
      }
      const bordas = {
        cidade1: 'rgba(255, 99, 132, 1)',
        cidade2: 'rgba(54, 162, 235, 1)',
      }

      const res1 = metodoCalculo(dados1)
      const res2 = metodoCalculo(dados2)

      const labels = res1.labels.length ? res1.labels : res2.labels

      return {
        labels,
        datasets: [
          {
            label: this.getCidadeNome(this.cidade1),
            data: res1.datasets[0]?.data || [],
            backgroundColor: cores.cidade1,
            borderColor: bordas.cidade1,
            borderWidth: 2,
          },
          {
            label: this.getCidadeNome(this.cidade2),
            data: res2.datasets[0]?.data || [],
            backgroundColor: cores.cidade2,
            borderColor: bordas.cidade2,
            borderWidth: 2,
          },
        ],
      }
    },
    /**
     * Retorna o título do gráfico com base no filtro ativo.
     * 
     * @returns {string} Título apropriado para o gráfico
     */
    getTituloGrafico() {
      const titulos = {
        preco: 'Preço médio por tipo de alojamento',
        tipo: 'Número de alojamentos por tipo',
        hosts: 'Número de hosts por tipo de alojamento',
        reviews: 'Número total de reviews por tipo de alojamento',
      }

      return titulos[this.filtroAtivo] || this.getNomeFiltro(this.filtroAtivo)
    },
    calcularPrecoPorTipo(dados) {
      if (!dados.length) return { labels: [], datasets: [] }
      const mapa = {}
      dados.forEach(l => { if (l.room_type && l.price) { mapa[l.room_type] = mapa[l.room_type] || { total: 0, count: 0 }; mapa[l.room_type].total += l.price; mapa[l.room_type].count++ } })
      const labels = Object.keys(mapa)
      const valores = labels.map(tipo => Math.round(mapa[tipo].total / mapa[tipo].count))
      return { labels, datasets: [{ label: 'Preço médio por noite (€)', data: valores }] }
    },
    calcularTotalReviewsPorTipo(dados) {
      if (!dados.length) return { labels: [], datasets: [] }
      const mapa = {}
      dados.forEach(l => { if (l.room_type && l.number_of_reviews != null) { mapa[l.room_type] = (mapa[l.room_type] || 0) + l.number_of_reviews } })
      const labels = Object.keys(mapa)
      const valores = labels.map(tipo => mapa[tipo])
      return { labels, datasets: [{ label: 'Número total de reviews', data: valores }] }
    },
    calcularQuantidadePorTipo(dados) {
      if (!dados.length) return { labels: [], datasets: [] }

      const mapa = {}

      dados.forEach(l => {
        if (l.room_type) {
          mapa[l.room_type] = (mapa[l.room_type] || 0) + 1
        }
      })

      const labels = Object.keys(mapa)
      const valores = labels.map(tipo => mapa[tipo])

      return {
        labels,
        datasets: [
          {
            label: 'Número de alojamentos',
            data: valores,
          },
        ],
      }
    },
    /** 
     * Calcula o número de hosts únicos por tipo de alojamento.
     * 
     * @param {Array} dados - Array de objetos com dados dos alojamentos
     * @returns {Object} Objeto com estrutura compatível com Chart.js
     */
    calcularHostsPorTipo(dados) {
      if (!dados.length) return { labels: [], datasets: [] }

      const mapa = {}

      dados.forEach(l => {
        if (!l.room_type || !l.host_id) return

        if (!mapa[l.room_type]) {
          mapa[l.room_type] = new Set()
        }
        mapa[l.room_type].add(l.host_id)
      })

      const labels = Object.keys(mapa)
      const valores = labels.map(tipo => mapa[tipo].size)

      return {
        labels,
        datasets: [
          {
            label: 'Número de hosts',
            data: valores,
          },
        ],
      }
    },
    /** 
     * Calcula estatísticas sobre preços.
     * 
     * @param {Array} dados - Array de objetos com dados dos alojamentos
     * @param {number} index - Índice indicando qual estatística calcular
     *                         (0=média, 1=máximo, 2=mínimo)
     * @returns {string} Valor formatado
     */
    calcularPreco(dados, index) {
      const precos = dados.map((l) => l.price).filter((p) => p > 0)
      if (precos.length === 0) return '-'

      switch (index) {
        case 0: {
          // Média de preço por noite
          const media = precos.reduce((sum, p) => sum + p, 0) / precos.length
          return `${media.toFixed(2)} €`
        }
        case 1: {
          // Preço máximo
          const max = Math.max(...precos)
          return `${max.toFixed(2)} €`
        }
        case 2: {
          // Preço mínimo
          const min = Math.min(...precos)
          return `${min.toFixed(2)} €`
        }
        default:
          return '-'
      }
    },
    /** 
     * Calcula estatísticas sobre tipos de alojamento.
     * 
     * @param {Array} dados - Array de objetos com dados dos alojamentos
     * @param {number} index - Índice indicando qual estatística calcular
     *                         (0=número de Entire home/apt, 1=número de Private room, 2=média disponibilidade 365 dias)
     * @returns {string} Valor formatado
     */
    calcularTipo(dados, index) {
      switch (index) {
        case 0: {
          // Número de Entire home/apt
          const count = dados.filter((l) => l.room_type === 'Entire home/apt').length
          return count.toLocaleString('pt-PT')
        }
        case 1: {
          // Número de Private room
          const count = dados.filter((l) => l.room_type === 'Private room').length
          return count.toLocaleString('pt-PT')
        }
        case 2: {
          // Média disponibilidade 365 dias
          const disponibilidades = dados.map((l) => l.availability_365).filter((d) => d >= 0)
          if (disponibilidades.length === 0) return '-'
          const media = disponibilidades.reduce((sum, d) => sum + d, 0) / disponibilidades.length
          return `${media.toFixed(0)} dias`
        }
        default:
          return '-'
      }
    },
    /** 
     * Calcula estatísticas sobre hosts.
     * 
     * @param {Array} dados - Array de objetos com dados dos alojamentos
     * @param {number} index - Índice indicando qual estatística calcular
     *                         (0=número de hosts únicos, 1=receita média dos hosts, 2=percentagem de hosts com private room)
     * @returns {string} Valor formatado
     */
    calcularHosts(dados, index) {
      switch (index) {
        case 0: {
          // Número de Hosts únicos
          const hostsUnicos = new Set(dados.map((l) => l.host_id))
          return hostsUnicos.size.toLocaleString('pt-PT')
        }
        case 1: {
          // Receita média dos hosts (preço médio * número de listagens)
          const hostsMap = new Map()
          dados.forEach((listing) => {
            if (!hostsMap.has(listing.host_id)) {
              hostsMap.set(listing.host_id, { totalPreco: 0, count: 0 })
            }
            const hostData = hostsMap.get(listing.host_id)
            hostData.totalPreco += listing.price
            hostData.count += 1
          })

          let receitaTotal = 0
          hostsMap.forEach((data) => {
            receitaTotal += data.totalPreco
          })

          const receitaMedia = receitaTotal / hostsMap.size
          return `${receitaMedia.toFixed(2)} €`
        }
        case 2: {
          // Percentagem de hosts com private room
          const hostsComPrivateRoom = new Set()
          const todosHosts = new Set()

          dados.forEach((listing) => {
            todosHosts.add(listing.host_id)
            if (listing.room_type === 'Private room') {
              hostsComPrivateRoom.add(listing.host_id)
            }
          })

          const percentagem = (hostsComPrivateRoom.size / todosHosts.size) * 100
          return `${percentagem.toFixed(1)}%`
        }
        default:
          return '-'
      }
    },
    /** 
     * Calcula estatísticas sobre reviews.
     * 
     * @param {Array} dados - Array de objetos com dados dos alojamentos
     * @param {number} index - Índice indicando qual estatística calcular
     *                         (0=número médio de reviews, 1=número máximo de reviews, 2=média de reviews por mês)
     * @returns {string} Valor formatado
     */
    calcularReviews(dados, index) {
      switch (index) {
        case 0: {
          // Número médio de reviews
          const reviews = dados.map((l) => l.number_of_reviews).filter((r) => r >= 0)
          if (reviews.length === 0) return '-'
          const media = reviews.reduce((sum, r) => sum + r, 0) / reviews.length
          return media.toFixed(1)
        }
        case 1: {
          // Número máximo de reviews
          const reviews = dados.map((l) => l.number_of_reviews).filter((r) => r >= 0)
          if (reviews.length === 0) return '-'
          const max = Math.max(...reviews)
          return max.toLocaleString('pt-PT')
        }
        case 2: {
          // Média de reviews por mês
          const reviewsPorMes = dados.map((l) => l.reviews_per_month).filter((r) => r > 0)
          if (reviewsPorMes.length === 0) return '-'
          const media = reviewsPorMes.reduce((sum, r) => sum + r, 0) / reviewsPorMes.length
          return media.toFixed(2)
        }
        default:
          return '-'
      }
    },
  },
}
</script>

<style scoped>
.zona-filtrada {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.titulo-comparacao {
  color: var(--collor-airbnb);
  font-size: 2rem;
  text-align: center;
  margin: 0;
}

.subtitulo-filtro {
  color: #666;
  font-size: 1.3rem;
  text-align: center;
  margin: 0;
  font-weight: normal;
}

.grafico-filtrado {
  margin: 20px 0;
}

.info-boxes {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

.linha-boxes {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 25px;
}

.info-box {
  background-color: white;
  border-radius: 15px;
  padding: 25px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: transform 0.2s ease;
}

.info-box p {
  font-size: 0.95rem;
  color: #666;
  margin-bottom: 10px;
}

.info-box h2 {
  font-size: 2rem;
  color: var(--collor-airbnb);
  margin: 0;
}

.loading-message {
  text-align: center;
  padding: 40px;
  color: #999;
  font-size: 1.2rem;
}
</style>
