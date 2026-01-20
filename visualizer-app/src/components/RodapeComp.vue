<template>
  <footer id="rodape">
    <p>Inside Airbnb Visualizer &copy; 2026</p>
    <p>Made with 🖤 by Tiago, Duarte e Luís</p>
  </footer>
</template>

<script>
/**
 * Rodapé da aplicação
 * 
 * Exibe informações sobre os autores do projeto.
 * Posicionado no final de todas as páginas (exceto login).
 * 
 * @component
 */
export default {
  name: 'RodapeComp',
}
</script>

<style scoped>
#rodape {
  background-color: var(--collor-fundo);
  color: #000000;
  text-align: center;
  padding: 0.1rem 0;
  width: 100%;
  margin-top: auto;
  border-top: 1px solid #bdbdbd;
}
</style>
