/**
 * 敌机队列
 * @property {method} EnemyArray#get 获取敌机队列数组
 * @property {method} EnemyArray#add 向敌机数组添加敌机对象
 * @property {method} EnemyArray#draw 在画布上刷新敌机的位置
 */
function EnemyArray() {
    extend(EnemyArray, Array, this, null);
    // 敌机队列
    var _self = this;
    var _arr = [];
    var _arrBoomed = [];

    /**
     * 获取当前EnemyArray数组
     */
    _self.get = function() {
        return _arr;
    }

    /**
     * 向敌机数组添加敌机对象
     * @param {Enemy} item Enemy类型的敌机 
     */
    _self.add = function(item) {
        // TODO: Eenemy类型检测
        _arr.push(item)
    }

    /**
     * 在画布上刷新敌机的位置
     * @param {object} ctx canvas画布 
     */
    _self.draw = function(ctx) {
        // TODO: 敌机爆炸动画
        for(var i = 0;i < _arr.length;i++) {
            if(_arr[i].getStatus() <= -1) {
                _arrBoomed.push(_arr[i]);
                _arr.splice(i, 1);
                i--;
            }else {
                _arr[i].draw(ctx);
            }
        }
        for(var i = 0;i < _arrBoomed.length;i++) {
            if(_arrBoomed[i].getStatus() === -2) {
                _arrBoomed.splice(i, 1);
                i--;
            }else {
                _arrBoomed[i].draw(ctx);
            }
        }
    }

    function init() {}
    init();
}