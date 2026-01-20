<template>
  <button class="ver-mais" @click="$emit('click')">Ver mais</button>
</template>

<script>
/**
 * Botão "Ver mais"
 * 
 * Botão usado para poder ver gráficos ampliados
 * 
 * @component
 * @example
 * <VerMais @click="abrirModal" />
 */
export default {
  name: 'VerMais',
}
</script>

<style scoped>
.ver-mais {
  background-color: var(--collor-airbnb);
  color: white;
  border: none;
  padding: 12px 20px;
  border-radius: 50px;
  font-size: 1.2rem;
  font-weight: 500;
  cursor: pointer;
  box-shadow: 0 4px 15px rgba(255, 107, 122, 0.4);
  transition: all 0.3s ease;
  margin-top: 15px;
  margin-bottom: 20px;
}

.ver-mais:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(255, 107, 122, 0.6);
}

.ver-mais:active {
  transform: translateY(0);
}
</style>
