'use strict';
/*
 * 程序入口
 */
var gameStagePreload = setInterval(function(){
    var gameStagePreloaded = false;
    var count = 0;
    for(var i in gameStagePreloadRes) {
        count++;
        if(gameStagePreloadRes[i] === undefined){
            break;
        }
        if(count === gameStagePreloadRes.count) {
            gameStagePreloaded = true;
        }
    }
    //ERJOIJROIJFOIEJFOEIJFIj!!!!!!
    if(gameStagePreloaded) {
        clearInterval(gameStagePreload)
        gameStagePreload = null;
        ENTRY();
    }
},100)

function ENTRY() {
    $(function () {
        window.intervalId = null; // 主程序轮询
        window.intervalTime = FFT; // 轮询默认时间间隔
        window.gameCanvasCtx = null; // 游戏容器的canvas画布
        window.gameState = null;  // 当前游戏状态
        window.menu = null; // 菜单页面对象
        window.describe = null; // 游戏介绍页面对象
        window.gameStage = null; // 游戏舞台页面对象
        // window.bulletArray = null; // 玩家子弹数组
        // resize();
        initWindow(); // 初始化屏幕相关
        initData(); // 初始化相关游戏数据
        startInterval();
    
        
        if(isMobile()) { // 移动端事件绑定
            $(window).on('touchend',GameTouchendHandler);
            $(window).on('touchmove',GameTouchmoveHandler);
        }else { // pc端事件绑定
            $(window).on('click',GameClickHandler);
            $(window).on('mousemove',GameMousemoveHandler);
        }
        
        /**
         * 窗口发生改变时调用
         */
        // $(window).resize(function () {
        //     // resize();
        // });
    });
}



/**
 * 启动刷新场景轮询
 */
function startInterval(t) {
    var time = t || window.intervalTime
    window.intervalId = setInterval(playGame, time);
}

/**
 * 停止刷新场景轮询
 */
function stopInterval(target) {
    var t = target || window.intervalId
    clearInterval(t);
    t = null;
}

/**
 * 游戏容器宽高初始化
 */
function initWindow() {
    if(isMobile()) {
        var w = $(window).width();
        var h = $(window).height();
    }else {
        var w = 480;
        var h = 800;
    }
    window.SCREEN_WIDTH = w  // 缓存窗口宽高
    window.SCREEN_HEIGHT = h
    // $('#gameCanvas').css({width:w + 'px', height:h + 'px'}) // 设置canvas尺寸
    window.CANVAS_WIDTH = w
    window.CANVAS_HEIGHT = h
    window.wScale = SCREEN_WIDTH / 480; // 界面素材布局按照比例进行缩放
    window.hScale = SCREEN_HEIGHT / 800;

    console.log("当前宽高：" + SCREEN_WIDTH + "," + SCREEN_HEIGHT);

    $("#windowDiv").css({"width": SCREEN_WIDTH});
    $("#windowDiv").css({"height": SCREEN_HEIGHT});
    // gameCanvas init
    gameCanvasCtx = $("#gameCanvas")[0].getContext("2d");
    // gameCanvas.translate(0.5, 0.5);
    $("#gameCanvas").css({"width": SCREEN_WIDTH});
    $("#gameCanvas").css({"height": SCREEN_HEIGHT});
    $("#gameCanvas").attr({"width": CANVAS_WIDTH});
    $("#gameCanvas").attr({"height": CANVAS_HEIGHT});
}

/**
 * 游戏绘制相关数据初始化
 */
function initData() {
    // 全局共享的时间戳
    window.timestamp;

    // 置游戏状态为菜单状态
    window.gameState = GAME_STATE_MENU;
    // gameState = GAME_STATE_OVER;

    window.menu = new Menu(gameCanvasCtx);
    window.gameStage = new GameStage(gameCanvasCtx);
    window.describe = new Describe(gameCanvasCtx);
    window.result = new Result(gameCanvasCtx);
}

/**
 * 根据当前场景，刷新画布
 */
function playGame() {
    window.timestamp = +new Date();
    switch (gameState) {
        // 菜单状态：加载游戏的菜单
        case GAME_STATE_MENU:
            // 绘制menu
            if (describe.open) {
                describe.drawDescribe();
            } else {
                menu.drawMenu();
            }
            break;
        // 初始状态：加载游戏的动画(飞机从底滑到屏幕下方位置)
        case GAME_STATE_INIT:
            gameStage.init();
            break;
        // 开始状态：敌机出现、加载子弹等
        case GAME_STATE_START:
            gameStage.handleBattle();
            gameStage.drawBattleFiled();
            break;
        // 结束状态：生命值耗尽，显示分数
        case GAME_STATE_OVER:
            result.drawResult();
            break
    }
}


