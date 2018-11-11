/**
 * 子弹对象
 * @param {object} opts 自定义初始化属性。一般只用于自定义皮肤，其余的属性目前不需要在生成对象时进行自定义。
 * @property {method} Bullet#getX 获取子弹横坐标
 * @property {method} Bullet#getX 获取子弹纵坐标
 * @property {method} Bullet#getWidth 获取子弹宽度
 * @property {method} Bullet#getHeight 获取子弹高度
 * @property {method} Bullet#getId 获取长度为10位的子弹id（string类型）
 * @property {method} Bullet#calculatePosition 计算子弹坐标方法
 * @property {method} Bullet#drawBullet 绘制子弹方法
 * @property {method} Bullet#boom 子弹爆炸事件handler
 * @property {method} Bullet#boomPattern 绘制子弹爆炸动画当前帧
 * @property {method} Bullet#getStatus 获取子弹状态
 * @propertyx {method} Bullet#setStatus 设置子弹状态
 */
var Bullet = function (opts) {
    // TODO: bullet对象初始化不借助context，但应需要skin。默认是玩家的子弹属性
    var _self = this;
    var opts = opts;
    var wscale = wScale;
    var hscale = hScale;
    _self._isDestroy = false;
    // var _isBoomed = false;
    var _id = +new Date() % 999999 + '' + (Math.floor(Math.random() * 9)); // 生成10位的随机数字符串id
    var _skin = opts.skin || imgToCanvas(picture["bulletImage"]);
    // var _boomSkin = opts.boomSkin || imgToCanvas(picture["bulletImage"])
    var _x = (opts.x || 0) * wscale;
    var _y =(opts.y || 0) * hscale;
    var _width = (opts.width || 28) * wscale;
    var _height = (opts.height || 28) * hscale;
    var _speed = opts.speed || 5;
    var _boomTime = opts.boomTime || 500;
    var _boomBg = gameStagePreloadRes.CRASH_BG;  // 94*92
    var _boomWidth = gameStagePreloadRes.CRASH_BG.width;
    var _boomHeight = gameStagePreloadRes.CRASH_BG.height;
    var _health = 1; // 子弹默认血量为1
    var _status = 1; // 子弹状态。1表示满血，0表示受伤，-1表示爆炸，-2表示需要被销毁
    _self.doMovePattern = opts.doMovePattern || _doMovePattern;
    var _setBulletPos = opts.setBulletPos || _setBulletPosFunc;

    
    function _doMovePattern(_self) {
        // 默认子弹飞行轨迹
    }

    // console.log('bullet width : '+_skin.width+', height : '+_skin.height)

    // var bullet = {
    //     x: 0,
    //     y: 0,
    //     width: 28 * wscale,
    //     height: 28 * hscale,
    //     speed: 5
    // };

    /**
     * 获取子弹id
     */
    _self.getId = function() {
        return _id;
    }

    /**
     * 子弹横坐标accessor
     */
    _self.getX = function() {
        return _x;
    }
    _self.setX = function(val) {
        return _x = val;
    }

    /**
     * 子弹纵坐标accessort
     */
    _self.getY = function() {
        return _y;
    }
    _self.setY = function(val) {
        return _y = val;
    }

    /**
     * 获取子弹宽度
     */
    _self.getWidth = function() {
        return _width;
    }

    /**
     * 获取子弹高度
     */
    _self.getHeight = function() {
        return _height;
    }

    

    /**
     * 计算子弹坐标方法，利用角色的坐标计算子弹的初始坐标
     * @param {Player | Enemy} fly 获取角色对象
     */
    _self.calculatePosition = function(fly) {
        _setBulletPos(fly, _self);
    }
    function _setBulletPosFunc(fly, _self) {
        if(fly instanceof Player) {
            var posX = fly.getX() + fly.getWidth() / 2 - _self.getWidth() / 2;
            var posY = fly.getY() - _self.getWidth();
        }else {
            var posX = fly.getX() + fly.getWidth() / 2 - _self.getWidth() / 2;
            var posY = fly.getY() + fly.getHeight();
        }
        
        _self.setX(posX);
        _self.setY(posY);
        _self._isDestroy = false;
    }

    /**
     * 绘制子弹方法
     */
    _self.drawBullet = function (ctx) {
        var x = _x;
        var y = _y;
        if(_status === -1){
            x = _self.boomX;
            y = _self.boomY;
        }
        ctx.drawImage(_skin, x, y, _width * wscale, _height * hscale);
        _self.doMovePattern(_self);
    }

    /**
     * 子弹爆炸事件handler
     */
    _self.boom = function() {
        // _isBoomed = true;
        // _isDestroy = true;

        // var FFT = 1000;
        _status = -1;
        // _self.boomX = _x + (_width - _boomWidth / 2) / 2;
        // _self.boomY = _y + (_height - _boomHeight / 3) / 2;
        _self.boomX = _x;
        _self.boomY = _y;
        _self.boomTimeNow = 0;
        _self.boomInterval = setInterval(function(){
            _self.boomTimeNow += FFT;
            var now = _self.boomTimeNow;
            var time = _boomTime;
            if(now > time) {
                _status = -2;
            }else {
                _self.boomPattern(_self.boomTimeNow / _boomTime)
            }
            if(_status == -2) {
                clearInterval(_self.boomInterval);
                _self.boomInterval = null;
            }
        }, FFT);
    }

    /**
     * 绘制子弹爆炸动画当前帧
     * @param {number} frame 介于0~1的实数，用于表示动画当前播放的位置
     */
    _self.boomPattern = function(frame) {
        var frames = 6; // 共6帧
        for(var i = 1;i <= frames;i++) {
            if(i / frames >= frame) {
                i++; // 便于计算
                break;
            }
        }
        var c = document.createElement('canvas');
        var ctx = c.getContext('2d');
        c.width = _boomWidth / 2;
        c.height = _boomHeight / 3;
        var w = c.width;
        var h = c.height;
        // 94*92
        ctx.drawImage(_boomBg, w * (i % 2), Math.floor(i / 2 - 1) * h, w, h, 0, 0, w, h);
        _skin = c;
    }

    /**
     * 获取子弹状态，1正常，0爆炸，-1表示发生碰撞，-2需要被销毁
     */
    _self.getStatus = function() {
        // if(_isBoomed) {
        //     return 0;
        // }else if(_isDestroy) {
        //     return -2;
        // }else {
        //     return 1;
        // }
        return _status;
    }
    _self.setStatus = function(val) {
        _status = val;
    }

    /**
     * 获取子弹皮肤
     */
    _self.getSkin = function() {
        return _skin;
    }

    function init() {}
    init();

};