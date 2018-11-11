/**
 * 游戏简介页面
 * @param context 游戏画布(canvas对象)
 * @property {method} Describe#drawDescribe 游戏简介页面绘制
 * @property {method} Describe#click 游戏简介页面对象click事件的handler
 */
var Describe = function (context) {
    var _self = this;
    // 参数根据内容自定义
    _self.ctx = context;
    _self.width = SCREEN_WIDTH;
    _self.height = SCREEN_HEIGHT;
    _self.open = false; // 该界面是打开

    // 需要其它参数自定义...

    // 按钮尺寸(“开始”按钮与“简介”按钮的尺寸是相同的)
    var wscale = wScale;
    var hscale = hScale;
    var BTNS_WIDTH = 188 * wscale;
    var BTNS_HEIGHT = 62 * hscale;

    // 按钮间垂直距离
    var BTN_SPACE_Y = 30 * hscale;
    var BTN_SPACE_X = 40 * wscale;

    // 按钮距离底部边框距离
    var BTNS_DIS_TO_BTM = 40 * hscale;

    // 按钮定位
    var BTN_START_OFFSET_X = (_self.width - BTN_SPACE_X) / 2 - BTNS_WIDTH;
    var BTN_START_OFFSET_Y = _self.height - (BTNS_HEIGHT + BTN_SPACE_Y + BTNS_DIS_TO_BTM);
    var BTN_INTRO_OFFSET_X = (_self.width + BTN_SPACE_X) / 2;
    var BTN_INTRO_OFFSET_Y = BTN_START_OFFSET_Y;
    var btnStart = {
        posX: BTN_START_OFFSET_X,
        posY: BTN_START_OFFSET_Y
    };
    var btnIntro = {
        posX: BTN_INTRO_OFFSET_X,
        posY: BTN_INTRO_OFFSET_Y
    };
    var background = {
        x: 0,
        y: 0
    };
    /**
     * 功能：
     *   1. 完成背景图绘制
     *   2. 完成返回按钮绘制
     *   3. 完成开始游戏按钮绘制
     */
    _self.drawDescribe = function () {
        _self.ctx.clearRect(0, 0, _self.width, _self.height);
        _self.ctx.save();
        _self.ctx.drawImage(picture["aircraftbackground"], background.x, background.y, SCREEN_WIDTH, SCREEN_HEIGHT);
        _self.ctx.drawImage(picture["startButton"], btnStart.posX, btnStart.posY, BTNS_WIDTH, BTNS_HEIGHT);
        _self.ctx.drawImage(picture["returnButton"], btnIntro.posX, btnIntro.posY, BTNS_WIDTH, BTNS_HEIGHT);
        _self.ctx.save();
    };

    /**
     * 功能：
     *   1. 根据e对象判断单击的位置是不是“返回按钮”和“开始游戏”按钮
     *   2. 判断按钮并展示相应的窗口或改变相应的游戏状态
     */
    _self.click = function (x, y) {
        var clickStart = x >= btnStart.posX &&
            x <= btnStart.posX + BTNS_WIDTH &&
            y >= btnStart.posY &&
            y <= btnStart.posY + BTNS_HEIGHT;
        var clickReturn = x >= btnIntro.posX &&
            x <= btnIntro.posX + BTNS_WIDTH &&
            y >= btnIntro.posY &&
            y <= btnIntro.posY + BTNS_HEIGHT;
        if (clickStart) {
            _self.open = false;
            window.gameState = GAME_STATE_INIT
        } else if (clickReturn) {
            _self.open = false;
        } else {
            // 点击空白交互
        }


    };

    // 需要其它方法自定义...

};