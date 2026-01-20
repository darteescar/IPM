<template>
  <transition name="fade">
    <div v-if="isVisible" class="overlay" @click="fechar">
      <div class="alerta-container" @click.stop>
        <span class="mensagem">{{ mensagem }}</span>
        <button @click="fechar" class="botao-fechar" aria-label="Fechar">
          ✕
        </button>
      </div>
    </div>
  </transition>
</template>

<script>
/**
 * Componente de alerta/erro
 * 
 * Exibe uma mensagem de erro com fundo semi-transparente.
 * O alerta pode ser fechado clicando no botão X ou fora do alerta.
 * 
 * @component
 * @example
 * <ErroButtonVermelho
 *   :mostrar="temErro"
 *   mensagem="Escolha uma cidade primeiro"
 *   @fechar="temErro = false"
 * />
 */
export default {
  name: 'ErroButtonVermelho',
  props: {
    /**
     * Controla a visibilidade do alerta
     * @type {boolean}
     */
    mostrar: {
      type: Boolean,
      default: false
    },
    /**
     * Mensagem de erro a ser exibida
     * @type {string}
     */
    mensagem: {
      type: String,
      default: 'N/A'
    }
  },
  data() {
    return {
      /** Estado interno de visibilidade */
      isVisible: this.mostrar
    }
  },
  watch: {
    /**
     * Observa mudanças na prop 'mostrar' e atualiza o estado interno
     * @param {boolean} newVal - Novo valor da prop mostrar
     */
    mostrar(newVal) {
      this.isVisible = newVal
    }
  },
  methods: {
    /**
     * Fecha o alerta e emite evento para o componente pai
     * @emits fechar - Notifica o componente pai que o alerta foi fechado
     */
    fechar() {
      this.isVisible = false
      this.$emit('fechar')
    }
  }
}
</script>

<style scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: center;
}

.alerta-container {
  background-color: var(--collor-airbnb);
  color: white;
  padding: 15px 20px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  gap: 20px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 1000;
}

.mensagem {
  font-size: 19px;
  font-weight: 700;
}

.botao-fechar {
  background: none;
  border: none;
  color: white;
  font-size: 24px;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.2s;
}

.botao-fechar:hover {
  opacity: 0.7;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from, .fade-leave-to {
  opacity: 0;
}
</style>
