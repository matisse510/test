
/**
 * 游戏结束页面
 * @function Result
 * @param context 游戏画布(canvas对象)
 */
var Result = function(context) {
    var _self = this;
    _self.ctx = context;
    _self.width = CANVAS_WIDTH;
    _self.height = CANVAS_HEIGHT;
    // 需要其它参数自定义...

    // 按钮尺寸(“开始”按钮与“简介”按钮的尺寸是相同的)
    var wscale = wScale;
    var hscale = hScale;
    var BTNS_WIDTH = 188 * wscale;
    var BTNS_HEIGHT = 62 * hscale;

    // 再来一次按钮
    var restartButton = {
        posX: (_self.width - BTNS_WIDTH) / 2,
        posY: _self.height - 125 * hscale - BTNS_HEIGHT
    };

    var scoreNumStyle = { // 游戏分数的自定义样式
        offsetX: 250 * wscale,
        offsetY: 450 * hscale,
        gapX: 10 * wscale,
        width: 20 * wscale,
        height: 28 * hscale
    }

    /**
     * 功能：
     *   1. 完成背景图绘制
     *   2. 完成菜单绘制
     */
    _self.drawResult = function () {
        _self.ctx.clearRect(0, 0, _self.width, _self.height);
        _self.ctx.save();
        _self.ctx.drawImage(picture["gameoverImage"], 0, 0, 480, 800, 0, 0, _self.width, _self.height);
        _self.ctx.drawImage(picture["restartButton"], restartButton.posX, restartButton.posY, BTNS_WIDTH, BTNS_HEIGHT);
        // TODO: 将分数绘制独立为方法，添加到分数对象
        for(var scoreIdx = 0;scoreIdx < gameStage.score.arr.length;scoreIdx++) { // 绘制分数
            if(!gameStage.score.arr[scoreIdx].src) break;
            var x = scoreNumStyle.offsetX + scoreIdx * (scoreNumStyle.width + scoreNumStyle.gapX);
            var y = scoreNumStyle.offsetY;
            _self.ctx.drawImage(gameStage.score.arr[scoreIdx], 0, 0, 63, 86, x, y, scoreNumStyle.width, scoreNumStyle.height);
        }
        _self.ctx.restore();
    };

    _self.click = function(offsetX, offsetY) {
        var x = offsetX
        var y = offsetY
        var clickRestart = x >= restartButton.posX &&
            x <= restartButton.posX + BTNS_WIDTH &&
            y >= restartButton.posY &&
            y <= restartButton.posY + BTNS_HEIGHT;
        if (clickRestart) {
            // gameStage.enemyArray = new EnemyArray();
            // gameStage.fly = new Player();
            gameStage = new GameStage(gameCanvasCtx);

            window.gameState = GAME_STATE_MENU;
            describe.open = true;
            console.log(123)
        }else {
            // 点击空白交互
            console.log('else')
        }
    }


}