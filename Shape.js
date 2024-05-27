// 图元接口
function Shape(map){
    this.map = map;
    // 图元的单元格数组
    this.segments = [
        {x : 0, y : 0},
        {x : 0, y : 0},
        {x : 0, y : 0},
        {x : 0, y : 0}];
    // 旋转中心
    this.center = this.segments[1];
}
Shape.prototype.borderColor = 'white';
Shape.prototype.fillColor = 'gray';
Shape.prototype.borderWidth = 2;
// 图元的方向常量
Shape.prototype.UP = 0;
Shape.prototype.RIGHT = 1;
Shape.prototype.DOWN = 2;
Shape.prototype.LEFT = 3;
// 图元类型常量
Shape.prototype.MOUNTAIN = 0;
Shape.prototype.ZIGZAG = 1;
Shape.prototype.SIGZAG = 2;
Shape.prototype.BOX = 3;
Shape.prototype.STICK = 4;
Shape.prototype.JSTICK = 5;
Shape.prototype.LSTICK = 6;

Shape.prototype.direction = Shape.prototype.UP;
Shape.prototype.draw = function(ctx) {
    ctx.save();
    ctx.fillStyle = this.fillColor;
    ctx.lineWidth = this.borderWidth;
    ctx.strokeStyle = this.borderColor;
    for(let seg of this.segments) {
        let x = this.map.offsetX + seg.x * this.map.gridWidth;
        let y = this.map.offsetY + seg.y * this.map.gridWidth;
        // 填充矩形
        ctx.fillRect(x, y, this.map.gridWidth, this.map.gridWidth);
        // 绘制边框
        ctx.strokeRect(x, y, this.map.gridWidth, this.map.gridWidth);
    }
    ctx.restore();
}
// 判断一个单元格是否碰到石化砖块，如果碰到返回 true；否则，返回 false
Shape.prototype.testRocky = function(seg){
    return this.map.grids[seg.y][seg.x] > 0;
},
// 左移
Shape.prototype.left = function(){
    let segments = []; // 将坐标复制一份
    for(let seg of this.segments){
        segments.push({x : seg.x - 1, y : seg.y});
    }

    // 判断每一个单元格是否在左侧越界 或者 是否碰到石化砖块
    for(let seg of segments) {
        if(seg.x < 0 || this.testRocky(seg)) {
            return;
        }
    }
    // 向左移动单元格坐标
    for(let seg of this.segments) {
        seg.x -= 1;
    }
}
// 右移
Shape.prototype.right = function(){
    // 1. 计算向右的坐标
    let segments = []; // 将坐标复制一份
    for(let seg of this.segments){
        segments.push({x : seg.x + 1, y : seg.y});
    }
    // 2. 判断每一个单元格是否在右侧越界 或者 是否碰到石化砖块
    for(let seg of segments) {
        if(seg.x >= this.map.width || this.testRocky(seg)) {
            return;
        }
    }
    // 3. 向右移动单元格坐标
    for(let seg of this.segments) {
        seg.x += 1;
    }
}
// 下移
Shape.prototype.down = function(){
    let segments = []; // 将坐标复制一份
    for(let seg of this.segments){
        segments.push({x : seg.x, y : seg.y + 1});
    }
    
    // 判断每一个单元格是否在下侧越界 或者 是否碰到石化砖块
    for(let seg of segments) {
        if(seg.y >= this.map.height || this.testRocky(seg)) {
            return;
        }
    }
    // 向左移动单元格坐标
    for(let seg of this.segments) {
        seg.y += 1;
    }
}
Shape.prototype.bottom = function(){
    // 1. 判断下移一格是否触底
    // 1.1 如果触底，结束，石化单元格
    // 1.2 否则，继续下移一格，直到触底
    let segments = []; // 将坐标复制一份
    for(let seg of this.segments){
        segments.push({x : seg.x, y : seg.y});
    }
    
    let flag = false;   // flag 表示触底
    while(!flag) {
        for(let seg of segments){
            seg.y += 1;
        }
        // 判断每一个单元格是否触底 或者 是否碰到石化砖块
        for(let seg of segments) {
            if(seg.y >= this.map.height || this.testRocky(seg)) {
                flag = true;
                break;
            }
        }
    }
    // 石化单元格
    for(let i = 0; i < segments.length; i++) {
        this.segments[i].y = segments[i].y - 1;
    }
}
Shape.prototype.rotate = function(){console.log('旋转');}

/* Mountain 图元
        0
       123
*/
function Mountain(map){
    Shape.call(this, map);
    this.direction = Shape.prototype.UP; // 默认方向
    // 单元格坐标
    this.segments[0] = {x : 5, y : 0};
    this.segments[1] = {x : 4, y : 1};
    this.segments[2] = {x : 5, y : 1}; // 中心
    this.segments[3] = {x : 6, y : 1};
}
Mountain.prototype = new Shape();
Mountain.prototype.fillColor = 'red';

