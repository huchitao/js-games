import { Mountain, Zigzag, Sigzag, Box, Stick, JStick, LStick, Shape } from "./Shape.js";

const SHAPES = [Mountain, Zigzag, Sigzag, Box, 
                Stick, JStick, LStick];

// 游戏对象
let game = {
    // 游戏参数
    canvas: null, ctx: null, fps: 1, timer : null,
    cvsWidth: 900, cvsHeight: 650,
    current : null, // 当前图元
    pause : false,  // 暂停状态

    // 地图对象
    map : {
        gridWidth : 32, // 网格宽度
        width : 10, height : 20, // 地图宽高(网格)
        grids : [], // 二维数组，代表网格数据
        borderWidth : '2px', borderColor : 'blue', fillColor : '#ccc',
        init(){ // 初始化数据
            this.mapWidth = this.gridWidth * this.width;
            this.mapHeight = this.gridWidth * this.height;
            this.grids = new Array(this.height);    // 高度是行
            for(let i = 0; i < this.grids.length; i++){
                this.grids[i] = new Array(this.width);
                for(let j = 0; j < this.width; j++){
                    this.grids[i][j] = 0;   // 当前网格为空
                }
            }
            this.offsetX = (900 - this.mapWidth) / 2;
            this.offsetY = 650 - this.mapHeight;
        },
        draw(ctx){ // 绘制地图
            ctx.save();
            // 填充矩形
            ctx.fillStyle = this.fillColor;
            ctx.fillRect(this.offsetX, this.offsetY, this.mapWidth, this.mapHeight);
            // 绘制边框
            ctx.lineWidth = this.borderWidth;
            ctx.strokeStyle = this.borderColor;
            ctx.strokeRect(this.offsetX, this.offsetY, this.mapWidth, this.mapHeight);
            ctx.restore();

            // 绘制石化的网格
            ctx.save();
            ctx.fillStyle = 'gray';
            ctx.strokeStyle = 'white';
            ctx.lineWidth = this.borderWidth;
            for(let i = 0; i < this.height; i++){
                for(let j = 0; j < this.width; j++){
                    if(this.grids[i][j] == 1){
                        ctx.fillRect(this.offsetX + j * this.gridWidth, this.offsetY + i * this.gridWidth, 
                            this.gridWidth, this.gridWidth);
                        ctx.strokeRect(this.offsetX + j * this.gridWidth, this.offsetY + i * this.gridWidth,
                            this.gridWidth, this.gridWidth);
                    }
                }
            }
            ctx.restore();
        },
        rocky(shape){ // 判断是否触底；触底后石化
            // 1. 判断触底。判断是否碰到石化单元格
            let flag = false;
            let segments = [];
            for(let seg of shape.segments){
                segments.push({x : seg.x, y : seg.y + 1});
            }
            for(let seg of segments) {
                console.log(seg);
                if(seg.y >= this.height || this.grids[seg.y][seg.x] > 0){
                    flag = true; // 该空间是石化单元格
                    break;
                }
            }
            // 2. 石化处理
            if(flag){
                for(let seg of shape.segments) {
                    this.grids[seg.y][seg.x] = 1;
                }
            }
            return flag;
        }    
    },
    // 游戏初始化
    init(){
        this.canvas = document.getElementById('cvs');
        this.ctx = this.canvas.getContext('2d');
        this.map.init();
        this.createShape();
        // 初始化事件处理
        this.initEvent();
    },
    createShape() {  // 创建当前图元
        // 生成一个随机数 0~6
        let n = Math.floor(Math.random() * (SHAPES.length));
        this.current = new SHAPES[n](this.map);
    },
    initEvent(){ // 初始化事件处理
        // 鼠标移动
        window.onkeydown = (e) => {
            if(e.keyCode === 80){ // p
                console.log('暂停');
                this.pause = !this.pause;
            }
            if(!this.pause) {
                switch(e.keyCode){
                    case 37: // 左
                        this.current.left();
                        break;
                    case 38:// 旋转
                        this.current.rotate();
                        break;
                    case 39: // 右
                        this.current.right();
                        break;
                    case 40: // 下
                        this.current.down();
                        break;
                    case 32: // 触底
                        this.current.bottom();
                        break;
                }
                this.frame();
            }
            
        }
    },
    // 帧动画
    frame(){
        this.ctx.clearRect(0, 0, this.cvsWidth, this.cvsHeight);
        this.map.draw(this.ctx); // 地图绘制
        if(this.current){
            this.current.draw(this.ctx);
            this.current.down();        // 下落
            // 判断是否触底；触底后石化
            let flag = this.map.rocky(this.current);
            if(flag) {
                // 如果刚创建出新图元，就判断已经石化，则表示游戏结束
                // if(this.map.rocky(this.current)){
                //     alert('游戏结束！');
                //     this.stop();
                //     return;
                // }
                // 判断是否消除并进行消除？？？
                this.erase();
                this.map.draw(this.ctx); // 地图绘制

                this.createShape();
            } 
        }        
    },
    // 判断是否消除
    erase(){
        // 1. 判断那些行应被消除
        let lines = new Set();
        // 遍历当前图元的所有单元格，判断其所在行是否填满，如填满则记录该行
        for(let seg of this.current.segments){
            let flag = true;    // true 表示应被消除
            for(let i = 0; i < this.map.grids[seg.y].length; i++){
                if(this.map.grids[seg.y][i] === 0) { // 只要有一个空白，就不应被消除
                    flag = false;
                    break;
                }
            }
            if(flag){
                lines.add(seg.y); // 记录被消除的行号
            }
        }
        if(lines.size > 0){
            console.log('================================')
            console.log(lines);
        }
    },
    // 启动游戏
    start(){
        this.init();
        this.timer = setInterval(() => {
            if(!this.pause){
                this.frame();
            }
        }, 1000/this.fps);
    },
    // 停止游戏
    stop(){
        if(this.timer){
            clearInterval(this.timer);
            this.timer = null;
        }
    }
}

// 启动游戏
game.start();
