/**
 * 敌机机型-小瞎子： 不会攻击的小飞机。继承Enemy类的所有方法。
 */
function BlindMan(opts) {
    var _self = this;
    var opts = opts || {};
    // 敌机子弹初始化参数
    var _bulletOpts = {
        skin: gameStagePreloadRes.ENEMY_BULLET_SKIN, 
        width: 23 * wScale, 
        height: 23 * hScale, 
        speed: 60 * FFT / 1000,
        doMovePattern: function(bullet) {
            bullet.setY(bullet.getY() + _bulletOpts.speed)
            // _y -= _speed;
            var y = bullet.getY()
            if(y <= 0 || y > window.CANVAS_HEIGHT) {
                bullet.setStatus(-2);
            }
        }
    }
    _bulletOpts = merge(_bulletOpts, opts.bulletOpts);
    opts.bulletOpts = _bulletOpts;
    extend(BlindMan, Enemy, this, opts);

    // 备注： 这里的默认值可以置null
    // _x = opts.x || _x || CANVAS_WIDTH / 2 - 153 * wScale / 2;
    // _y = opts.y || _y || CANVAS_HEIGHT;
    // _width = opts.width || _width || 153 * wScale;
    // _height = opts.height || _height || 101 * hScale;
    // _speed = opts.speed || _speed || 1;
    // _shootTime = opts.shootTime || _shootTime || 100;
    // _life = opts.life || _life || 300;
    // _lifeMax = opts.lifeMax || _lifeMax || 300;
    // _AD = opts.AD || _AD || 20;
    // _skinArray = opts.skinArray || _skinArray || [];
    // _tmpSkin = opts.tmpSkin || _tmpSkin || null;
    // _capacity = opts.capacity || _capacity || 0;
    // 继承敌机类
    

    // 自定义属性、方法

    function init(opts) {
        // 自定义初始化
        // _x = opts.x || CANVAS_WIDTH / 2 - 153 * wScale / 2;
        // _y = opts.y || CANVAS_HEIGHT;
        // _width = opts.width || 153 * wScale;
        // _height = opts.height || 101 * hScale;
        // _speed = opts.speed || 1;
        // _shootTime = opts.shootTime || 100;
        // _life = opts.life || 300;
        // _lifeMax = opts.lifeMax || 300;
        // _AD = opts.AD || 20;
        // _skinArray = opts.skinArray || [];
        // _tmpSkin = opts.tmpSkin || null;
        // _capacity = opts.capacity || 0;
        
        _self.setWidth(75 * wScale);
        _self.setHeight(57 * hScale);
        _self.setSpeed(30 * hScale);
        _self.setCapacity(0);
        _self.setSkinAsCanvas(gameStagePreloadRes.ENEMY_BLINDMAN_SKIN);
        _self.setBulletOpts(_bulletOpts);
    }
    init(opts);
}