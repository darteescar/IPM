<template>
  <div class="main-container">
    <div class="zona-destaques">
      <h1>Destaques</h1>
      <div class="destaques-horizontal">
        <div v-if="loading" class="text-box">
          <p>A carregar dados...</p>
        </div>
        <div v-else v-for="(destaque, index) in destaques" :key="index" class="text-box">
          <p>{{ destaque }}</p>
          <h2>
            {{
              index === 0
                ? listagens.toLocaleString('pt-PT')
                : index === 1
                  ? `${preco_medio} €`
                  : index === 2
                    ? area
                    : index === 3
                      ? hosts.toLocaleString('pt-PT')
                      : media_reviews
            }}
          </h2>
        </div>
      </div>
    </div>

    <div class="zona-cidades">
      <h1>Explorar Cidades</h1>
      <div class="imagens-cidades">
        <div class="cidade-card" @click="irParaCidade('lisboa')">
          <img src="/img/lisboa.jpg" alt="Lisboa" />
          <div class="cidade-overlay">
            <h3>Lisboa</h3>
          </div>
        </div>
        <div class="cidade-card" @click="irParaCidade('porto')">
          <img src="/img/porto.jpg" alt="Porto" />
          <div class="cidade-overlay">
            <h3>Porto</h3>
          </div>
        </div>
        <div class="cidade-card" @click="irParaCidade('barcelona')">
          <img src="/img/barcelona.jpg" alt="Barcelona" />
          <div class="cidade-overlay">
            <h3>Barcelona</h3>
          </div>
        </div>
        <div class="cidade-card" @click="irParaCidade('madrid')">
          <img src="/img/madrid.jpg" alt="Madrid" />
          <div class="cidade-overlay">
            <h3>Madrid</h3>
          </div>
        </div>
      </div>
    </div>

    <div class="zona-graficos">
      <h2>Análises Gerais</h2>
      <div v-if="loading" class="loading-message">
        <p>A carregar gráficos...</p>
      </div>
      <div v-else class="graficos-grid">
        <GraficoComp
          titulo="Preço Médio por Noite por Cidade"
          tipo="bar"
          :dados="dadosGraficoBarras"
        />
        <GraficoComp
          titulo="Distribuição de Tipos de Alojamento"
          tipo="pie"
          :dados="dadosGraficoCircular"
        />
      </div>
    </div>

    <TerminarSessao />
  </div>
</template>

<script>
/**
 * Página inicial da aplicação
 * 
 * Exibe estatísticas globais sobre alojamentos, gráficos de análise geral
 * e cards de cidades para navegação rápida para análises específicas.
 * Carrega dados de todas as cidades disponíveis e calcula métricas agregadas.
 * 
 * @component
 * @example
 * <InicioView />
 */
import TerminarSessao from '@/components/buttons/TerminarSessao.vue'
import GraficoComp from '@/components/graficos/GraficoComp.vue'

