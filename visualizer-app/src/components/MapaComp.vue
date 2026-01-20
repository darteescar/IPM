<template>
  <div class="mapa-container">
    <div id="mapa" ref="mapaRef"></div>
  </div>
</template>

<script>
/**
 * Componente de mapa interativo para visualização de anomalias em alojamentos Airbnb.
 * 
 * Este componente utiliza a biblioteca Leaflet para renderizar um mapa interativo
 * que exibe marcadores coloridos representando diferentes tipos de anomalias
 * encontradas nos dados dos alojamentos Airbnb de várias cidades.
 * 
 * Anomalias destacadas:
 * - Alojamentos com disponibilidade acima de 350 dias (marcadores vermelhos)
 * - Alojamentos com número de reviews abaixo de 50 (marcadores azuis)
 * - Alojamentos sem reviews há mais de 1 ano e disponibilidade > 100 dias (marcadores laranja)
 * 
 * Cada marcador inclui um popup com detalhes do alojamento e a descrição da anomalia.
 * 
 * @component
 * @example
 * <MapaComp />
 */
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

export default {
  name: 'MapaComp',
  data() {
    return {
      /** Instância do mapa Leaflet */
      map: null,
      /** Array com todos os marcadores adicionados ao mapa */
      markers: [],
      /** Array com todas as anomalias detectadas nos alojamentos */
      anomalias: [],
    }
  },
  /**
   * Executado após o componente ser montado.
   * Inicializa o mapa, carrega as anomalias das cidades e adiciona os marcadores.
   * 
   * @async
   */
  async mounted() {
    this.initMapa()
    await this.carregarAnomalias()
    this.adicionarMarcadoresAnomalias()
  },
  /**
   * Executado antes do componente ser desmontado.
   * Remove a instância do mapa para liberar recursos e evitar memory leaks.
   */
  beforeUnmount() {
    if (this.map) {
      this.map.remove()
    }
  },
  methods: {
    /**
     * Inicializa o mapa Leaflet e adiciona a camada de tiles do OpenStreetMap.
     * O mapa é centrado na Europa (entre Lisboa, Porto, Madrid e Barcelona)
     * com zoom nível 6 para visualizar todas as cidades.
     * 
     * @returns {void}
     */
    initMapa() {
      // Inicializar mapa centrado na Europa (entre as 4 cidades)
      this.map = L.map(this.$refs.mapaRef).setView([41.0, -3.7], 6)

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(this.map)
    },
    /**
     * Carrega os dados de todas as cidades e identifica anomalias nos alojamentos.
     * 
     * Cidades analisadas: Lisboa, Porto, Madrid e Barcelona
     * 
     * Tipos de anomalias detectadas:
     * - Disponibilidade acima de 350 dias (indica possível uso comercial não declarado)
     * - Número de reviews abaixo de 50 (indica baixa procura ou alojamento recente)
     * 
     * @async
     * @returns {Promise<void>}
     * @throws {Error} Caso ocorra um erro ao buscar os dados da API
     */
    async carregarAnomalias() {
      const cidades = ['lisboa', 'porto', 'madrid', 'barcelona']
      const todasAnomalias = []

      try {
        for (const cidade of cidades) {
          const response = await fetch(`http://localhost:3000/${cidade}.listings`)
          const listings = await response.json()

          listings.forEach((listing) => {
            // Anomalia: Disponibilidade acima de 350 dias
            if (listing.availability_365 > 350) {
              todasAnomalias.push({
                tipo: 'disponibilidade',
                listing: listing,
                cor: '#ff5a5f',
                mensagem: 'Estabelecimento com disponibilidade acima de 350 dias',
              })
            }

            // Anomalia: Número de reviews abaixo de 50
            if (listing.number_of_reviews < 50) {
              todasAnomalias.push({
                tipo: 'reviews',
                listing: listing,
                cor: '#0000ff',
                mensagem: 'Estabelecimento com número de reviews abaixo de 50',
              })
            }

            // Anomalia: Última review há mais de 1 ano E disponibilidade > 100 dias
            if (listing.last_review && listing.availability_365 > 100) {
              const lastReviewDate = new Date(listing.last_review)
              const currentDate = new Date()
              const diffTime = Math.abs(currentDate - lastReviewDate)
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

              // Anomalia: Última review há mais de 1 ano (365 dias) + alta disponibilidade
              if (diffDays > 365) {
                todasAnomalias.push({
                  tipo: 'review_antiga',
                  listing: listing,
                  cor: '#ffa500',
                  mensagem: 'Última review há mais de 1 ano e disponibilidade > 100 dias',
                })
              }
            }


          })
        }

        this.anomalias = todasAnomalias
      } catch (error) {
        console.error('Erro ao carregar anomalias:', error)
      }
    },
    /**
     * Adiciona marcadores ao mapa para cada anomalia detectada.
     * 
     * Cada marcador é criado com:
     * - Cor personalizada conforme o tipo de anomalia
     * - Ícone circular com sombra
     * - Popup informativo com detalhes do alojamento e anomalia
     * 
     * Os marcadores são armazenados no array `markers` para futuras manipulações.
     * 
     * @returns {void}
     */
    adicionarMarcadoresAnomalias() {
      this.anomalias.forEach((anomalia) => {
        const { listing, cor, mensagem, tipo } = anomalia

        // Verificar se latitude e longitude são válidas
        if (!listing.latitude || !listing.longitude) return

        const marker = L.marker([listing.latitude, listing.longitude], {
          icon: L.divIcon({
            className: 'custom-marker',
            html: `<div style="background-color: ${cor}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"></div>`,
            iconSize: [20, 20],
            iconAnchor: [10, 10],
          }),
        }).addTo(this.map)

        // Determinar informação adicional com base no tipo de anomalia
        let infoAdicional = ''
        if (tipo === 'disponibilidade') {
          infoAdicional = `Disponibilidade: ${listing.availability_365} dias`
        } else if (tipo === 'reviews') {
          infoAdicional = `Reviews: ${listing.number_of_reviews}`
        } else if (tipo === 'review_antiga') {
          infoAdicional = `Última review: ${listing.last_review} | Disponibilidade: ${listing.availability_365} dias`
        }

        marker.bindPopup(`
          <div style="font-family: Arial, sans-serif; min-width: 280px; padding: 5px;">
            <h3 style="margin: 5px 0 15px 0; color: ${cor}; font-size: 18px; font-weight: bold; line-height: 1.3;">${listing.name}</h3>
            <p style="margin: 8px 0; font-size: 15px; color: #444; line-height: 1.4;">
              <strong>Anomalia:</strong> ${mensagem}
            </p>
            <p style="margin: 8px 0; font-size: 14px; color: #777;">
              ${infoAdicional}
            </p>
          </div>
        `)

        this.markers.push(marker)
      })
    },
  },
}
</script>

<style scoped>
.mapa-container {
  width: 100%;
  height: 600px;
  border-radius: 15px;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

#mapa {
  width: 100%;
  height: 100%;
}
</style>

<style>
.leaflet-popup-content-wrapper {
  border-radius: 10px;
}

.leaflet-popup-content h3 {
  margin: 0;
  padding: 0;
}

.custom-marker {
  background: transparent;
  border: none;
}
</style>
