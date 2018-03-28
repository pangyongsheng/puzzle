(function() {
    function puzzle() {
        this.unit=100;  //block width
        this.place = [ //坐标位置
            [0, 0],
            [1, 0],
            [2, 0],
            [0, 1],
            [1, 1],
            [2, 1],
            [0, 2],
            [1, 2],
            [2, 2]
        ];
        this.bgimg=[ //全部图片路径
            "https://lc-yee5xnhu.cn-n1.lcfile.com/78cb08ed395dec020a3d.jpg",
            "https://lc-yee5xnhu.cn-n1.lcfile.com/29ad0c993bc331bcc990.jpg",
            "https://lc-yee5xnhu.cn-n1.lcfile.com/163f3fa7d694d59c2a73.jpg",
            "https://lc-yee5xnhu.cn-n1.lcfile.com/363b7e3b7be6a9b8e5e5.jpg",
            "https://lc-yee5xnhu.cn-n1.lcfile.com/f2758e2f348db54ac450.jpg"
        ];
        this.block=document.getElementsByClassName("block");//拼图块
        this.order = document.getElementsByClassName("order"); //数字标识
        this.sucessCover=document.getElementById("success");//游戏结束覆盖
        this.stepCount=document.getElementById("step");     //步数
        this.succStep= document.getElementById("suc_step"); //成功步数
        this.btn={
            changeImg:document.getElementById("change"), //-切换图片
            reset:document.getElementById("reset"),      //-切换图片
            showNum:document.getElementById("showNum"), //-显示序号
            prompt:document.getElementById("prompt"),   //-提示
            agian:document.getElementById("successB")   //再来一次按钮
        }
        this.img_ = 0;          //当前图片序号
        this.step=0;            //记录步数
        this.nowOrder=roa([0, 1, 2, 3, 4, 5, 6, 7, 8]);       //当前块排序
        this.purposeOder=[0, 1, 2, 3, 4, 5, 6, 7, 8];         //目标排序
        this.distanceCount=0;
        this.isShowOrder='显示序号';
        //初始化
        this.blockInit();
        this.eventBind();
    }
    //位置初始化
    puzzle.prototype.blockInit=function(){
        var _this=this;
        Array.prototype.forEach.call(this.block,function(ele,i){
            let temp=_this.getCoordinate(i)
            ele.style.left = temp.x * 100 + "px";
            ele.style.top  = temp.y * 100 + "px";
        })
        _this.stepCount.innerHTML = _this.step;
    }
    //获取第i个方块坐标（@位置序号->坐标）
    puzzle.prototype.getCoordinate=function(index){
        return {
            x:this.place[this.nowOrder[index]][0],
            y:this.place[this.nowOrder[index]][1],
        }
    }
    //距离判断(@位置序号->距离)
    puzzle.prototype.distance=function(a,b){
        let aa = this.getCoordinate(a);
        let bb = this.getCoordinate(b);
        return Math.abs(aa.x - bb.x) + Math.abs(aa.y - bb.y);
    }
    //当前总距离
    puzzle.prototype.totalDis=function(){
        var _this=this;
        var temp=0;
        this.nowOrder.forEach(function(ele,index){
            temp+=_this.distance(ele,index);
        })
        return temp;
    }
    //事件绑定
    puzzle.prototype.eventBind=function(){
        var _this = this;
        //block
        Array.prototype.forEach.call(this.block,function(ele,i){
            ele.onclick=function(){
                if(_this.distance(i,8)==1){ //判断是否与第八个相邻
                    var temp=_this.nowOrder[8];
                    _this.nowOrder[8]=_this.nowOrder[i];
                    _this.nowOrder[i]=temp;
                    //统计步数
                    _this.step++;
                    _this.blockInit();
                    //剩余距离
                    _this.distanceCount=_this.totalDis();
                    //判断是否完成
                    console.log(_this.distanceCount)
                    if(_this.distanceCount==0){
                        _this.successShow();
                    }
                }
            }
        })
        //重置&再来一次
        this.btn.reset.onclick = this.btn.agian.onclick=function() {
            _this.nowOrder=roa([0, 1, 2, 3, 4, 5, 6, 7, 8]);
            _this.step=0;
            _this.blockInit();
            _this.eventBind();
            _this.sucessCover.style.display = "none";
            _this.block[8].style.display = "none";
        }
        //显示隐藏数字
        this.btn.showNum.onclick = function() {
            if(_this.isShowOrder=='显示序号'){
                Array.prototype.forEach.call(_this.order,function(ele,i){
                    ele.style.display = "block";
                })
                _this.isShowOrder='隐藏序号';
            }else{
                Array.prototype.forEach.call(_this.order,function(ele,i){
                    ele.style.display = "none";
                })
                _this.isShowOrder='显示序号';
            }
            _this.btn.showNum.innerHTML=_this.isShowOrder;
        }
        //换图
        this.btn.changeImg.onclick = function() {
            if (_this.img_ == 4) _this.img_ = 0;
            else _this.img_++;
            Array.prototype.forEach.call(_this.block,function(ele,i){
                ele.style.backgroundImage = "url(" + _this.bgimg[_this.img_] + ")";
            })
        }
    }
    //状态空间搜索
    
    //成功
    puzzle.prototype.successShow=function(){
        this.block[8].style.display = "block";
        this.sucessCover.style.display = "block";
        this.succStep.innerHTML = this.step;
    }
    //数组随机排序
    function roa(ar) {
        var arr = ar;
        var temp = new Array();
        var count = arr.length;
        for (i = 0; i < count; i++) {
            var num = Math.floor(Math.random() * arr.length);
            temp.push(arr[num]);
            arr.splice(num, 1);
        }
        return temp;
    }
    //获取dom属性
    function getStyle(obj, name) {
        if (obj.currentStyle) {
            return obj.currentStyle[name];
        } else {
            return getComputedStyle(obj, false)[name];
        }
    }
    //对象深拷贝
    function deepCopy(o) {
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

    window.Puzzle=function(){
        new puzzle();
    }

})()


window.onload=function () {
    window.Puzzle();
}
