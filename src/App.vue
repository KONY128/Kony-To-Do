<template>
  <div id="app">
    <TodoView/>
  </div>
</template>

<script>
import TodoView from './views/TodoView.vue'

export default {
  name: 'App',
  components: {
    TodoView
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
