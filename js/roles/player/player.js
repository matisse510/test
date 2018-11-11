/**
 * 玩家对象
 * @property {method} Player#getX 获取玩家左上角位置的横坐标x
 * @property {method} Player#setX 设置玩家左上角位置的横坐标x
 * @property {method} Player#getY 获取玩家左上角位置的横坐标y
 * @property {method} Player#setY 设置玩家左上角位置的横坐标y
 * @property {method} Player#getCX 获取玩家中心点位置的横坐标x
 * @property {method} Player#setCX 设置玩家中心点位置的横坐标x
 * @property {method} Player#getCY 获取玩家中心点位置的横坐标y
 * @property {method} Player#setCY 设置玩家中心点位置的横坐标y
 * @property {method} Player#getWidth 获取玩家飞机宽度
 * @property {method} Player#setWidth 设置玩家飞机宽度
 * @property {method} Player#getHeight 获取玩家飞机高度
 * @property {method} Player#setHeight 设置玩家飞机高度
 * @property {method} Player#getShootTime 获取玩家子弹射击时间间隔
 * @property {method} Player#setShootTime 设置玩家子弹射击时间间隔
 * @property {method} Player#getHealth 获取玩家生命值
 * @property {method} Player#setHealth 设置玩家生命值
 * @property {method} Player#getHealthMax 获取玩家的最大生命值
 * @property {method} Player#setHealthMax 设置玩家的最大生命值
 * @property {method} Player#getAD 获取玩家飞机的攻击力
 * @property {method} Player#setAD 设置玩家飞机的攻击力
 * @property {method} Player#getSkin 获取玩家飞机的皮肤
 * @property {method} Player#setSkin 设置玩家飞机的皮肤
 * @propertyx {method} Player#setSkinAsCanvas 用Canvas类型对象设置玩家飞机的皮肤
 * @property {method} Player#getSkinList 获取玩家飞机皮肤列表
 * @property {method} Player#addSkin 向玩家飞机的皮肤数组添加新皮肤
 * @property {method} Player#addSkinAsCanvas 向玩家飞机的皮肤数组添加Canvas类型的新皮肤
 * @property {method} Player#delSkin 从玩家飞机的皮肤数组删除指定皮肤
 * @property {method} Player#move 玩家移动方法
 * @property {method} Player#getStatus 获取玩家状态
 * @propertyx {method} Player#setStatus 设置玩家状态
 */
