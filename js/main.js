var step=0;												//记录不数
var place=[												//坐标位置
			[0,0],[1,0],[2,0],
			[0,1],[1,1],[2,1],
			[0,2],[1,2],[2,2]
		];											
var img_=0;												//当前图片序号
var bgimg=[												//全部图片路径
	"https://dn-YEe5xNhU.qbox.me/78cb08ed395dec020a3d.jpg",
	"https://dn-YEe5xNhU.qbox.me/29ad0c993bc331bcc990.jpg",
	"https://dn-YEe5xNhU.qbox.me/163f3fa7d694d59c2a73.jpg",
	"https://dn-YEe5xNhU.qbox.me/363b7e3b7be6a9b8e5e5.jpg",
	"https://dn-YEe5xNhU.qbox.me/f2758e2f348db54ac450.jpg"
];

var aBlock=[];
var complete=[];
var open=[];
var closed=[];
	
var side=100;

var oBlock=document.getElementsByClassName("block");	//拼图块
var oOrder=document.getElementsByClassName("order");	//数字标识
var oBtn_c=document.getElementById("change");			//-切换图片
var oBtn_r=document.getElementById("reset");			//-重置
var oBtn_s=document.getElementById("showNum");			//-显示标识
var oBtn_p=document.getElementById("prompt");			//-提示
var oDivSu=document.getElementById("success");			//游戏结束覆盖
var oBtn_Su=document.getElementById("successB");		//再来一次按钮
var oSpan_Step=document.getElementById("step");			//步数
var oSucc_Step=document.getElementById("suc_step");		//成功步数

	
window.onload=function()
{
	
	blockOnload();		    //初始化拼图块
	
	//switch picture切换图片
	oBtn_c.onclick=function(){
		if(img_==5) img_=0;
		else	img_++;
		for(var i=0;i<9;i++)
		{	
			oBlock[i].style.backgroundImage="url("+bgimg[img_]+")";
		}
	}
	//reset重置,再来一次
	oBtn_r.onclick=oBtn_Su.onclick=function(){
		blockOnload();
		step=0;
		oSpan_Step.innerHTML=step;
		oDivSu.style.display="none";
		oBlock[8].style.display="none";
		oSpan_Step.innerHTML=step;

	}
	//show or hidden order显示、隐藏数字
	oBtn_s.onclick=function(){
		if (getStyle(oOrder[0],"display")=="block") {
			 for(var i=0;i<9;i++){
				 oOrder[i].style.display = "none";
			 } 
			 oBtn_s.innerHTML="显示序号";
        } 
		else if ( oOrder[1].style.display == "none") {
             for(var i=0;i<9;i++){
				 oOrder[i].style.display = "block";
			 }  
			  oBtn_s.innerHTML="隐藏序号";
        }
	}
	//提示最佳路径
	oBtn_p.onclick=function(){
		var temp=deepCopy(aBlock);
		var open=[];
		var closed=[];
		var checked=function(){
			var t=0;
			temp.forEach(function(v,i,arr){
				t+=v.dis;
			})
			return t;
		}
		if(checked() != 0){
			
		}
		console.log(aBlock);
		
		
	}
	//End
}

//initialization 初始化拼图块
var blockOnload=function(){	
	var tem=[0,1,2,3,4,5,6,7,8];							//序号数组 用于数据重组
	var pos_ran=roa(tem);
	for(i=0;i<9;i++)
	{
		oBlock[i].index=i;
		aBlock[i]=new createBlock(i,pos_ran[i]);
	}
	console.log(aBlock);
}

//constructed function构造函数
function createBlock(int_id,palse_id){
	this.id=int_id;								//块序号
	this.plac=deepCopy(place[palse_id]);		//块当前位置
	this.purp=deepCopy(place[int_id]);			//块目标位置
	this.dis=0;
	this.obj=document.getElementById("block_"+int_id);
	this.init();
	this.bindEvet();
	this.distance();

}
//position initialization初始化位置
createBlock.prototype.init=function()
{
	this.obj.style.left=this.plac[0]*100+"px";
	this.obj.style.top=this.plac[1]*100+"px";
}
//events bind 拼图块事件绑定
createBlock.prototype.bindEvet=function(){
	var _this=this;
	this.obj.onclick=function(){
		var x1=aBlock[this.index].plac[0];
		var x2=aBlock[8].plac[0];
		var y1=aBlock[this.index].plac[1];
		var y2=aBlock[8].plac[1];
		//console.log(x1,x2,y1,y2);
		//console.log(Math.sqrt(Math.pow(x1-x2,2)+Math.pow(y1-y2,2)));
		if(Math.sqrt(Math.pow(x1-x2,2)+Math.pow(y1-y2,2))===1){	//Check the target position and the current position检查当前块是否在目标位置
			aBlock[this.index].plac[0]=x2;
			aBlock[this.index].plac[1]=y2;
			aBlock[8].plac[0]=x1;
			aBlock[8].plac[1]=y1;
			aBlock[this.index].init();
			aBlock[8].init();
			aBlock[this.index].distance();
			aBlock[8].distance();
			step++;
			oSpan_Step.innerHTML=step;
			console.log(aBlock);
			_this.checked();

		}
	}
}
createBlock.prototype.checked=function(){
	for(var j=0;j<9;j++){
		if(aBlock[j].dis>0){
			return false;
		} 
		if(j==7){
			aBlock[8].init();
			oBlock[8].style.display="block";
			oDivSu.style.display="block";
			oSucc_Step.innerHTML=step;
		}
	}
}
createBlock.prototype.distance=function()
{
	var plT=this.plac[0];
	var plL=this.plac[1];
	var puT=this.purp[0];
	var puL=this.purp[1];
	this.dis=Math.sqrt(Math.pow(plT-puT,2)+Math.pow(plL-puL,2));
	
}
//

//获取随机数
var roa=function(ar)
{
   	var arr=ar;
   	var temp=new Array();
	var count=arr.length;
    for (i=0;i<count;i++)
    { 
        var num=Math.floor(Math.random()*arr.length); 
        temp.push(arr[num]);
        arr.splice(num,1);
    }
    return temp;
}
//获取dom属性
var getStyle=function(obj, name)
{
	if(obj.currentStyle){
		return obj.currentStyle[name];
	}else{
		return getComputedStyle(obj, false)[name];
	}
}
//对象深拷贝
var deepCopy=function(o){  //深拷贝
    if (o instanceof Array) {
        var n = [];
        for (var i = 0; i < o.length; ++i) {
            n[i] = deepCopy(o[i]);
        }
        return n;

    } else if (o instanceof Object) {
        var n = {}
        for (var i in o) {
            n[i] = deepCopy(o[i]);
        }
        return n;
    } else {
        return o;
    }
    
}