/**
 * Configuração e registro de componentes do Chart.js
 * 
 * Este módulo importa e regista os componentes necessários do Chart.js para criar
 * diferentes tipos de gráficos na aplicação (barras, linhas, circular, etc.).
 * 
 * Componentes registados:
 * - Title;
 * - Tooltip;
 * - Legend;
 * - BarElement;
 * - CategoryScale;
 * - LinearScale;
 * - PointElement;
 * - LineElement;
 * - ArcElement
 * 
 * @module plugins/chart
 * @requires chart.js
 * 
 */

import {
  Chart,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
} from 'chart.js'

/**
 * Regista todos os componentes necessários no Chart.js.
 */
Chart.register(
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
)

/**
 * Exporta a instância do Chart.js com todos os componentes registados
 * @type {Chart}
 */
export default Chart