// 旋转
Mountain.prototype.rotate = function() {
    // 下一个角度的方向
    let next = this.direction;    
    // 计算下一个方向的坐标
    let segments = [];
    switch(this.direction){
        case this.UP:
            segments.push({x : this.segments[0].x + 1, y : this.segments[0].y + 1});
            segments.push({x : this.segments[1].x + 1, y : this.segments[1].y - 1});
            segments.push({x : this.segments[2].x, y : this.segments[2].y});
            segments.push({x : this.segments[3].x - 1, y : this.segments[3].y + 1});
            next = this.RIGHT;
            break;
        case this.RIGHT:
            segments.push({x : this.segments[0].x - 1, y : this.segments[0].y + 1});
            segments.push({x : this.segments[1].x + 1, y : this.segments[1].y + 1});
            segments.push({x : this.segments[2].x, y : this.segments[2].y});
            segments.push({x : this.segments[3].x - 1, y : this.segments[3].y - 1});
            next = this.DOWN;            
            break;
        case this.DOWN:
            segments.push({x : this.segments[0].x - 1, y : this.segments[0].y - 1});
            segments.push({x : this.segments[1].x - 1, y : this.segments[1].y + 1});
            segments.push({x : this.segments[2].x, y : this.segments[2].y});
            segments.push({x : this.segments[3].x + 1, y : this.segments[3].y - 1});
            next = this.LEFT;
            break;
        case this.LEFT:
            segments.push({x : this.segments[0].x + 1, y : this.segments[0].y - 1});
            segments.push({x : this.segments[1].x - 1, y : this.segments[1].y - 1});
            segments.push({x : this.segments[2].x, y : this.segments[2].y});
            segments.push({x : this.segments[3].x + 1, y : this.segments[3].y + 1});
            next = this.UP;
            break;
    }
    // 判断每一个单元格是否在 左/右/下 方向越界
    for(let seg of segments) {
        if(seg.x < 0    // 左侧越界
            || seg.x >= this.map.width // 右侧越界
            || seg.y >= this.map.height) { // 下方越界
            return;
        }
    }
    // 判断每一个单元格是否碰到石化砖块???

    // 如果可以旋转，则更新坐标和方向
    this.direction = next;
    this.segments = segments;
}

/* Zigzag 图元
        01
         23
*/
function Zigzag(map){
    Shape.call(this, map);
    this.direction = Shape.prototype.LEFT; // 默认方向
    // 单元格坐标
    this.segments[0] = {x : 4, y : 0};
    this.segments[1] = {x : 5, y : 0};
    this.segments[2] = {x : 5, y : 1};  // 中心
    this.segments[3] = {x : 6, y : 1};
}
Zigzag.prototype = new Shape();
Zigzag.prototype.fillColor = '#c4c400';
// 旋转
Zigzag.prototype.rotate = function() {
    // 下一个角度的方向
    let next = this.direction;    
    // 计算下一个方向的坐标
    let segments = [];
    switch(this.direction){
        case this.UP:
            segments.push({x : this.segments[0].x - 2, y : this.segments[0].y});
            segments.push({x : this.segments[1].x - 1, y : this.segments[1].y - 1});
            segments.push({x : this.segments[2].x, y : this.segments[2].y});
            segments.push({x : this.segments[3].x + 1, y : this.segments[3].y - 1});
            next = this.LEFT;
            break;
        case this.LEFT:
            segments.push({x : this.segments[0].x + 2, y : this.segments[0].y});
            segments.push({x : this.segments[1].x + 1, y : this.segments[1].y + 1});
            segments.push({x : this.segments[2].x, y : this.segments[2].y});
            segments.push({x : this.segments[3].x - 1, y : this.segments[3].y + 1});
            next = this.UP;            
            break;
    }
    // 判断每一个单元格是否在 左/右/下 方向越界
    for(let seg of segments) {
        if(seg.x < 0    // 左侧越界
            || seg.x >= this.map.width // 右侧越界
            || seg.y >= this.map.height) { // 下方越界
            return;
        }
    }
    // 判断每一个单元格是否碰到石化砖块???

    // 如果可以旋转，则更新坐标和方向
    this.direction = next;
    this.segments = segments;
}

