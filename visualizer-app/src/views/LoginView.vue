<template>
  <div class="main-container">
    <div class="left">
      <h1>Inside Airbnb<br />Visualizer</h1>
    </div>
    <div class="right">
      <h1>Login</h1>
      <p>Bem-vindo ao Inside Airbnb Visualizer, faça login para começar.</p>

      <input type="email" placeholder="Email" v-model="email" />

      <input type="password" placeholder="Palavra-passe" v-model="password" />

      <button @click="login">Login</button>
    </div>

    <!-- Popup de erro no login -->
    <div v-if="showError" class="overlay">
      <div class="popup">
        <button class="close" @click="showError = false">✕</button>
        <p><strong>Problema ao fazer login.</strong></p>
        <p>Email ou palavra-passe inválidos.</p>
        <p>Por favor tente novamente.</p>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * Página de login da aplicação
 * 
 * Permite autenticação de utilizadores através de email e palavra-passe.
 * Valida credenciais com o backend e gere o estado de sessão através do localStorage.
 * Exibe mensagens de erro em caso de falha na autenticação.
 * 
 * @component
 * @example
 * <LoginView />
 */
export default {
  name: 'LoginView',
  /**
   * Estado reativo do componente
   * @returns {Object} Dados do componente
   * @property {string} email - Email introduzido pelo utilizador
   * @property {string} password - Palavra-passe introduzida pelo utilizador
   * @property {boolean} showError - Controla exibição do popup de erro de login
   */
  data() {
    return {
      email: '',
      password: '',
      showError: false,
    }
  },
  /**
   * Executado após o componente ser montado
   * Limpa o formulário e remove dados de sessão anterior
   */
  mounted() {
    this.resetForm()
  },

  /**
   * Guard de navegação executado antes de entrar na rota
   * Garante que o formulário é limpo sempre que a página é acedida
   * @param {Object} to - Rota de destino
   * @param {Object} from - Rota de origem
   * @param {Function} next - Função callback para continuar navegação
   */
  beforeRouteEnter(to, from, next) {
    next((vm) => {
      vm.resetForm()
    })
  },

  methods: {
    /**
     * Limpa o formulário de login e remove dados de sessão
     * Remove o utilizador do localStorage para garantir logout completo
     */
    resetForm() {
      this.email = ''
      this.password = ''
      this.showError = false
      localStorage.removeItem('user')
    },
    /**
     * Processa tentativa de login do utilizador
     * Valida campos, autentica com o backend e redireciona em caso de sucesso
     * @async
     * @returns {Promise<void>}
     */
    async login() {
      if (!this.email || !this.password) {
        this.showError = true
        return
      }

      try {
        const response = await fetch(
          `http://localhost:3000/users?email=${this.email}&password=${this.password}`,
        )

        const data = await response.json()

        if (data.length === 0) {
          this.showError = true
        } else {
          const user = data[0]
          localStorage.setItem('user', JSON.stringify(user))
          this.showError = false
          this.$router.push('/inicio')
        }
      } catch (error) {
        console.error(error)
        this.showError = true
      }
    },
  },
}
</script>

<style scoped>
.main-container {
  display: flex;
  height: 100vh;
}

.left {
  flex: 1;
  background-color: var(--collor-airbnb);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

.left h1 {
  font-size: 60px;
  font-weight: 400;
}

.right {
  flex: 1;
  background-color: var(--color-fundo);
  padding: 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.right h1 {
  color: var(--collor-airbnb);
  font-size: 36px;
  margin-bottom: 10px;
  width: 80%;
  text-align: left;
}

.right p {
  margin-bottom: 40px;
  font-size: 1.1rem;
  width: 80%;
  text-align: left;
}

.right input {
  margin-bottom: 20px;
  padding: 12px 20px;
  border-radius: 25px;
  border: 1px solid black;
  outline: none;
  font-size: 16px;
  width: 80%;
}

.right button {
  width: 80%;
  margin-top: 20px;
  padding: 12px;
  border-radius: 25px;
  border: none;
  background-color: var(--collor-airbnb);
  color: white;
  font-size: 18px;
  cursor: pointer;
}

.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
}

.popup {
  background: white;
  padding: 30px 40px;
  border-radius: 20px;
  text-align: center;
  position: relative;
  max-width: 400px;
  border: 2px solid var(--collor-airbnb);
}

.popup p {
  font-size: 1.1rem;
}
.close {
  position: absolute;
  top: 10px;
  right: 15px;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: var(--collor-airbnb);
}
</style>
