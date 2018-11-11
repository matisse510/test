/**
 * 敌机对象 注意：敌机对象是抽象对象，不应该被实例化。需要生成敌机，应使用具体机型的类进行实例化
 * @property {method} Enemy#getX 获取敌机左上角位置的横坐标x
 * @property {method} Enemy#setX 设置敌机左上角位置的横坐标x
 * @property {method} Enemy#getY 获取敌机左上角位置的横坐标y
 * @property {method} Enemy#setY 设置敌机左上角位置的横坐标y
 * @property {method} Enemy#getCX 获取敌机中心点位置的横坐标x
 * @property {method} Enemy#setCX 设置敌机中心点位置的横坐标x
 * @property {method} Enemy#getCY 获取敌机中心点位置的横坐标y
 * @property {method} Enemy#setCY 设置敌机中心点位置的横坐标y
 * @property {method} Enemy#getWidth 获取敌机飞机宽度
 * @property {method} Enemy#setWidth 设置敌机飞机宽度
 * @property {method} Enemy#getHeight 获取敌机飞机高度
 * @property {method} Enemy#setHeight 设置敌机飞机高度
 * @propertyx {method} Enemy#getShootTime 获取敌机子弹射击时间间隔
 * @propertyx {method} Enemy#setShootTime 设置敌机子弹射击时间间隔
 * @property {method} Enemy#getHealth 获取敌机生命值
 * @property {method} Enemy#setHealth 设置敌机生命值
 * @property {method} Enemy#getHealthMax 获取敌机的最大生命值
 * @property {method} Enemy#setHealthMax 设置敌机的最大生命值
 * @property {method} Enemy#getAD 获取敌机飞机的攻击力
 * @property {method} Enemy#setAD 设置敌机飞机的攻击力
 * @property {method} Enemy#getSkin 获取敌机飞机的皮肤
 * @property {method} Enemy#setSkin 设置敌机飞机的皮肤
 * @property {method} Enemy#setSkinAsCanvas 用canvas画布设置敌机飞机的皮肤
 * @property {method} Enemy#getSkinList 获取敌机飞机皮肤列表
 * @property {method} Enemy#addSkin 向敌机飞机的皮肤数组添加新皮肤
 * @property {method} Enemy#delSkin 从敌机飞机的皮肤数组删除指定皮肤
 * @property {method} Enemy#getCapacity 获取敌机飞机的剩余弹药量
 * @property {method} Enemy#setCapacity 设置敌机飞机的剩余弹药量
 * @property {method} Enemy#draw 向指定画布绘制敌机
 * @property {method} Enemy#shootBullet 敌机执行射击子弹
 * @property {method} Enemy#move 敌机飞行方法
 * @property {method} Enemy#takeDamage 敌机承担伤害
 * @property {method} Enemy#getStatus 获取敌机状态
 * @propertyx {method} Enemy#setStatus 设置敌机状态
 * @property {method} Enemy#getBonus 获取敌机的价值分数
 * @property {method} Enemy#crash 敌机坠机事件handler
 * @property {method} Enemy#crashAnimation 敌机坠机动画
 */
