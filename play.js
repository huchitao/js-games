var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');

var level;  // 当前关卡
// 获取当前关卡数据
if (parseInt(window.location.href.split("#")[1])) {
    level = parseInt(window.location.href.split("#")[1]);
} else {
    level = 0;
}

//-------------设置关卡-------------
// 所有关卡数据
//-------initNum：转动球数量；waitNum：等待球数量；speed：转动速度-----------
var levelArray = [
    { "initNum": 3, "waitNum": 5, "speed": 200 },
    { "initNum": 4, "waitNum": 8, "speed": 180 },
    { "initNum": 5, "waitNum": 5, "speed": 160 },
    { "initNum": 3, "waitNum": 5, "speed": 140 },
    { "initNum": 4, "waitNum": 8, "speed": 120 },
    { "initNum": 5, "waitNum": 5, "speed": 100 },
    { "initNum": 6, "waitNum": 7, "speed": 90 }
];

//-------------中间大球对象-------------
var bigBall = {
    x: 300,    //大圆圆心x坐标
    y: 200,    //大圆圆心y坐标
    radius: 50, //大圆半径
    lineLen: 130,   // 设置大球圆心与转动球之间的距离
    draw: function (ctx) {
        //-------------绘制中间大球-------------
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
        ctx.closePath();
        ctx.fillStyle = "black";
        ctx.fill();
        ctx.save();

        //---------------------------------绘制大球中间关卡数----------------- 
        if (level === levelArray.length) { // ???
            level = levelArray.length - 1;
        }
        var txt = (level + 1) + "";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.font = "60px sans-serif";
        ctx.strokeStyle = "#EED5B7";
        ctx.fillStyle = "#EED5B7";
        ctx.fillText(txt, this.x, this.y + 5);
        ctx.strokeText(txt, this.x, this.y + 5);
        ctx.restore();
    }
};

//-------------转动球集合对象-------------
var ballList = {
    balls: [],      // 转动球
    len: 0,         // 转动球个数
    radius: 10,     // 转动球半径
    init: function (level) { // 初始化转动球数组 
        this.len = level.initNum;
        // 设置转动数组添加旋转角度
        for (var i = 0; i < this.len; i++) {
            var angle = (360 / this.len) * (i + 1);
            this.balls.push({ "angle": angle, "numStr": "" });
        }
    },
    draw: function (ctx, deg) {   // 绘制转动球集合, deg 大球转到角度
        for (var i = 0; i < this.balls.length; i++) {
            var e = this.balls[i];
            ctx.save();
            ctx.globalCompositeOperation = "destination-over"; // 设置图形组合
            e.angle = e.angle + deg; // 计算转动角度，每次增长 deg
            if (e.angle >= 360) { // 角度超过 360 归零
                e.angle = 0;
            }
            // 绘制大球小球之间的线段
            ctx.moveTo(bigBall.x, bigBall.y);
            var rad = 2 * Math.PI * e.angle / 360;      // 计算旋转弧度
            var x = bigBall.x + bigBall.lineLen * Math.cos(rad);
            var y = bigBall.y + bigBall.lineLen * Math.sin(rad);
            ctx.strokeStyle = "black";
            ctx.lineTo(x, y);
            ctx.stroke();
            ctx.restore();
            // 绘制小球
            ctx.beginPath();
            ctx.arc(x, y, this.radius, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.fillStyle = "black";
            ctx.fill();
            if (e.numStr !== "") {
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";
                ctx.font = "15px sans-serif";
                ctx.strokeStyle = "#fff";
                ctx.fillStyle = "#fff";
                ctx.fillText(e.numStr, x, y);
                ctx.strokeText(e.numStr, x, y);
            }
        }
    }
}
ballList.init(levelArray[level]);                // 初始化转动球集合数据

//-------------等待球集合对象-------------
var waitballList = {
    balls: [],         // 等待球
    len: 0,            // 设置等待球数组初始长度
    radius: 10,       // 等待球半径
    distance: 260,     // 设置等待球距离上方的距离
    init: function (level) { // 初始化等待球数据，level 关卡对象
        this.len = level.waitNum;   // 设置等待球数组长度
        // 设置等待球数组添加数字文本
        for (var i = this.len; i > 0; i--) {
            this.balls.push({ "angle": "", "numStr": i });
        }
    },
    draw: function (ctx) { // 绘制等待球集合，big 大球
        var waitx = bigBall.x;                // 绘制等待球的X坐标
        var waity = bigBall.lineLen + this.distance;   // 绘制等待球的Y坐标

        ctx.clearRect(0, 345, 900, 400);
        for (var i = 0; i < this.balls.length; i++) {
            var e = this.balls[i];
            // 绘制等待球
            ctx.moveTo(waitx, waity);
            ctx.beginPath();
            ctx.arc(waitx, waity, this.radius, 0, Math.PI * 2, true);
            ctx.closePath();
            ctx.fillStyle = "black";
            ctx.fill();
            // 绘制文字
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            ctx.font = "15px sans-serif";
            ctx.strokeStyle = "#fff";
            ctx.fillStyle = "#fff";
            ctx.fillText(e.numStr, waitx, waity);
            ctx.strokeText(e.numStr, waitx, waity);
            // 更新下次等待球纵坐标
            waity += 3 * this.radius;
        }
    }
}
waitballList.init(levelArray[level]);   // 初始化等待球数据


//-------------绘图初始化操作-------------
function init(deg) {
    ctx.clearRect(0, 0, 900, 800);  // 清空画布
    bigBall.draw(ctx);              // 绘制大球

    ballList.draw(ctx, deg);   // 绘制转动球
    waitballList.draw(ctx);    // 绘制等待球
}

// 初始化绘图
init(0);

//---------------------旋转动画----------------------------
setInterval(function () {
    ctx.clearRect(0, 0, 900, 345);      // 清空大球范围

    bigBall.draw(ctx);                  // 绘制大球
    ballList.draw(ctx, 10);    // 绘制旋转球
}, levelArray[level].speed);


//-------------------发射小球--------------------
document.onclick = function () {
    // 等待球为空，返回
    if (waitballList.balls.length === 0) return;

    // waity = lineLen + 200;
    // drawWait();

    var ball = waitballList.balls.shift();    // 等待球顶部移除一个，并返回值
    ball.angle = 90;     // 设置移除的等待球的角度
    var failed = true;   // 成功或失败跳出循环
    //-----------判断是否闯关成功-------------
    var state;  // 用于成功或失败
    // 迭代每一个转动球，判断是否闯关闯关
    for (var i = 0; i < ballList.balls.length; i++) {
        var e = ballList.balls[i];
        if (Math.abs(e.angle - ball.angle) / 2 < 360 * ballList.radius / (bigBall.lineLen * Math.PI)) {
            state = 0;
            break;
        } else if (i === ballList.balls.length - 1 && waitballList.balls.length === 0) {
            // 当前转动球是最后一个，也就是说，所有的转动球都没有碰上，且等待球也没有了，过关
            state = 1;
            break;
        }
    }

    ballList.balls.push(ball);          // 转动球数组中添加刚才移除的等待球
    waitballList.draw(ctx);    // 重新绘制等待球
    ballList.draw(ctx, 0);     // 绘制旋转球，不增加旋转角度

    if (state === 0) {
        alert("闯关失败");
        window.location.href = "index.html#" + level;
    } else if (state === 1) {
        alert("闯关成功");
        level++;
        window.location.href = "index.html#" + level;
    }
}