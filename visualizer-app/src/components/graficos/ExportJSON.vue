<template>
  <button class="export-btn" @click="handleExport">Exportar JSON</button>
</template>

<script>
/**
 * Botão de exportação para formato JSON
 * 
 * Emite um evento 'export' com o tipo 'JSON' quando clicado.
 * O componente pai é responsável por processar a exportação.
 * 
 * @component
 * @example
 * <ExportJSON @export="handleExport" />
 */
export default {
  name: 'ExportJSON',
  methods: {
    /**
     * Emite evento de exportação para JSON
     * @emits export - Evento com o tipo 'JSON'
     */
    handleExport() {
      this.$emit('export', 'JSON')
    },
  },
}
</script>

<style scoped>
.export-btn {
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

.export-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 107, 122, 0.6);
}

.export-btn:active {
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
  color: var(--collor-airbnb);
  margin-bottom: 15px;
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
