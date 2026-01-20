<template>
  <div class="barra-filtros">
    <h1>Filtrar por</h1>
    <div id="select-zone">
      <select name="cidade" id="cidade" v-model="cidade">
        <option value="">Escolha uma cidade</option>
        <option value="lisboa">Lisboa</option>
        <option value="porto">Porto</option>
        <option value="madrid">Madrid</option>
        <option value="barcelona">Barcelona</option>
      </select>

      <select name="vizinhanca" id="vizinhanca" v-model="vizinhanca" :disabled="!cidade">
        <option value="">Escolha uma vizinhança</option>
        <option v-for="viz in vizinhancas" :key="viz" :value="viz">
          {{ viz }}
        </option>
      </select>

      <select name="preco" id="preco" v-model="preco">
        <option value="">Escolha um intervalo de preços (€)</option>
        <option value="0-75">0 - 75</option>
        <option value="76-100">76 - 100</option>
        <option value="101-150">101 - 150</option>
        <option value="151+">151+</option>
      </select>

      <select name="tipo" id="tipo" v-model="tipo">
        <option value="">Escolha um tipo de alojamento</option>
        <option value="Entire home/apt">Entire home/apt</option>
        <option value="Private room">Private room</option>
        <option value="Shared room">Shared room</option>
        <option value="Hotel room">Hotel room</option>
      </select>

      <input type="date" name="data" id="data" v-model="data" placeholder="aaaa-mm-dd" />
    </div>

    <ErroButtonVermelho
      :mostrar="mostrarErro"
      mensagem="Escolha uma cidade primeiro"
      @fechar="mostrarErro = false"
    />
  </div>
</template>

<script>
/**
 * Componente BarraFiltros
 * 
 * Permite ao utilizador filtrar dados por cidade, vizinhança, preço, tipo de alojamento e data.
 * Emite eventos para atualizar os filtros selecionados no componente pai.
 * Exibe mensagens de erro se o utilizador tentar selecionar filtros sem escolher uma cidade.
 * 
 * @component
 * @example
 * <BarraFiltros
 *   :cidadeInicial="'lisboa'"
 *   @update:cidade="atualizarCidade"
 *   @update:vizinhanca="atualizarVizinhanca"
 *   @update:preco="atualizarPreco"
 *   @update:tipo="atualizarTipo"
 *   @update:data="atualizarData"
 * />
 */
import ErroButtonVermelho from '@/components/buttons/ErroButtonVermelho.vue'