var Enemy = function(opts) {
    var _self = this;
    var opts = opts || {};
    // var _x = CANVAS_WIDTH / 2 - 153 * wScale / 2;
    // var _y = CANVAS_HEIGHT;
    // var _width = 153 * wScale;
    // var _height = 101 * hScale;
    // var _speed = 1;
    // var _shootTime = 100;
    // var _Health = 300;
    // var _HealthMax =300;
    // var _AD = 20;
    // var _skinArray = [];
    // var _tmpSkin = null;
    // var _capacity = 0;

    var _id =(+new Date() % 999999) + ' ' + ((Math.floor(Math.random() * 10000)) % 9999); // 生成10位的随机数字符串id
    var _timestampBirth = +new Date();
    var _x = opts.x || CANVAS_WIDTH / 2 - 153 * wScale / 2;
    var _y = opts.y || 0;
    var _width = opts.width || 153 * wScale;
    var _height = opts.height || 101 * hScale;
    var _speed = opts.speed || 30 * hScale;
    // var _shootTime = opts.shootTime || 100;
    var _lifeMax = opts.lifeMax || 1;
    var _life = opts.life || _lifeMax;
    var _AD = opts.AD || 100;
    var _skinArray = opts.skinArray || [];
    var _tmpSkin = opts.tmpSkin || picture['enemy1'];
    var _capacity = opts.capacity || 0;
    var _healthMax = opts.healthMax || 300;
    var _health = opts.health || _healthMax;
    var _status = 1;
    var _bonus = opts.bonus || 100;
    var _crashTime = opts.crashTime || 500; // 坠机动画时间长度
    var _crashBg = gameStagePreloadRes.CRASH_BG;  // 94*92
    var _crashWidth = gameStagePreloadRes.CRASH_BG.width;
    var _crashHeight = gameStagePreloadRes.CRASH_BG.height;
    var _shootT = -1; // 计算射击时刻的时间变量
    _self.shootPriod = 300000 / FFT; // 射击时间间隔
    _self.bulletArray = new BulletArray();
    _self.crashPattern = typeof opts.crashPattern === 'function' && opts.crashPattern;

    // 敌机子弹初始化参数--小瞎子参数
    
    var _bulletOpts = {
        skin: gameStagePreloadRes.ENEMY_BULLET_SKIN, 
        width: 23 * wScale, 
        height: 23 * hScale, 
        speed: 60 * FFT / 1000,
        doMovePattern: function(bullet) {
            bullet.setY(bullet.getY() - bulletOpts.speed)
            // _y -= _speed;
            var y = bullet.getY()
            if(y <= 0 || y > window.CANVAS_HEIGHT) {
                bullet.setStatus(-2);
            }
        },
        setBulletPos: function (fly,bullet) {
            bullet._x = fly.getX() + fly.getWidth() / 2 - bullet._width / 2;
            bullet._y = fly.getY() - bullet._height;
            bullet._isDestroy = false;
        }
    }
    _bulletOpts = merge(_bulletOpts, opts.bulletOpts);

    /**
     * 敌机左上角横坐标accessor
     */
    _self.getX = function() {
        return _x;
    }
    _self.setX = function(val) {
        _x = val;
    }

    /**
     * 敌机左上角纵坐标accessor
     */
    _self.getY = function() {
        return _y;
    }
    _self.setY = function(val) {
        _y = val;
    }

    /**
     * 敌机中心点横坐标accessor
     */
    _self.getCX = function() {
        return _x + _width / 2;
    }
    _self.setCX = function(val) {
        _x = val;
    }

    /**
     * 敌机中心点纵坐标accessor
     */
    _self.getCY = function() {
        return _y + _height / 2;
    }
    _self.setCY = function(val) {
        _y = val;
    }

    /**
     * 敌机飞机宽度accessor
     */
    _self.getWidth = function() {
        return _width;
    }
    _self.setWidth = function(val) {
        _width = val;
    }

    /**
     * 敌机飞机高度accessor
     */
    _self.getHeight = function() {
        return _height;
    }
    _self.setHeight = function(val) {
        _height = val;
    }

    /**
     * 敌机飞行速度accessor
     */
    _self.getSpeed = function() {
        return _speed;
    }
    _self.setSpeed = function(val) {
        _speed = val;
    }

    /**
     * 敌机射击子弹时间间隔accessor
     */
    // _self.getShootTime = function() {
    //     return _shootTime;
    // }
    // _self.setShootTime = function(val) {
    //     _shootTime = val;
    // }

    /**
     * 敌机射击方法
     */
    _self.shootBullet = function() {
        if(_capacity < 1) return;
        if(_shootT < 0) {
            _shootT = _self.shootPriod;
            // var bulletOpts = {
            //     skin: gameStagePreloadRes.ENEMY_BULLET_SKIN, 
            //     width: 23, 
            //     height: 23, 
            //     speed: 1
            // }
            var bullet = new Bullet(_bulletOpts);
            bullet.calculatePosition(_self);
            _self.bulletArray.add(bullet);
            // console.log('shoot')
        }
        _shootT -= 1;
    }

    /**
     * 敌机生命值accessor
     */
    _self.getHealth = function() {
        return _health;
    }
    _self.setHealth = function(val) {
        _health = val;
    }

    /**
     * 敌机最大生命值accessor
     */
    _self.getHealthMax = function() {
        return _healthMax;
    }
    _self.setHealthMax = function(val) {
        _healthMax = val;
    }

    /**
     * 敌机攻击力accessor
     */
    _self.getAD = function() {
        return _AD;
    }
    _self.setAD = function(val) {
        _AD = val;
    }

    /**
     * 敌机飞机皮肤accessor
     */
    _self.getSkin = function() {
        return _tmpSkin;
    }

    /**
     * 敌机飞机皮肤列表accessor
     */
    _self.getSkinList = function() {
        return _skinArray;
    }

    /**
     * 敌机弹药容量accessor
     */
    _self.getCapacity = function() {
        return _capacity;
    }
    _self.setCapacity = function(val) {
        _capacity = val - 0 > 0 ? val : 0;
    }

    /**
     * 敌机状态accessor
     * 敌机状态应该只能从内部修改。-2表示需要被销毁；-1表示敌机已死亡，执行爆炸动画；0表示已受伤；1表示满血。
     */
    _self.getStatus = function() {
        return _status;
    }
    // _self.setStatus = function(val) {
    //     _status = val;
    // }

    /**
     * 敌机价值分数accessor
     */
    _self.getBonus = function() {
        return _bonus;
    }

    _self.getBulletOpts = function() {
        return _bulletOpts;
    }
    _self.setBulletOpts = function(val) {
        _bulletOpts = val;
    }

    /**
     * 获取敌机子弹默认参数
     */
    _self.getBulletOpts = function() {
        return _bulletOpts;
    }
    

    /**
     * 设置敌机飞机的皮肤
     * @param {image_element | image_object | string | number} val 设置敌机飞机的皮肤，传入参数可以是带有图片地址的Image标签，或是带图片地址的Image对象，或者只是一个图片地址的字符串，或者是敌机皮肤数组的标号
     */
    _self.setSkin = function(val) {
        var type = '';
        if(typeof val === 'object') {
            if(val.src){
                type = val.src;
            }else {
                console.warn('敌机皮肤地址为空，设置皮肤失败');
                return false;
            }
        }else if(typeof val === 'string') {
            type = val;
        }else if(typeof val === 'number'){
            type = val;
        }else {
            console.warn('敌机皮肤参数类型错误，设置皮肤失败');
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
     * 用canvas画布设置敌机皮肤
     * @param {canvasElement} val 敌机皮肤
     */
    _self.setSkinAsCanvas = function(val) {
        try {
            var c = document.createElement('canvas');
            var ctx = c.getContext('2d');
            c.width = val.width;
            c.height = val.height;
            ctx.drawImage(val, 0, 0);
            _tmpSkin = c;
        }catch(e) {
            console.warn('敌机皮肤初始化失败')
        }
    }

    /**
     * 添加新的敌机飞机皮肤
     * @param {image_element | image_object | string} val 添加新的敌机飞机皮肤，传入参数可以是带有图片地址的Image标签，或是带图片地址的Image对象，或者只是一个图片地址的字符串
     */
    _self.addSkin = function(val) {
        var type = '';
        if(typeof val === 'object') {
            if(val.src){
                type = val.src;
            }else {
                console.warn('敌机皮肤地址为空，设置皮肤失败');
            }
        }else if(typeof val === 'string') {
            type = val;
        }else if(typeof val === 'number'){
            type = val;
        }else {
            console.warn('敌机皮肤参数类型错误，设置皮肤失败');
        }
        var tmpImg = new Image();
        tmpImg.src = type;
        _skinArray.push(tmpImg)
    }

    /**
     * 删除敌机飞机的皮肤
     * @param {image_element | image_object | string | number} val 设置敌机飞机的皮肤，传入参数可以是带有图片地址的Image标签，或是带图片地址的Image对象，或者只是一个图片地址的字符串，或者是敌机皮肤数组的标号
     */
    _self.delSkin = function(val) {
        var type = '';
        if(typeof val === 'object') {
            if(val.src){
                type = val.src;
            }else {
                console.warn('敌机皮肤地址为空，设置皮肤失败');
                return false;
            }
        }else if(typeof val === 'string') {
            type = val;
        }else if(typeof val === 'number'){
            type = val;
        }else {
            console.warn('敌机皮肤参数类型错误，设置皮肤失败');
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
     * 在canvas画布上绘制敌机
     * @param {object} ctx canvas画布
     */
    _self.draw = function(ctx) {
        var healthBar = new EnemyHealthBar();
        var x = _x;
        var y = _y;
        var w = _width * (_health / _healthMax);
        var h = 4 * hScale;
        var c = healthBar.getHealthBarCanvas(w, h, 'fill', '#de0606');
        if(_status > -1) {
            ctx.drawImage(c, x, y + _height + 4 * hScale, w, h);
        }else {
            x = _self.crashX;
            y = _self.crashY;
        }
        ctx.drawImage(_tmpSkin, x, y, _width, _height);
    }

    /**
     * 敌机移动方法
     */
    _self.move = function() {
        // TODO: 抽象movePattern对象
        if(!_self.movePatternConstB) {
            _self.movePatternConstB = _y
        }
        var y = Math.ceil(_self.movePatternConstB + ( window.timestamp - _timestampBirth) / 1000 * _speed);
        if(y > CANVAS_HEIGHT) {
            _status = -2;
        }else {
            _self.setY(y);
        }
    }

    /**
     * 敌机承担伤害方法
     * @param {number} val 需要承担的伤害值 
     * @return {number} 返回敌机剩余的血量
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
     * 敌机死亡事件handler
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



    





    // 敌机战斗数据初始化
    function init() {
        // _self.setX(CANVAS_WIDTH / 2 - 153 * wScale / 2);
        // _self.setY(0);
        // _self.setWidth(153 * wScale);
        // _self.setHeight(101 * hScale);
        // _self.setSpeed(1);
        // _self.setShootTime(100);
        // _self.setLife(300);
        // _self.setLifeMax(300);
        // _self.setAD(20);
        // _self.addSkin(picture['enemy1']);
        // _self.setSkin(0);
        // _self.setCapacity(0);
    }
    init();
};