/**
 * 监听鼠标的单击事件，根据当前场景执行handler
 * @param {event} e pc端click事件
 */
function GameClickHandler(e) {
    var x = e.offsetX;
    var y = e.offsetY;
    switch (gameState) {
        case GAME_STATE_MENU:
            if (describe.open) {
                describe.click(x, y);
            } else {
                menu.click(x, y);
            }
            break;
        case GAME_STATE_INIT:
            break;
        case GAME_STATE_START:
            gameStage.click(x, y);
            break;
        case GAME_STATE_OVER:
            result.click(x, y);
            break
    }
}

/**
 * 浏览器移动事件，根据当前场景执行handler
 * @param {event} e pc端mousemove事件
 */
function GameMousemoveHandler(e) {
    var x = e.offsetX;
    var y = e.offsetY;
    switch (gameState) {
        case GAME_STATE_MENU:
            break;
        case GAME_STATE_INIT:
            break;
        case GAME_STATE_START:
            gameStage.fly.getStatus() > -1 && gameStage.fly.move(x, y);
            break;
        case GAME_STATE_OVER:

            break;
    }
}

/**
 * 移动端移动事件，根据当前场景执行handler
 * @param {event} e 移动端touchmove事件
 */
function GameTouchmoveHandler(e) {
    var x = event.touches[0].clientX;
    var y = event.touches[0].clientY;
    // console.log(x + "," + y);
    // event.preventDefault(); // 阻止滚动条等事件
    // $(this).css("pointer-events", "none"); // 防止手机点击事件穿透
    switch (gameState) {
        case GAME_STATE_MENU:
            break;
        case GAME_STATE_INIT:
            break;
        case GAME_STATE_START:
            gameStage.fly.getStatus() > -1 && gameStage.fly.move(x, y);
            break;
        case GAME_STATE_OVER:
            break
    }
}

/**
 * 移动端点击事件，根据当前场景执行handler
 * @param {event} e 移动端touchedmove事件
 */
function GameTouchendHandler(e) {
    var x = event.changedTouches[0].clientX;
    var y = event.changedTouches[0].clientY;
    event.preventDefault(); // 阻止滚动条等事件
    $(this).css("pointer-events", "none"); // 防止手机点击事件穿透
    switch (gameState) {
        case GAME_STATE_MENU:
            if (describe.open) {
                describe.click(x, y);
            } else {
                menu.click(x, y);
            }
            break;
        case GAME_STATE_INIT:
            break;
        case GAME_STATE_START:
            gameStage.click(x, y);
            break;
        case GAME_STATE_OVER:
            result.click(x, y);
            break;
    }
}



/**
 * 计算屏幕大小
 */
// function resize() {
//
// }

// 定义一个动物类

// function Animal (opts) {
//     var _opts = opts || {}
//     var _self = this;
//     var aval = 'avalue';
//     // 属性
//     this.name = _opts.name || 'Animal';
//     // 实例方法
//     this.sleep = function(){
//       console.log(this.name + '正在睡觉！');
//     }
//     this.getVal = function() {
//         return aval;
//     }

//     var word = 'hi,there and Hello world!!!';
//     this.say = function() {
//         console.log(word)
//     }
//     function init(opts) {
//         _self.say();
//         aval = opts.val;
//     }
//     init(_opts);
//   }
//   // 原型方法
//   Animal.prototype.eat = function(food) {
//     console.log(this.name + '正在吃：' + food);
//   };
// function Cat(opts){
//     var _opts = opts || {};
//     Animal.call(this, _opts);
//     this.name = _opts.name || 'Tom';
// }
// (function(){
// // 创建一个没有实例方法的类
// var Super = function(){};
// Super.prototype = Animal.prototype;
// //将实例作为子类的原型
// Cat.prototype = new Super();
// })();

// // Test Code
// var cat = new Cat({val:'val 123'});
// console.log(cat.name);
// console.log(cat.sleep());
// console.log(cat instanceof Animal); // true
// console.log(cat instanceof Cat); //true
// cat.eat(' 水果')
// console.log('getval : ',cat.getVal())
// //   cat.say()