<template>
  <div class="grafico">
    <div class="chart-placeholder">
      <h3>{{ titulo }}</h3>
      <component :is="chartComponent" :data="dados" :options="chartOptions" />
    </div>

    <VerMais @click="showModal = true" />

    <div v-if="showModal" class="modal-overlay" @click="showModal = false">
      <div class="modal-content" @click.stop>
        <button class="close-button" @click="showModal = false">✕</button>

        <div class="chart-large">
          <h2>{{ titulo }}</h2>
          <component :is="chartComponent" :data="dados" :options="chartOptionsLarge" />
        </div>

        <div class="export-buttons">
          <ExportPDF @export="handleExport" />
          <ExportCSV @export="handleExport" />
          <ExportJSON @export="handleExport" />
        </div>
      </div>
    </div>

    <div v-if="showSuccess" class="success-overlay" @click="showSuccess = false">
      <div class="success-card" @click.stop>
        <div class="checkmark">✓</div>
        <p class="success-message">Ficheiro exportado para<br />{{ exportType }} com sucesso.</p>
        <button class="close-btn" @click="showSuccess = false">Fechar</button>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * Componente de visualização de gráficos
 * 
 * Renderiza diferentes tipos de gráficos (barras, linha, pizza) usando Chart.js.
 * Oferece funcionalidades de:
 * - Visualização em tamanho normal e expandido (modal)
 * - Exportação para PDF, CSV e JSON
 * - Opções de configuração personalizadas
 * 
 * @component
 * @example
 * <GraficoComp
 *   titulo="Preço Médio por Vizinhança"
 *   tipo="bar"
 *   :dados="chartData"
 * />
 */
import { Line as LineChart, Bar as BarChart, Pie as PieChart } from 'vue-chartjs'
import VerMais from './VerMais.vue'
import ExportPDF from './ExportPDF.vue'
import ExportCSV from './ExportCSV.vue'
import ExportJSON from './ExportJSON.vue'

export default {
  name: 'GraficoComp',
  components: {
    LineChart,
    BarChart,
    PieChart,
    VerMais,
    ExportPDF,
    ExportCSV,
    ExportJSON,
  },
  props: {
    /**
     * Título do gráfico
     * @type {string}
     */
    titulo: {
      type: String,
      default: 'Título do Gráfico',
    },
    /**
     * Tipo de gráfico a renderizar
     * @type {'bar' | 'pie' | 'line'}
     */
    tipo: {
      type: String,
      default: 'bar', // 'bar', 'pie', 'line'
    },
    /**
     * Dados do gráfico em formato Chart.js
     * Deve conter 'labels' e 'datasets'
     * @type {Object}
     */
    dados: {
      type: Object,
      default: () => ({
        labels: [],
        datasets: [],
      }),
    },
  },
  data() {
    return {
      /** Controla a visibilidade do modal expandido */
      showModal: false,
      /** Controla a visibilidade da mensagem de sucesso de exportação */
      showSuccess: false,
      /** Tipo de exportação selecionado (PDF/CSV/JSON) */
      exportType: '',
    }
  },
  computed: {
    /**
     * Determina qual componente de gráfico usar com base no tipo
     * @returns {string} Nome do componente Chart.js apropriado
     */
    chartComponent() {
      const componentMap = {
        bar: 'BarChart',
        pie: 'PieChart',
        line: 'LineChart',
      }
      return componentMap[this.tipo] || 'BarChart'
    },
    /**
     * Opções do gráfico para visualização normal
     * @returns {Object} Configuração do Chart.js
     */
    chartOptions() {
      return this.getChartOptions(false)
    },
    /**
     * Opções do gráfico para visualização expandida
     * @returns {Object} Configuração do Chart.js com fontes maiores
     */
    chartOptionsLarge() {
      return this.getChartOptions(true)
    },
  },
  methods: {
    /**
     * Gera as opções de configuração do gráfico
     * 
     * Ajusta tamanhos de fonte e escalas conforme o modo de visualização.
     * Gráficos de barras incluem configuração de eixos.
     * 
     * @param {boolean} isLarge - Se true, usa tamanhos maiores
     * @returns {Object} Objeto de opções do Chart.js
     */
    getChartOptions(isLarge) {
      const baseOptions = {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            display: true,
            position: 'top',
            labels: {
              font: {
                size: isLarge ? 14 : 12,
              },
            },
          },
          tooltip: {
            enabled: true,
          },
        },
      }

      if (this.tipo === 'bar') {
        baseOptions.scales = {
          y: {
            beginAtZero: true,
            ticks: {
              font: {
                size: isLarge ? 12 : 10,
              },
            },
          },
          x: {
            ticks: {
              font: {
                size: isLarge ? 12 : 10,
              },
            },
          },
        }
      }

      return baseOptions
    },
    /**
     * Processa o evento de exportação
     * Exibe mensagem de sucesso ao utilizador
     * 
     * @param {string} type - Tipo de exportação (PDF, CSV ou JSON)
     */
    handleExport(type) {
      this.exportType = type
      this.showSuccess = true
    },
  },
}
</script>