export default {
  name: 'BarraFiltros',
  components: {
    /* Componente de botão de erro vermelho */
    ErroButtonVermelho,
  },
  /**
   * Props recebidas do componente pai
   * @property {string} cidadeInicial - Cidade pré-selecionada ao carregar o componente
   */
  props: {
    cidadeInicial: {
      type: String,
      default: '',
    },
  },
  /**
   * Estado reativo do componente
   * @returns {Object} Dados do componente
   * @property {string} cidade - Cidade atualmente selecionada
   * @property {string} vizinhanca - Vizinhança atualmente selecionada
   * @property {string} preco - Intervalo de preço selecionado ('0-75', '76-100', '101-150', '151+')
   * @property {string} tipo - Tipo de alojamento selecionado
   * @property {string} data - Data selecionada no formato YYYY-MM-DD
   * @property {Array<string>} vizinhancas - Lista de vizinhanças disponíveis para a cidade selecionada
   * @property {boolean} mostrarErro - Controla exibição do erro quando tenta selecionar filtro sem cidade
   */
  data() {
    return {
      cidade: '',
      vizinhanca: '',
      preco: '',
      tipo: '',
      data: '',
      vizinhancas: [],
      mostrarErro: false,
    }
  },
  /**
   * Inicializa a cidade e carrega as vizinhanças se cidadeInicial foi fornecida
   */
  mounted() {
    // Se houver uma cidade inicial (vinda da página inicial), definir e carregar vizinhanças
    if (this.cidadeInicial) {
      this.cidade = this.cidadeInicial
      this.fetchVizinhancas(this.cidadeInicial)
    }
  },
  /**
   * Observadores de mudanças nas propriedades reativas
   * Validam seleções e emitem eventos para componentes pai
   */
  watch: {
    /**
     * Observa mudanças na prop cidadeInicial
     * @param {string} newValue - Novo valor da cidade inicial
     */
    cidadeInicial: {
      immediate: true,
      handler(newValue) {
        if (newValue && newValue !== this.cidade) {
          this.cidade = newValue
          this.fetchVizinhancas(newValue)
        }
      },
    },
    /**
     * Observa mudanças na cidade selecionada
     * Limpa vizinhança e recarrega lista de vizinhanças disponíveis
     * @param {string} newValue - Novo valor da cidade
     * @emits update:cidade - Emite o novo valor da cidade para o componente pai
     */
    async cidade(newValue) {
      this.$emit('update:cidade', newValue)
      this.vizinhanca = ''
      this.vizinhancas = []

      if (newValue) {
        await this.fetchVizinhancas(newValue)
      }
    },
    /**
     * Observa mudanças na vizinhança selecionada
     * Valida se uma cidade foi selecionada antes de aplicar
     * @param {string} newValue - Novo valor da vizinhança
     * @emits update:vizinhanca - Emite o novo valor da vizinhança para o componente pai
     */
    vizinhanca(newValue) {
      if (newValue && !this.cidade) {
        this.mostrarErro = true
        this.vizinhanca = ''
        return
      }
      this.$emit('update:vizinhanca', newValue)
    },
    /**
     * Observa mudanças no intervalo de preço selecionado
     * Valida se uma cidade foi selecionada antes de aplicar
     * @param {string} newValue - Novo valor do preço
     * @emits update:preco - Emite o novo valor do preço para o componente pai
     */
    preco(newValue) {
      if (newValue && !this.cidade) {
        this.mostrarErro = true
        this.preco = ''
        return
      }
      this.$emit('update:preco', newValue)
    },
    /**
     * Observa mudanças no tipo de alojamento selecionado
     * Valida se uma cidade foi selecionada antes de aplicar
     * @param {string} newValue - Novo valor do tipo
     * @emits update:tipo - Emite o novo valor do tipo para o componente pai
     */
    tipo(newValue) {
      if (newValue && !this.cidade) {
        this.mostrarErro = true
        this.tipo = ''
        return
      }
      this.$emit('update:tipo', newValue)
    },
    /**
     * Observa mudanças na data selecionada
     * Valida se uma cidade foi selecionada antes de aplicar
     * @param {string} newValue - Novo valor da data
     * @emits update:data - Emite o novo valor da data para o componente pai
     */
    data(newValue) {
      if (newValue && !this.cidade) {
        this.mostrarErro = true
        this.data = ''
        return
      }
      this.$emit('update:data', newValue)
    },
  },
  methods: {
    /**
     * Busca as vizinhanças disponíveis para uma cidade específica
     * Faz pedido ao backend para obter os dados e extrai vizinhanças únicas
     * @async
     * @param {string} cidade - Nome da cidade para buscar vizinhanças
     * @returns {Promise<void>}
     */
    async fetchVizinhancas(cidade) {
      try {
        const response = await fetch(`http://localhost:3000/${cidade}.listings`)
        const data = await response.json()

        // Vamos procurar as vizinhanças da cidade escolhida e pomos num Set (assim não há repetidos)
        const vizinhancasSet = new Set()
        data.forEach((listing) => {
          if (listing.neighbourhood) {
            vizinhancasSet.add(listing.neighbourhood)
          }
        })

        // Ordenamos alfabeticamente
        this.vizinhancas = Array.from(vizinhancasSet).sort()
      } catch (error) {
        console.error('Erro ao procurar vizinhanças:', error)
        this.vizinhancas = []
      }
    },
  },
}
</script>

<style scoped>
.barra-filtros {
  margin-top: 0;
}

.barra-filtros h1 {
  margin-top: 0;
  margin-bottom: 15px;
}

#select-zone {
  display: flex;
  gap: 25px;
  flex-wrap: wrap;
  margin-top: 10px;
}

select {
  padding: 10px 20px;
  border-radius: 10px;
  border: 1px solid #ccc;
  font-size: 1.1rem;
  background-color: white;
}

select:disabled {
  background-color: #f5f5f5;
  color: #999;
  cursor: not-allowed;
  opacity: 0.6;
}

input {
  padding: 10px;
  border-radius: 10px;
  border: 1px solid #ccc;
  font-size: 1rem;
  background-color: white;
}
</style>
