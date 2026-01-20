<template>
  <div class="main-container">
    <div id="conteudo">
      <div class="text-box" id="descricao">
        <h1>Descrição do Projeto</h1>
        <p>
          O Inside Airbnb Visualizer é uma aplicação interativa desenvolvida
          no âmbito da Unidade Curricular de Interface Pessoa-Máquina,
          do curso de Engenharia Informática, no ano 2025/26.
        </p>
        <p>
          O sistema permite explorar dados públicos da plataforma InsideAirbnb,
          ajudando os utilizadores a compreender o impacto do alojamento local nas comunidades urbanas.
        </p>
      </div>
      <div class="text-box" id="objetivos">
        <h1>Objetivos Principais</h1>
          <p>Facilitar o acesso e a visualização de dados relacionados ao alojamento do Airbnb</p>
          <p>Promover a transparência no uso de dados urbanos</p>
          <p>Apoiar análises comparativas e a comunicação de resultados</p>
      </div>
      <div class="text-box" id="equipa">
        <h1>Equipa de Desenvolvimento</h1>
        <p><a class="link" href="https://github.com/darteescar" target="_blank" rel="noopener noreferrer">Duarte Escairo</a> (a106936)</p>
        <p><a class="link" href="https://github.com/luis7788" target="_blank" rel="noopener noreferrer">Luís Soares</a> (a106932)</p>
        <p><a class="link"   href="https://github.com/tiagofigueiredo7" target="_blank" rel="noopener noreferrer">Tiago Figueiredo</a> (a106856)</p>
      </div>
      <div class="text-box" id="fontes">
        <h1>Fontes e Créditos</h1>
        <p>
          Todos os dados foram obtidos no
          <a class="link" href="https://insideairbnb.com/get-the-data/" alt="InsideAirbnb">
            InsideAirbnb
          </a>
          , uma fonte pública que disponibiliza informações detalhadas sobre o impacto do Airbnb em várias cidades ao redor do mundo.
        </p>
      </div>
      <div class="text-box" id="quote">
        <p>“Os dados são o ponto de partida - o impacto é o que realmente importa.”</p>
        <p>- Equipa InsideAirbnb Visualizer</p>
      </div>
    </div>
    <VoltarButton />
  </div>
</template>

<script>
/**
 * Página "Sobre"
 * 
 * Exibe informações sobre o projeto Inside Airbnb Visualizer, incluindo:
 * - Descrição do projeto e contexto académico
 * - Objetivos principais da aplicação
 * - Equipa de desenvolvimento com links para perfis GitHub
 * - Fontes e créditos dos dados utilizados (InsideAirbnb)
 * - Citação motivacional da equipa
 * 
 * Inclui botão de voltar.
 * 
 * @component
 */
import VoltarButton from '@/components/buttons/VoltarButton.vue'

export default {
  name: "SobreView",
  components: {
    VoltarButton
  }
}
</script>

<style scoped>
  .main-container {
    margin: 50px;
  }

  #conteudo {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  }

  .text-box {
    background-color: var(--collor-branco);
    border-radius: 20px;
    padding: 1rem;
  }

  .text-box h1 {
    margin: 20px 15px;
  }

  .text-box p {
    margin: 15px;
    font-size: 1.2rem;
    line-height: 1.5;
  }

  .link {
    color: var(--collor-airbnb);
    text-decoration: none;
  }
</style>