var Player = function() {
    // TODO: 实现属性护盾
    var _self = this;
    var _x = CANVAS_WIDTH / 2 - 153 * wScale / 2;
    var _y = CANVAS_HEIGHT;
    var _width = 153 * wScale;
    var _height = 101 * hScale;
    var _shootTime = 100;
    var _life = 1;
    var _healthMax =340;
    var _health = _healthMax;
    // var _lifeTotal = 3;
    var _AD = 10;
    var _skinArray = [];
    var _tmpSkin = null;
    _self._bulletSkin = gameStagePreloadRes.PLAYER_BULLET_SKIN;
    _self._bulletBoomedSkin = gameStagePreloadRes.PLAYER_BULLET_BOOMED_SKIN;
    // console.timeEnd();
    _self.bulletArray = new BulletArray();
    var _status = 1; // 玩家状态标识。具体解释见 _self.getStatus
    var _crashTime = 500; // 坠机动画时间长度
    var _crashBg = gameStagePreloadRes.CRASH_BG;  // 94*92
    var _crashWidth = gameStagePreloadRes.CRASH_BG.width;
    var _crashHeight = gameStagePreloadRes.CRASH_BG.height;

    var intervalId = null; // 玩家射击事件轮询
    var tempTime = 0;
    var bulletShootTime = 100 / FFT; // 玩家射击子弹时间间隔，被除数是子弹射击的间隔时间
    // var intervalTime = 3; // 玩家子弹发射轮询的调用任务时间间隔

    // 玩家子弹初始化参数
    var bulletOpts = {
        skin: gameStagePreloadRes.PLAYER_BULLET_SKIN, 
        width: 40 * wScale, 
        height: 40 * hScale, 
        speed: 200 * FFT / 1000,
        doMovePattern: function(bullet) {
            bullet.setY(bullet.getY() - bulletOpts.speed)
            // _y -= _speed;
            var y = bullet.getY()
            if(y <= 0 || y > window.CANVAS_HEIGHT) {
                bullet.setStatus(-2);
            }
        }
    }

    /**
     * 玩家横坐标accessor
     */
    _self.getX = function() {
        return _x;
    }
    _self.setX = function(val) {
        _x = val;
    }

    /**
     * 玩家纵坐标accessor
     */
    _self.getY = function() {
        return _y;
    }
    _self.setY = function(val) {
        _y = val;
    }

    /**
     * 玩家中心点横坐标accessor
     */
    _self.getCX = function() {
        return _x + _width / 2;
    }
    _self.setCX = function(val) {
        _x = val;
    }

    /**
     * 玩家中心点纵坐标accessor
     */
    _self.getCY = function() {
        return _y + _height / 2;
    }
    _self.setCY = function(val) {
        _y = val;
    }

    /**
     * 玩家飞机宽度accessor
     */
    _self.getWidth = function() {
        return _width;
    }
    _self.setWidth = function(val) {
        _width = val;
    }

    /**
     * 玩家飞机高度accessor
     */
    _self.getHeight = function() {
        return _height;
    }
    _self.setHeight = function(val) {
        _height = val;
    }

    /**
     * 玩家射击子弹时间间隔accessor
     */
    _self.getShootTime = function() {
        return _shootTime;
    }
    _self.setShootTime = function(val) {
        _shootTime = val;
    }

    /**
     * 玩家生命值accessor
     */
    _self.getHealth = function() {
        return _health;
    }
    _self.setHealth = function(val) {
        _health = val;
    }

    /**
     * 玩家最大生命值accessor
     */
    _self.getHealthMax = function() {
        return _healthMax;
    }
    _self.setHealthMax = function(val) {
        _healthMax = val;
    }

    /**
     * 玩家攻击力accessor
     */
    _self.getAD = function() {
        return _AD;
    }
    _self.setAD = function(val) {
        _AD = val;
    }

    /**
     * 玩家飞机皮肤accessor
     */
    _self.getSkin = function() {
        return _tmpSkin;
    }

    /**
     * 玩家飞机皮肤列表accessor
     */
    _self.getSkinList = function() {
        return _skinArray;
    }

    /**
     * 获取玩家状态accessor
     * 玩家状态应该只能从内部修改。-2表示需要被销毁；-1表示玩家已死亡，执行爆炸动画；0表示已受伤；1表示满血。
     */
    _self.getStatus = function() {
        return _status;
    }

    /**
     * 设置玩家飞机的皮肤
     * @param {image_element | image_object | string | number} val 设置玩家飞机的皮肤，传入参数可以是带有图片地址的Image标签，或是带图片地址的Image对象，或者只是一个图片地址的字符串，或者是玩家皮肤数组的标号
     */
    _self.setSkin = function(val) {
        var type = '';
        if(typeof val === 'object') {
            if(val.src){
                type = val.src;
            }else {
                console.warn('玩家皮肤地址为空，设置皮肤失败');
                return false;
            }
        }else if(typeof val === 'string') {
            type = val;
        }else if(typeof val === 'number'){
            type = val;
        }else {
            console.warn('玩家皮肤参数类型错误，设置皮肤失败');
            return false;
        }
        if(typeof type === 'number') {
            _tmpSkin = _skinArray[type];
        }else {
            _tmpSkin = new Image();
            _tmpSkin.src = type;
        }
    }

    /**
     * 用canvas画布设置玩家皮肤
     * @param {canvasElement} val 玩家皮肤
     */
    // _self.setSkinAsCanvas = function(val) {
    //     try {
    //         var c = document.createElement('canvas');
    //         var ctx = c.getContext('2d');
    //         c.width = val.width;
    //         c.height = val.height;
    //         ctx.drawImage(val, 0, 0);
    //         _tmpSkin = c;
    //     }catch(e) {
    //         console.warn('玩家皮肤设置失败')
    //     }
    // }

    /**
     * 添加新的玩家飞机皮肤
     * @param {image_element | image_object | string} val 添加新的玩家飞机皮肤，传入参数可以是带有图片地址的Image标签，或是带图片地址的Image对象，或者只是一个图片地址的字符串
     */
    _self.addSkin = function(val) {
        var type = '';
        if(typeof val === 'object') {
            if(val.src){
                type = val.src;
            }else {
                console.warn('玩家皮肤地址为空，设置皮肤失败');
            }
        }else if(typeof val === 'string') {
            type = val;
        }else if(typeof val === 'number'){
            type = val;
        }else {
            console.warn('玩家皮肤参数类型错误，设置皮肤失败');
        }
        var tmpImg = new Image();
        tmpImg.src = type;

        _skinArray.push(tmpImg)
    }

    /**
     * 用canvas画布向玩家皮肤数组添加新皮肤
     * @param {canvasElement} val 玩家皮肤
     */
    _self.addSkinAsCanvas = function(val) {
        try {
            var c = document.createElement('canvas');
            var ctx = c.getContext('2d');
            c.width = val.width;
            c.height = val.height;
            ctx.drawImage(val, 0, 0);
            _skinArray.push(c);
        }catch(e) {
            console.warn('添加玩家皮肤失败')
        }
    }
    

    /**
     * 删除玩家飞机的皮肤
     * @param {image_element | image_object | string | number} val 设置玩家飞机的皮肤，传入参数可以是带有图片地址的Image标签，或是带图片地址的Image对象，或者只是一个图片地址的字符串，或者是玩家皮肤数组的标号
     */
    _self.delSkin = function(val) {
        var type = '';
        if(typeof val === 'object') {
            if(val.src){
                type = val.src;
            }else {
                console.warn('玩家皮肤地址为空，设置皮肤失败');
                return false;
            }
        }else if(typeof val === 'string') {
            type = val;
        }else if(typeof val === 'number'){
            type = val;
        }else {
            console.warn('玩家皮肤参数类型错误，设置皮肤失败');
            return false;
        }
        if(typeof type === 'number') {
            _skinArray.splice(type, 1);
        }else {
            for(var i = 0;i < _skinArray.length;i++) {
                if(_skinArray[i].src === type) {
                    _skinArray.splice(i, 1);
                }
            }
        }
    }

    
    /**
     * 射击子弹方法
     */
    _self.shootBullet = function () {
        if (_self.isBulletTime() && _self.getStatus() > -1) {
            // var bullet = new Bullet({'skin':_self._bulletSkin});
            var bullet = new Bullet(bulletOpts);
            bullet.calculatePosition(_self);
            _self.bulletArray.add(bullet);
        }
    };

    /**
     * 判断是否为射击时机
     */
    _self.isBulletTime = function () {
        if (intervalId === null) {
            intervalId = setInterval(_self.scaleTime, FFT); // intervalTime
            return true;
        }
        return false;
    };

    /**
     * 子弹射击轮询handler
     */
    _self.scaleTime = function () {
        tempTime -= 1;
        if (tempTime <= 0) {
            tempTime = bulletShootTime;
            clearInterval(intervalId);
            intervalId = null;
        }
    };

    /**
     * 玩家移动事件handler
     * @param x
     * @param y
     */
    _self.move = function (x, y) {
        // TODO: 处理飞机位置瞬移bug
        if (x >= 0 && x <= CANVAS_WIDTH
            && y >= 0 && y <= CANVAS_HEIGHT) {
            _self.setX(x - _self.getWidth() / 2);
            _self.setY(y - _self.getHeight() / 2);
        }
    }

    /**
     * 玩家承担伤害方法
     * @param {number} val 需要承担的伤害值 
     * @return {number} 返回玩家剩余的血量
     */
    _self.takeDamage = function(val) {
        _health -= val;
        if(_health === _healthMax) {
            _status = 1;
        }else if(_health > 0) {
            _status = 0;
        }else {
            _status = -1;
        }
        return _health;
    }

    /**
     * 获取玩家坠机动画时间长度
     */
    _self.getCrashTime = function() {
        return _crashTime;
    }

    /**
     * 玩家死亡事件handler
     */
    _self.crash = function() {
        // var FFT = 1000;
        _status = -1;
        // _self.crashX = _x + (_width - _crashWidth / 2) / 2;
        // _self.crashY = _y + (_height - _crashHeight / 3) / 2;
        _self.crashX = _x;
        _self.crashY = _y;
        _self.crashTimeNow = 0;
        _self.crashInterval = setInterval(function(){
            _self.crashTimeNow += FFT;
            var now = _self.crashTimeNow;
            var time = _crashTime;
            if(now > time) {
                _status = -2;
            }else {
                _self.crashPattern(_self.crashTimeNow / _crashTime)
            }
            if(_status == -2) {
                clearInterval(_self.crashInterval);
                _self.crashInterval = null;
            }
        }, FFT);
    }

    /**
     * 绘制坠机动画当前帧
     * @param {number} frame 介于0~1的实数，用于表示动画当前播放的位置
     */
    _self.crashPattern = function(frame) {
        var frames = 6; // 共6帧
        for(var i = 1;i <= frames;i++) {
            if(i / frames >= frame) {
                i++; // 便于计算
                break;
            }
        }
        var c = document.createElement('canvas');
        var ctx = c.getContext('2d');
        c.width = _crashWidth / 2;
        c.height = _crashHeight / 3;
        var w = c.width;
        var h = c.height;
        // 94*92
        ctx.drawImage(_crashBg, w * (i % 2), Math.floor(i / 2 - 1) * h, w, h, 0, 0, w, h);
        _tmpSkin = c;
    }


    // 玩家战斗数据初始化
    function init() {
        // _self.setX(CANVAS_WIDTH / 2 - 153 * wScale / 2);
        // _self.setY(CANVAS_HEIGHT);
        // _self.setWidth(153 * wScale);
        // _self.setHeight(101 * hScale);
        // _self.setShootTime(100);
        // _self.setHealth(300);
        // _self.setHealthMax(300);
        // _self.setAD(20);
        _self.addSkinAsCanvas(gameStagePreloadRes.PLAYER);
        _self.setSkin(0);
    }
    init();
};