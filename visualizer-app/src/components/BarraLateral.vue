<template>
  <div class="barra-lateral">
    <h2>Comparar</h2>

    <div class="zona-cidades">
      <select v-model="cidade1" class="select-cidade">
        <option value="">Escolha a cidade 1</option>
        <option value="lisboa">Lisboa</option>
        <option value="porto">Porto</option>
        <option value="madrid">Madrid</option>
        <option value="barcelona">Barcelona</option>
      </select>

      <select v-model="cidade2" class="select-cidade">
        <option value="">Escolha a cidade 2</option>
        <option value="lisboa">Lisboa</option>
        <option value="porto">Porto</option>
        <option value="madrid">Madrid</option>
        <option value="barcelona">Barcelona</option>
      </select>
    </div>

    <div class="zona-filtros">
      <h3>Filtros</h3>

      <div class="filtro-lista">
        <p
          class="filtro-link"
          :class="{ ativo: filtroAtivo === 'preco' }"
          @click="toggleFiltro('preco')"
        >
          Preço
        </p>
        <p
          class="filtro-link"
          :class="{ ativo: filtroAtivo === 'tipo' }"
          @click="toggleFiltro('tipo')"
        >
          Tipo de Alojamentos
        </p>
        <p
          class="filtro-link"
          :class="{ ativo: filtroAtivo === 'hosts' }"
          @click="toggleFiltro('hosts')"
        >
          Hosts
        </p>
        <p
          class="filtro-link"
          :class="{ ativo: filtroAtivo === 'reviews' }"
          @click="toggleFiltro('reviews')"
        >
          Reviews
        </p>
      </div>
    </div>

    <ErroButtonVermelho
      :mostrar="mostrarErroCidadesIguais"
      mensagem="Escolha duas cidades diferentes"
      @fechar="mostrarErroCidadesIguais = false"
    />

    <ErroButtonVermelho
      :mostrar="mostrarErroSemCidades"
      mensagem="Escolha duas cidades primeiro"
      @fechar="mostrarErroSemCidades = false"
    />
  </div>
</template>

<script>
/**
 * Barra lateral para seleção de cidades e filtros
 * 
 * Permite ao utilizador escolher duas cidades para comparar e aplicar filtros aos dados apresentados.
 * Valida a seleção para garantir que as cidades escolhidas são diferentes.
 * 
 * @component
 * @example
 * <BarraLateral
 *   v-model:cidade1="cidade1"
 *   v-model:cidade2="cidade2"
 *   v-model:filtro="filtroAtivo"
 * />
 */
import ErroButtonVermelho from '@/components/buttons/ErroButtonVermelho.vue'

export default {
  name: 'BarraLateral',
  components: {
    /* Componente de botão de erro vermelho */
    ErroButtonVermelho,
  },
  /**
   * Estado reativo do componente
   * @returns {Object} Dados do componente
   * @property {string} cidade1 - Primeira cidade selecionada para comparação
   * @property {string} cidade2 - Segunda cidade selecionada para comparação
   * @property {string} filtroAtivo - Filtro atualmente ativo ('preco', 'tipo', 'hosts', 'reviews')
   * @property {boolean} mostrarErroCidadesIguais - Controla exibição do erro quando as cidades são iguais
   * @property {boolean} mostrarErroSemCidades - Controla exibição do erro quando tenta aplicar filtro sem cidades
   */
  data() {
    return {
      cidade1: '',
      cidade2: '',
      filtroAtivo: '',
      mostrarErroCidadesIguais: false,
      mostrarErroSemCidades: false,
    }
  },
  /**
   * Observadores de mudanças nas propriedades reativas
   * Emitem eventos para componentes pai quando há alterações
   */
  watch: {
    /**
     * Observa mudanças na cidade1
     * @param {string} newValue - Novo valor da cidade1
     * @emits update:cidade1 - Emite o novo valor para o componente pai
     */
    cidade1(newValue) {
      this.validarCidades()
      this.$emit('update:cidade1', newValue)
    },

    /**
     * Observa mudanças na cidade2
     * @param {string} newValue - Novo valor da cidade2
     * @emits update:cidade2 - Emite o novo valor para o componente pai
     */
    cidade2(newValue) {
      this.validarCidades()
      this.$emit('update:cidade2', newValue)
    },

    /**
     * Observa mudanças no filtro ativo
     * @param {string} newValue - Novo valor do filtro
     * @emits update:filtro - Emite o novo valor do filtro para o componente pai
     */
    filtroAtivo(newValue) {
      this.$emit('update:filtro', newValue)
    },
  },
  methods: {
    /**
     * Valida se as duas cidades selecionadas são diferentes
     * Se forem iguais, exibe mensagem de erro e limpa a segunda cidade
     */
    validarCidades() {
      if (this.cidade1 && this.cidade2 && this.cidade1 === this.cidade2) {
        this.mostrarErroCidadesIguais = true
        this.cidade2 = ''
      }
    },
    
    /**
     * Alterna o estado de um filtro (ativa/desativa)
     * Valida se as duas cidades estão selecionadas antes de aplicar o filtro
     * @param {string} filtro - Nome do filtro a ser alternado ('preco', 'tipo', 'hosts', 'reviews')
     */
    toggleFiltro(filtro) {
      if (!this.cidade1 || !this.cidade2) {
        this.mostrarErroSemCidades = true
        return
      }

      // Se clicar no filtro já ativo, desativa-o
      if (this.filtroAtivo === filtro) {
        this.filtroAtivo = ''
      } else {
        this.filtroAtivo = filtro
      }
    },
  },
}
</script>

<style scoped>
.barra-lateral {
  position: sticky;
  top: 50px;
  width: 250px;
  min-width: 250px;
  background-color: #adadad;
  padding: 30px 25px;
  border-radius: 20px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  align-self: flex-start;
}

.barra-lateral h2 {
  margin: 0 0 25px 0;
  font-size: 1.6rem;
  text-align: center;
}

.zona-cidades {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 30px;
  padding-bottom: 25px;
  border-bottom: 2px solid #ddd;
}

.select-cidade {
  padding: 12px 15px;
  border-radius: 10px;
  border: 1px solid black;
  font-size: 1rem;
  background-color: white;
  cursor: pointer;
  font-weight: 500;
}

.zona-filtros {
  margin-top: 20px;
}

.zona-filtros h3 {
  margin: 0 0 20px 0;
  font-size: 1.3rem;
  text-align: center;
}

.filtro-lista {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.filtro-link {
  margin: 0;
  padding: 8px 0;
  font-size: 1rem;
  font-weight: 600;
  color: #000;
  text-decoration: underline;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: left;
}

.filtro-link:hover {
  font-size: 1.1rem;
  transform: translateX(2px);
}

.filtro-link.ativo {
  color: var(--collor-airbnb);
  font-weight: 700;
  text-decoration-color: var(--collor-airbnb);
  text-decoration-thickness: 2px;
}
</style>
