/**
 * Configuração das rotas da aplicação
 * 
 * Define todas as rotas disponíveis na aplicação de visualização de dados do Airbnb.
 * Cada rota está associada a um componente Vue específico que representa uma página.
 * 
 * @module router
 */

import { createRouter, createWebHistory } from 'vue-router'
import LoginView from './views/LoginView.vue'
import InicioView from './views/InicioView.vue'
import CompararView from './views/CompararView.vue'
import AnaliseView from './views/AnaliseView.vue'
import MapaView from './views/MapaView.vue'
import SobreView from './views/SobreView.vue'

/**
 * Instância do router da aplicação
 * 
 * Rotas disponíveis:
 * - '/' - Redireciona para a página de login
 * - '/login' - Página de autenticação
 * - '/inicio' - Página inicial da aplicação
 * - '/comparar' - Página de comparação entre cidades
 * - '/analise' - Página de análise detalhada de uma cidade
 * - '/mapa' - Visualização de anomalias no mapa
 * - '/sobre' - Informações sobre o projeto e equipa
 * 
 * 
 */
const router = createRouter({
  history: createWebHistory(),
  routes: [
    /**
     * Rota raiz - Redireciona para o login
     */
    { path: '/', redirect: '/login' },
    
    /**
     * Rota de login
     * meta: hideNavbar - Esconde a navbar e rodapé nesta página
     */
    { path: '/login', component: LoginView, meta: { hideNavbar: true } },
    
    /**
     * Página inicial da aplicação - Visão geral e estatísticas principais
     */
    { path: '/inicio', component: InicioView },
    
    /**
     * Página de comparação - Compara estatísticas entre duas cidades distintas
     */
    { path: '/comparar', component: CompararView },
    
    /**
     * Página de análise - Análise detalhada de uma cidade específica
     */
    { path: '/analise', component: AnaliseView },
    
    /**
     * Página do mapa - Visualização de anomalias
     */
    { path: '/mapa', component: MapaView },
    
    /**
     * Página sobre - Informações do projeto e da equipa
     */
    { path: '/sobre', component: SobreView },
  ],
})

export default router