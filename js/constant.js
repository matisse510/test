/** ------- 游戏窗口宽高 ------- */
// var SCREEN_WIDTH = 414;
// var SCREEN_HEIGHT = 736;
// var CANVAS_WIDTH = SCREEN_WIDTH * 2
// var CANVAS_HEIGHT = SCREEN_HEIGHT * 2

/** ------- 游戏窗口宽高 ------- */
// var ratio = 1 // canvas像素密度比

/* ------- 游戏图片 ------- */
var picture = new Array();
var imgUrl = 'images/';
var buildImage = function(url) {
    var img = new Image();
    img.src=url;
    return img;
} 


picture['gameStartBgImage'] = buildImage(imgUrl + 'img_bg_level_1.jpg');
picture["playerImage"] = buildImage(imgUrl + 'player.png');
picture["pauseImage"] = buildImage(imgUrl + 'pause.png');
picture["bulletImage"] = buildImage(imgUrl + 'bullet.png');
picture["bulletBoomedImage"] = buildImage(imgUrl + 'tc.png');
picture["EnemyBulletImage"] = buildImage(imgUrl + 'enemyBullet.png');
picture["startImage"] = buildImage(imgUrl + 'startBg.jpg');
picture["startGameImage"] = buildImage(imgUrl + 'IStart.png');
picture["rulesImage"] = buildImage(imgUrl + 'rules.png');
picture["aircraftbackground"] = buildImage(imgUrl + 'introducer.jpg');
picture["startButton"] = buildImage(imgUrl + 'startButton.png');
picture["returnButton"] = buildImage(imgUrl + 'IReturn.png');
picture["goonButton"] = buildImage(imgUrl + 'goon.png');
picture["restartButton"] = buildImage(imgUrl + 'restart.png');
picture["gameoverImage"] = buildImage(imgUrl + 'over.jpg');
picture['font0'] = buildImage(imgUrl + 'imgFont0.png');
picture['font1'] = buildImage(imgUrl + 'imgFont1.png');
picture['font2'] = buildImage(imgUrl + 'imgFont2.png');
picture['font3'] = buildImage(imgUrl + 'imgFont3.png');
picture['font4'] = buildImage(imgUrl + 'imgFont4.png');
picture['font5'] = buildImage(imgUrl + 'imgFont5.png');
picture['font6'] = buildImage(imgUrl + 'imgFont6.png');
picture['font7'] = buildImage(imgUrl + 'imgFont7.png');
picture['font8'] = buildImage(imgUrl + 'imgFont8.png');
picture['font9'] = buildImage(imgUrl + 'imgFont9.png');
picture['enemy1'] = buildImage(imgUrl + 'enemy1.png');
picture['enemy'] = buildImage(imgUrl + 'enemy.png');
picture['bigEnemy'] = buildImage(imgUrl + 'bigEnemy.png');

/* ------- 游戏状态 ------- */
var GAME_STATE_MENU = 0; // describe.open，true是介绍页面状态，false是游戏欢迎页面。默认false
var GAME_STATE_INIT = 1;
var GAME_STATE_START = 2;
var GAME_STATE_OVER = 3;

/* ------- 游戏画面刷新的默认时间间隔 ------- */
FFT = 1000 / 60;
