/**
 * 游戏菜单页面
 * @function Menu
 * @param context 游戏画布(canvas对象)
 * @property {method} Menu#drawMenu 绘制游戏菜单页面
 * @property {method} Menu#click 游戏菜单页面click事件handler
 */
var Menu = function (context) {
    // 参数根据内容自定义
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

    // 按钮间垂直距离
    var BTN_SPACE_Y = 30 * hscale;
    var BTN_SPACE_X = 40 * wscale;

    // 按钮距离底部边框距离
    var BTNS_DIS_TO_BTM = 140 * hscale;

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


    /**
     * 功能：
     *   1. 完成背景图绘制
     *   2. 完成菜单绘制
     */
    _self.drawMenu = function () {
        _self.ctx.clearRect(0, 0, _self.width, _self.height);
        _self.ctx.save();
        _self.ctx.drawImage(picture["startImage"], 0, 0, 480, 800, 0, 0, _self.width, _self.height);
        _self.ctx.drawImage(picture["startGameImage"], btnStart.posX, btnStart.posY, BTNS_WIDTH, BTNS_HEIGHT);
        _self.ctx.drawImage(picture["rulesImage"], btnIntro.posX, btnIntro.posY, BTNS_WIDTH, BTNS_HEIGHT);
        _self.ctx.restore();
    };

    /**
     * 功能：
     *   1. 根据e对象判断单击的位置是不是“开始按钮”和“游戏简介”按钮
     *   2. 判断按钮并展示相应的窗口或改变相应的游戏状态
     */
    _self.click = function (offsetX, offsetY) {
        var x = offsetX
        var y = offsetY
        var clickStart = x >= btnStart.posX &&
            x <= btnStart.posX + BTNS_WIDTH &&
            y >= btnStart.posY &&
            y <= btnStart.posY + BTNS_HEIGHT;
        var clickIntro = x >= btnIntro.posX &&
            x <= btnIntro.posX + BTNS_WIDTH &&
            y >= btnIntro.posY &&
            y <= btnIntro.posY + BTNS_HEIGHT;
        if (clickStart) {
            window.gameState = GAME_STATE_INIT
        } else if (clickIntro) {
            // 调用简介页面渲染方法
            window.describe.open = true;
        } else {
            // 点击空白交互
        }
    };

};