export default {
  name: 'InicioView',
  components: {
    /* Botão para terminar sessão */
    TerminarSessao,
    /* Componente para exibição de gráficos */
    GraficoComp,
  },
  /**
   * Estado reativo do componente
   * @returns {Object} Dados do componente
   * @property {number} listagens - Total de listagens ativas em todas as cidades
   * @property {number} preco_medio - Preço médio por noite (€) entre todas as cidades
   * @property {string} area - Nome da cidade com mais alojamentos locais
   * @property {number} hosts - Número total de hosts únicos
   * @property {number} media_reviews - Média de reviews por listagem
   * @property {Array<string>} destaques - Títulos dos cards de destaques exibidos
   * @property {boolean} loading - Estado de carregamento dos dados
   * @property {Object} dadosGraficoBarras - Dados formatados para o gráfico de barras
   * @property {Object} dadosGraficoCircular - Dados formatados para o gráfico circular
   */
  data() {
    return {
      listagens: 0,
      preco_medio: 0,
      area: '-',
      hosts: 0,
      media_reviews: 0,
      destaques: [
        'Listagens ativas no momento',
        'Preço médio por noite',
        'Cidade com mais AL',
        'Número de hosts',
        'Média de reviews por listagem',
      ],
      loading: true,
      dadosGraficoBarras: {
        labels: [],
        datasets: [],
      },
      dadosGraficoCircular: {
        labels: [],
        datasets: [],
      },
    }
  },
  /**
   * Executado após o componente ser montado
   * Carrega todos os dados necessários para a página
   * @async
   */
  async mounted() {
    await this.fetchData()
  },
  methods: {
    /**
     * Busca e processa dados de todas as cidades disponíveis
     * Calcula estatísticas agregadas e prepara dados para gráficos
     * @async
     * @returns {Promise<void>}
     */
    async fetchData() {
      try {
        // Procurar dados de todas as cidades
        const cities = ['madrid', 'porto', 'barcelona', 'lisboa']
        const allListings = []
        const cityCounts = {}
        const cityPrices = {}

        for (const city of cities) {
          const response = await fetch(`http://localhost:3000/${city}.listings`)
          const data = await response.json()

          cityCounts[city] = data.length
          allListings.push(...data.map((listing) => ({ ...listing, city })))

          // Calcular preço médio por cidade
          const validPrices = data.filter((l) => l.price != null && l.price > 0)
          if (validPrices.length > 0) {
            const totalPrice = validPrices.reduce((sum, l) => sum + l.price, 0)
            cityPrices[city] = Math.round(totalPrice / validPrices.length)
          } else {
            cityPrices[city] = 0
          }
        }

        // Calcular total de listagens
        this.listagens = allListings.length

        // Calcular preço médio (apenas listagens com preço válido)
        const validPrices = allListings.filter((l) => l.price != null && l.price > 0)
        if (validPrices.length > 0) {
          const totalPrice = validPrices.reduce((sum, l) => sum + l.price, 0)
          this.preco_medio = Math.round(totalPrice / validPrices.length)
        }

        // Encontrar cidade com mais AL
        let maxCity = ''
        let maxCount = 0
        for (const [city, count] of Object.entries(cityCounts)) {
          if (count > maxCount) {
            maxCount = count
            maxCity = city.charAt(0).toUpperCase() + city.slice(1)
          }
        }
        this.area = maxCity

        // Calcular número de hosts únicos
        const uniqueHosts = new Set(allListings.map((l) => l.host_id))
        this.hosts = uniqueHosts.size

        // Calcular média de reviews por listagem
        const validReviews = allListings.filter((l) => l.number_of_reviews != null)
        if (validReviews.length > 0) {
          const totalReviews = validReviews.reduce((sum, l) => sum + l.number_of_reviews, 0)
          this.media_reviews = Math.round(totalReviews / validReviews.length)
        }

        // Preparar dados para gráfico de barras (preço médio por cidade)
        this.dadosGraficoBarras = {
          labels: ['Lisboa', 'Porto', 'Barcelona', 'Madrid'],
          datasets: [
            {
              label: 'Preço Médio (€)',
              data: [cityPrices.lisboa, cityPrices.porto, cityPrices.barcelona, cityPrices.madrid],
              backgroundColor: [
                'rgba(255, 90, 95, 0.8)',
                'rgba(255, 90, 95, 0.6)',
                'rgba(255, 90, 95, 0.4)',
                'rgba(255, 90, 95, 0.2)',
              ],
              borderColor: 'rgba(255, 90, 95, 1)',
              borderWidth: 2,
            },
          ],
        }

        // Preparar dados para gráfico circular (distribuição de tipos)
        const tiposDistribuicao = allListings.reduce((acc, l) => {
          const tipo = l.room_type || 'Outro'
          acc[tipo] = (acc[tipo] || 0) + 1
          return acc
        }, {})

        const totalListagens = allListings.length
        const tiposLabels = Object.keys(tiposDistribuicao)
        const tiposPercentagens = tiposLabels.map((tipo) =>
          ((tiposDistribuicao[tipo] / totalListagens) * 100).toFixed(1),
        )

        this.dadosGraficoCircular = {
          labels: tiposLabels,
          datasets: [
            {
              label: 'Percentagem',
              data: tiposPercentagens,
              backgroundColor: [
                'rgba(255, 90, 95, 0.8)',
                'rgba(54, 162, 235, 0.8)',
                'rgba(255, 206, 86, 0.8)',
                'rgba(75, 192, 192, 0.8)',
              ],
              borderColor: [
                'rgba(255, 90, 95, 1)',
                'rgba(54, 162, 235, 1)',
                'rgba(255, 206, 86, 1)',
                'rgba(75, 192, 192, 1)',
              ],
              borderWidth: 2,
            },
          ],
        }

        this.loading = false
      } catch (error) {
        console.error('Erro ao carregar dados:', error)
        this.loading = false
      }
    },

    /**
     * Redireciona para a página de análise com uma cidade pré-selecionada
     * @param {string} cidade - Nome da cidade a analisar (lisboa, porto, madrid, barcelona)
     */
    irParaCidade(cidade) {
      // Redirecionar para a página de análise com a cidade pré-selecionada
      this.$router.push({
        path: '/analise',
        query: { cidade },
      })
    },
  },
}
</script>

<style scoped>
.main-container {
  margin: 50px;
}

.zona-destaques {
  margin-bottom: 50px;
}

.zona-destaques h1 {
  margin-bottom: 25px;
}

.destaques-horizontal {
  display: flex;
  gap: 20px;
  overflow-x: auto;
  padding-bottom: 10px;
  scrollbar-width: thin;
  scrollbar-color: var(--collor-airbnb) #f0f0f0;
}

.text-box {
  background-color: white;
  padding: 20px 30px;
  border-radius: 15px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  flex: 1;
  min-width: 200px;
  text-align: center;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
}

.text-box p {
  font-size: 0.95rem;
  color: #666;
  margin-bottom: 10px;
}

.text-box h2 {
  font-size: 2rem;
  color: var(--collor-airbnb);
  margin: 0;
}

.secao-cidades {
  margin-bottom: 50px;
}

.secao-cidades h2 {
  font-size: 2rem;
  color: #333;
  margin-bottom: 25px;
}

.imagens-cidades {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 25px;
}

.cidade-card {
  position: relative;
  height: 250px;
  border-radius: 15px;
  overflow: hidden;
  cursor: pointer;
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
}

.cidade-card:hover {
  transform: scale(1.05);
  box-shadow: 0 8px 20px rgba(255, 90, 95, 0.4);
}

.cidade-card img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: filter 0.3s ease;
}

.cidade-card:hover img {
  filter: brightness(0.8);
}

.cidade-overlay {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent);
  padding: 20px;
  color: white;
}

.cidade-overlay h3 {
  margin: 0;
  font-size: 1.8rem;
  font-weight: bold;
  text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.5);
}

.zona-graficos {
  margin-top: 50px;
  margin-bottom: 50px;
}

.zona-graficos h2 {
  margin-bottom: 25px;
}

.loading-message {
  text-align: center;
  padding: 40px;
  color: #666;
  font-size: 1.2rem;
}

.graficos-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 30px;
}
</style>