/* Sigzag 图元
        01
       23
*/
function Sigzag(map){
    Shape.call(this, map);
    this.direction = Shape.prototype.LEFT; // 默认方向
    // 单元格坐标
    this.segments[0] = {x : 5, y : 0};
    this.segments[1] = {x : 6, y : 0};
    this.segments[2] = {x : 4, y : 1};  
    this.segments[3] = {x : 5, y : 1}; // 中心
}
Sigzag.prototype = new Shape();
Sigzag.prototype.fillColor = 'purple';
// 旋转
Sigzag.prototype.rotate = function() {
    // 下一个角度的方向
    let next = this.direction;    
    // 计算下一个方向的坐标
    let segments = [];
    switch(this.direction){
        case this.UP:
            segments.push({x : this.segments[0].x - 1, y : this.segments[0].y - 1});
            segments.push({x : this.segments[1].x, y : this.segments[1].y - 2});
            segments.push({x : this.segments[2].x - 1, y : this.segments[2].y + 1});
            segments.push({x : this.segments[3].x, y : this.segments[3].y});
            next = this.LEFT;
            break;
        case this.LEFT:
            segments.push({x : this.segments[0].x + 1, y : this.segments[0].y + 1});
            segments.push({x : this.segments[1].x, y : this.segments[1].y + 2});
            segments.push({x : this.segments[2].x + 1, y : this.segments[2].y - 1});
            segments.push({x : this.segments[3].x, y : this.segments[3].y});
            next = this.UP;            
            break;
    }
    // 判断每一个单元格是否在 左/右/下 方向越界
    for(let seg of segments) {
        if(seg.x < 0    // 左侧越界
            || seg.x >= this.map.width // 右侧越界
            || seg.y >= this.map.height) { // 下方越界
            return;
        }
    }
    // 判断每一个单元格是否碰到石化砖块???

    // 如果可以旋转，则更新坐标和方向
    this.direction = next;
    this.segments = segments;
}

/* Box 图元
        01
        23
*/
function Box(map){
    Shape.call(this, map);
    this.direction = Shape.prototype.LEFT; // 默认方向
    // 单元格坐标
    this.segments[0] = {x : 5, y : 0}; // 中心
    this.segments[1] = {x : 6, y : 0};
    this.segments[2] = {x : 5, y : 1};  
    this.segments[3] = {x : 6, y : 1};
}
Box.prototype = new Shape();
Box.prototype.fillColor = 'blue';

/* Stick 图元
        0123
*/
function Stick(map){
    Shape.call(this, map);
    this.direction = Shape.prototype.LEFT; // 默认方向
    // 单元格坐标
    this.segments[0] = {x : 4, y : 1}; 
    this.segments[1] = {x : 5, y : 1}; // 中心
    this.segments[2] = {x : 6, y : 1};  
    this.segments[3] = {x : 7, y : 1};
}
Stick.prototype = new Shape();
Stick.prototype.fillColor = 'green';
// 旋转
Stick.prototype.rotate = function() {
    // 下一个角度的方向
    let next = this.direction;    
    // 计算下一个方向的坐标
    let segments = [];
    switch(this.direction){
        case this.UP:
            segments.push({x : this.segments[0].x - 1, y : this.segments[0].y + 1});
            segments.push({x : this.segments[1].x, y : this.segments[1].y});
            segments.push({x : this.segments[2].x + 1, y : this.segments[2].y - 1});
            segments.push({x : this.segments[3].x + 2, y : this.segments[3].y - 2});
            next = this.LEFT;
            break;
        case this.LEFT:
            segments.push({x : this.segments[0].x + 1, y : this.segments[0].y - 1});
            segments.push({x : this.segments[1].x, y : this.segments[1].y});
            segments.push({x : this.segments[2].x - 1, y : this.segments[2].y + 1});
            segments.push({x : this.segments[3].x - 2, y : this.segments[3].y + 2});
            next = this.UP;            
            break;
    }
    // 判断每一个单元格是否在 左/右/下 方向越界
    for(let seg of segments) {
        if(seg.x < 0    // 左侧越界
            || seg.x >= this.map.width // 右侧越界
            || seg.y >= this.map.height) { // 下方越界
            return;
        }
    }
    // 判断每一个单元格是否碰到石化砖块???

    // 如果可以旋转，则更新坐标和方向
    this.direction = next;
    this.segments = segments;
}

/* JStick 图元
        012
          3
*/
function JStick(map){
    Shape.call(this, map);
    this.direction = Shape.prototype.LEFT; // 默认方向
    // 单元格坐标
    this.segments[0] = {x : 4, y : 0};
    this.segments[1] = {x : 5, y : 0}; // 中心
    this.segments[2] = {x : 6, y : 0};
    this.segments[3] = {x : 6, y : 1};
}
JStick.prototype = new Shape();
JStick.prototype.fillColor = 'cyan';

