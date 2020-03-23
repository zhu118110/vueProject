<template>
  <div class="hello">
	<button @click="getData()">
		点击获取数据
	</button>
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',   
  data () {
    return {
		url:"http://localhost:3000",
		obj:{}
    }
  },
	methods:{
		getData(){
			this.$axios.get(this.url+'/product')
			.then(res=>{
				this.obj=res.data;
				// console.log(this.obj)
			})
			.catch(err=>{
				// console.log(err)
			})
		}
	}
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
	
</style>
