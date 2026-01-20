<template>
  <div class="voltar">
    <button @click="goBack">Voltar</button>
  </div>
</template>

<script>
/**
 * Botão de voltar à página anterior
 * 
 * Utiliza a funcionalidade de navegação do Vue Router
 * para retornar à página anterior no histórico de navegação.
 * 
 * @component
 * @example
 * <VoltarButton />
 */
export default {
  name: 'VoltarButton',
  methods: {
    /**
     * Navega para a página anterior no histórico do navegador
     * Equivalente ao botão 'Voltar' do navegador
     */
    goBack() {
      this.$router.back()
    },
  },
}
</script>

<style scoped>
  .voltar {
    display: flex;
    justify-content: right;
    margin-top: 20px;
  }

  .voltar button {
    background-color: var(--collor-airbnb);
    color: white;
    border: none;
    padding: 10px 20px;
    border-radius: 50px;
    font-size: 1rem;
    font-weight: 500;
    cursor: pointer;
    box-shadow: 0 4px 15px rgba(255, 107, 122, 0.4);
    transition: all 0.3s ease;
  }

  .voltar button:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(255, 107, 122, 0.6);
  }

  .voltar button:active {
    transform: translateY(0);
  }
</style>