// 旋转
JStick.prototype.rotate = function() {
    // 下一个角度的方向
    let next = this.direction;    
    // 计算下一个方向的坐标
    let segments = [];
    switch(this.direction){
        case this.UP:
            segments.push({x : this.segments[0].x + 1, y : this.segments[0].y + 1});
            segments.push({x : this.segments[1].x, y : this.segments[1].y});
            segments.push({x : this.segments[2].x - 1, y : this.segments[2].y - 1});
            segments.push({x : this.segments[3].x, y : this.segments[3].y - 2});
            next = this.RIGHT;
            break;
        case this.RIGHT:
            segments.push({x : this.segments[0].x - 1, y : this.segments[0].y + 1});
            segments.push({x : this.segments[1].x, y : this.segments[1].y});
            segments.push({x : this.segments[2].x + 1, y : this.segments[2].y - 1});
            segments.push({x : this.segments[3].x + 2, y : this.segments[3].y});
            next = this.DOWN;            
            break;
        case this.DOWN:
            segments.push({x : this.segments[0].x - 1, y : this.segments[0].y - 1});
            segments.push({x : this.segments[1].x, y : this.segments[1].y});
            segments.push({x : this.segments[2].x + 1, y : this.segments[2].y + 1});
            segments.push({x : this.segments[3].x, y : this.segments[3].y + 2});
            next = this.LEFT;
            break;
        case this.LEFT:
            segments.push({x : this.segments[0].x + 1, y : this.segments[0].y - 1});
            segments.push({x : this.segments[1].x, y : this.segments[1].y});
            segments.push({x : this.segments[2].x - 1, y : this.segments[2].y + 1});
            segments.push({x : this.segments[3].x - 2, y : this.segments[3].y});
            next = this.UP;
            break;
    }
    // 判断每一个单元格是否在 左/右/下 方向越界
    for(let seg of segments) {
        if(seg.x < 0    // 左侧越界
            || seg.x >= this.map.width // 右侧越界
            || seg.y < 0               // 上方越界
            || seg.y >= this.map.height) { // 下方越界
            return;
        }
    }
    // 判断每一个单元格是否碰到石化砖块???

    // 如果可以旋转，则更新坐标和方向
    this.direction = next;
    this.segments = segments;
}

/* JStick 图元
        012
        3
*/
function LStick(map){
    Shape.call(this, map);
    this.direction = Shape.prototype.RIGHT; // 默认方向
    // 单元格坐标
    this.segments[0] = {x : 4, y : 0};
    this.segments[1] = {x : 5, y : 0}; // 中心
    this.segments[2] = {x : 6, y : 0};
    this.segments[3] = {x : 4, y : 1};
}
LStick.prototype = new Shape();
LStick.prototype.fillColor = 'pink';

// 旋转
LStick.prototype.rotate = function() {
    // 下一个角度的方向
    let next = this.direction;    
    // 计算下一个方向的坐标
    let segments = [];
    switch(this.direction){
        case this.UP:
            segments.push({x : this.segments[0].x - 1, y : this.segments[0].y - 1});
            segments.push({x : this.segments[1].x, y : this.segments[1].y});
            segments.push({x : this.segments[2].x + 1, y : this.segments[2].y + 1});
            segments.push({x : this.segments[3].x - 2, y : this.segments[3].y});
            next = this.RIGHT;
            break;
        case this.RIGHT:
            segments.push({x : this.segments[0].x + 1, y : this.segments[0].y - 1});
            segments.push({x : this.segments[1].x, y : this.segments[1].y});
            segments.push({x : this.segments[2].x - 1, y : this.segments[2].y + 1});
            segments.push({x : this.segments[3].x, y : this.segments[3].y - 2});
            next = this.DOWN;            
            break;
        case this.DOWN:
            segments.push({x : this.segments[0].x + 1, y : this.segments[0].y + 1});
            segments.push({x : this.segments[1].x, y : this.segments[1].y});
            segments.push({x : this.segments[2].x - 1, y : this.segments[2].y - 1});
            segments.push({x : this.segments[3].x + 2, y : this.segments[3].y});
            next = this.LEFT;
            break;
        case this.LEFT:
            segments.push({x : this.segments[0].x - 1, y : this.segments[0].y + 1});
            segments.push({x : this.segments[1].x, y : this.segments[1].y});
            segments.push({x : this.segments[2].x + 1, y : this.segments[2].y - 1});
            segments.push({x : this.segments[3].x, y : this.segments[3].y + 2});
            next = this.UP;
            break;
    }
    // 判断每一个单元格是否在 左/右/下 方向越界
    for(let seg of segments) {
        if(seg.x < 0    // 左侧越界
            || seg.x >= this.map.width // 右侧越界
            || seg.y < 0               // 上方越界
            || seg.y >= this.map.height) { // 下方越界
            return;
        }
    }
    // 判断每一个单元格是否碰到石化砖块???

    // 如果可以旋转，则更新坐标和方向
    this.direction = next;
    this.segments = segments;
}

export {Mountain, Zigzag, Sigzag, Box, 
    Stick, JStick, LStick, Shape};