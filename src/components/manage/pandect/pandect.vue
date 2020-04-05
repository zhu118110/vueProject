<template>
    <div id="main" >
      <!-- 分类饼图 -->
      <el-row>
        <el-col :span="12">
          <div id="classify" style="height:500px"></div>
        </el-col>

        <el-col :span="12">
          <div id="DailyVisits" style="height:500px"></div>
        </el-col>
			
      </el-row>
    </div>
</template>

<script>
import echarts from 'echarts'
export default {
    name:"pandect",
    data(){
        return{
			url:"http://127.0.0.1:3000",
			pie: '',
			lines:"",
						// 各个标题的饼图
            classifys:{
				readNum:0,
							// 饼图数据
			    opinion:[],
			    opinionData:[]
            },
			
						// 每日访问量的折线图
			DailyVisit:{
				xData:["2020-2-14","2020-2-15","2020-2-16"], //x轴显示的日期
				readSum:[10,15,20],
			},
			amount:0,			
        }
    },
	created() {
		this.getReadNum();
		
	},
    mounted () {
		this.visit()
	},
    methods: {
		// 数组去重
			szqc:function(arr){
				for(var i=0; i<arr.length; i++){
					for(var j=i+1; j<arr.length; j++){
						if(arr[i].kind==arr[j].kind){         //第一个等同于第二个，splice方法删除第二个
							arr[i].reading+=arr[j].reading
							arr.splice(j,1);
							j--;
						}
					}
				}
				return arr;
			},

			szqc2:function(arr){
				for(var i=0; i<arr.length; i++){
					for(var j=i+1; j<arr.length; j++){
						if(arr[i].readDate==arr[j].readDate){         //第一个等同于第二个，splice方法删除第二个
							arr[i].readSum+=arr[j].readSum
							arr.splice(j,1);
							j--;
						}
					}
				}
				return arr;
			},

			// 获取浏览数
			getReadNum(){
				this.$axios.get(this.url+"/getReadNum")
				.then(res=>{
					if(res.data){
						
						for(let i in res.data){
							// 得到总浏览数
							this.classifys.readNum+=res.data[i].reading;
							
							if(res.data[i].reading!==""&&res.data[i].reading>0){
								// 加入value和name属性,否则图表不显示数据
								res.data[i].name=this.szqc(res.data)[i].kind;
								res.data[i].value=this.szqc(res.data)[i].reading;
							}
							// 存储后台给的数据
							this.classifys.opinionData=this.classifys.opinionData.concat(res.data[i]);
						}
						
						// 调用饼图，参数是各个项的数据
						this.readPie(this.classifys.opinionData)
						
					}
				})
				.catch(err=>{
					console.log(err)
				})
			},
			
			// 分类饼图
			readPie(data){
					this.pie = echarts.init(document.getElementById('classify'));
						this.pie.setOption({
							title:{
								text:"各个标题查看比例",
								left: 'center'
							},
								// 不显示鼠标放上去时显示的提示信息
							tooltip: {
							  trigger: 'item',
							  alwaysShowContent:true,
							  formatter: "{b}:{d}%"	
							},

							// 图例的设置
							legend: {   
								orient: 'vertical',
								x: 'left',
									// 因为是饼图，此项也可以是饼图单个数据的 name；所以不写
								// data:data.name
							},
							
							series: [
								{	
									top:0,
									hoverOffset :1,
									type:'pie',
									radius:['0%','50%'],
									avoidLabelOverlap: false,
									data:data,
									// labelLine :{show:true,smooth:true},
									itemStyle:{ 
										normal:{ 
											label:{ 
												show: true, 
												formatter: "{b}:查看{c}次"
												
											}, 	
										} 
									}
								},
							]
						})
			},

			// 获取今日的日期
			visit:function(){
				let today=this.dateStr();
				
				this.$axios.get(this.url+"/getVisited",{params:{
					today:today
				}})
				.then(res=>{
					
					if(res.data){
						
						let todayDate=this.szqc2(res.data);

						 for( let i in todayDate ){
							 this.DailyVisit.xData.push(todayDate[i].readDate);
							 
							 this.DailyVisit.readSum.push(todayDate[i].readSum)
							 this.visitLine(this.DailyVisit.xData,this.DailyVisit.readSum)
						 }
						
					}

				})
				.catch(err=>{
				})
			},

			// 每日查看数量的折线图
			visitLine:function(xDate,serieDate){
				let sum=0;
				for(let i in serieDate){
					sum+=serieDate[i]
				}
				this.lines=echarts.init(document.getElementById("DailyVisits"));
				this.lines.setOption({
					title:{
						text:"每日查看的数量",
						left: 'center',
						subtext:"总浏览"+sum+"次",
						// 副标题的样式
						subtextStyle:{
							fontSize:12,
							textStyle:'middle'
						}
					},
					
					tooltip: {
						trigger: 'item',
						alwaysShowContent:true,
						formatter:"{b}<br/>浏览数:<span style=color:#00B7F9>{c}</span>次"
					},

					legend:{
						show:true,
						y:'bottom',
						x:'center',
					},
					xAxis:[{
						type: 'category',
						data:xDate,
						axisTick:{
							show:true,   //是否显示坐标轴的刻度,默认true
                			alignWithLabel:true,
						}
					}],
					yAxis:{
						type:'value',
						
					},
					dataZoom:[{
						type:'inside',   //内置于坐标系中,可以让用户通过鼠标滑轮、滚动、触屏等来缩放
						xAxisIndex:0,   //指定缩放时控制的哪条轴进行缩放,值时轴的下标
						yAxisIndex:0,
						
						
					}],
					series:[{
						type:'line',
						// name:"",
						data:serieDate,
						itemStyle:{ 
							normal:{ 
								label:{ 
										show: true, 
										formatter: "{c}"
								}, 	
							} 
						}
					}]
				})
			}
    }
}
</script>>

<style scoped>

</style>