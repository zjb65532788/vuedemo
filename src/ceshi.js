import Vue from 'vue'
import App from './App'
/*new Vue({
  el: '#app',
  data: {
    message: 'Hello Vue.js!',
    todos:[
    	{text:'lalala'},
    	{text:'hahahah'}
    ]
  },
  methods: {
    addTodo: function () {
      var text = this.message.trim()
      if (text) {
        this.todos.push({ text: text })
        this.message = ''
      }
    },
    removeTodo: function (index) {
      this.todos.splice(index, 1)
    }
  }
});*/
//组件
/*Vue.component('child', {
  // 声明 props
  props: ['msg'],
  // prop 可以用在模板内
  // 可以用 `this.msg` 设置
  template: '<span>{{ msg }}</span>'
});*/

new Vue({
  el: '#app',
  components: { App }
})