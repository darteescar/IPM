/**
 * Ponto de entrada principal da aplicação
 * 
 * Este ficheiro inicializa a aplicação, configura os plugins necessários
 * e monta a aplicação com id 'app'.
 * 
 * @module main
 */

/* Importa o css global da aplicação */
import './assets/main.css'

/* Importa a função de criação de aplicações Vue */
import { createApp } from 'vue'

/* Importa o componente raiz da aplicação */
import App from './App.vue'

/* Importa a configuração de rotas*/
import router from './router'

/* Importa e regista componentes do Chart.js necessários para os gráficos*/
import './plugins/chart'

/**
 * Cria a instância da aplicação Vue
 */
const app = createApp(App)

/**
 * Configura o Vue Router para navegação entre páginas
 */
app.use(router)

/**
 * Monta a aplicação com id 'app'
 * Este elemento está definido no ficheiro index.html
 */
app.mount('#app')