<style scoped>
.grafico {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.chart-placeholder {
  background-color: white;
  border-radius: 20px;
  height: 500px;
  width: 750px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 20px;
  display: flex;
  flex-direction: column;
}

.chart-placeholder h3 {
  text-align: center;
  margin-bottom: 15px;
  color: #333;
  flex-shrink: 0;
}

.chart-placeholder > :not(h3) {
  flex: 1;
  min-height: 350px;
  max-width: 650px;
  max-height: 400px;
  margin: 0 auto;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
  animation: fadeIn 0.2s ease;
}

.modal-content {
  background: #f5f5f5;
  border-radius: 20px;
  padding: 40px;
  max-width: 90%;
  max-height: 90%;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 30px;
  animation: slideUp 0.3s ease;
}

.close-button {
  position: absolute;
  top: 8px;
  right: 8px;
  background: none;
  border: none;
  font-size: 28px;
  color: var(--collor-airbnb);
  cursor: pointer;
  font-weight: bold;
  transition: transform 0.2s ease;
}

.close-button:hover {
  transform: scale(1.1);
}

.chart-large {
  background-color: white;
  border-radius: 20px;
  padding: 30px;
  height: 500px;
  width: 800px;
  display: flex;
  flex-direction: column;
}

.chart-large h2 {
  font-size: 1.5rem;
  margin-bottom: 15px;
  color: #333;
  text-align: center;
  flex-shrink: 0;
}

.chart-large > :not(h2) {
  flex: 1;
  min-height: 0;
  margin: 0 auto;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.export-buttons {
  display: flex;
  justify-content: center;
  gap: 30px;
  flex-wrap: wrap;
}

.export-buttons :deep(.export-btn) {
  background-color: var(--collor-airbnb);
  color: white;
  border: none;
  padding: 14px 40px;
  border-radius: 50px;
  font-size: 1.1rem;
  font-weight: 500;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(255, 107, 122, 0.4);
  transition: all 0.3s ease;
}

.export-buttons :deep(.export-btn):hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 107, 122, 0.6);
}

.export-buttons :deep(.export-btn):active {
  transform: translateY(0);
}

.success-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  animation: fadeIn 0.2s ease;
}

.success-card {
  background: white;
  border: 2px solid var(--collor-airbnb);
  border-radius: 20px;
  padding: 40px 50px;
  text-align: center;
  animation: scaleIn 0.3s ease;
  max-width: 400px;
}

.checkmark {
  font-size: 3rem;
  color: greenyellow;
  margin-bottom: 15px;
  font-weight: bold;
}

.success-message {
  font-size: 1.1rem;
  color: #333;
  margin-bottom: 25px;
  line-height: 1.6;
}

.close-btn {
  background-color: var(--collor-airbnb);
  color: white;
  border: none;
  padding: 10px 30px;
  border-radius: 50px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.3s ease;
}

.close-btn:hover {
  transform: scale(1.05);
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes scaleIn {
  from {
    transform: scale(0.8);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
