<template>
  <div class="hello">
    <h1>sdfwefwf{{ msg }}{{msg2}}</h1>
  </div>
</template>

<script>
console.log('ddd');
export default {
  props:['msg2'],
  data () {
    return {
      // note: changing this line won't causes changes
      // with hot-reload because the reloaded component
      // preserves its current state and we are modifying
      // its initial state.
      msg: 'Hello World!'
    }
  }
}
</script>
