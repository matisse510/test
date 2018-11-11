/**
 * 敌机生命条对象
 * @param {number} maxHealth - 敌机生命值上限
 * @property {method} EnemyHealthBar#getHealthBarCanvas 获取敌机生命条的canvas
 */
var EnemyHealthBar = function(maxHealth) {
    _this = this;
    var maxHp;
    var _hp;
    _this.init = function(m) {
        maxHp = m;
        _hp = m;
    }
    /**
     * @description 获取敌机生命条的Canvas
     * @method this.getHealthBarCanvas(w, h, type, color)
     * @param {number} w - 生命条长度
     * @param {number} h - 生命条高度
     * @param {string} type=('fill' || 'stroke') - canvas描笔类型
     * @param {string} color - 生命条颜色
     */
    _this.getHealthBarCanvas = function(w, h, type, color) {
        var c = document.createElement('canvas');
        var ctx = c.getContext('2d');
        c.width = w;
        c.height = h;
        ctx.lineWidth = 3;
        ctx[type + 'Style'] = color;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(ctx.lineWidth, ctx.lineWidth);
        ctx.lineTo(w - ctx.lineWidth, ctx.lineWidth);
        ctx.lineTo(w - ctx.lineWidth, h - ctx.lineWidth);
        ctx.lineTo(ctx.lineWidth, h - ctx.lineWidth);
        ctx.closePath();
        ctx[type]();
        return c;
    }
}