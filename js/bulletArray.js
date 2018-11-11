/**
 * 子弹数组
 * @property {method} BulletArray#get 获取子弹数组
 * @property {method} BulletArray#add 向子弹数组添加新的子弹对象
 * @property {method} BulletArray#del 删除子弹数组中指定索引下的子弹
 * @property {method} BulletArray#bulletManage 及时销毁被标记为 isDestory=true 的子弹，并在画布上刷新有效子弹的位置
 */
var BulletArray = function() {
    _self = this;
    var _arr = new Array();
    var _arrBoomed = [];

    /**
     * 获取子弹数组
     */
    _self.get = function() {
        return _arr;
    }

    /**
     * 添加子弹到子弹数组
     * @param {Bullet} val 向子弹数组插入新的子弹对象
     */
    _self.add = function(val) {
        _arr.push(val);
    }

    /**
     * 从子弹数组删除子弹 
     * @param {number} idx 根据指定的数组下标删除子弹
     */
    _self.del = function(idx) {
        _arr.splice(idx, 1);
    }


    /**
     * 在画布上更新子弹数组，并销毁失效的子弹
     */
    _self.bulletManage = function(ctx) {
        // TODO: 在指定画布上更新子弹数组
        // TODO: 在画布上更新发生碰撞的子弹
        if (_arr.length > 0) {
            for(var i = 0;i < _arr.length;i++) {
                if(_arr[i].getStatus() <= -1) {
                    _arrBoomed.push(_arr[i]);
                    _arr.splice(i, 1);
                    i--;
                }else {
                    _arr[i].drawBullet(ctx);
                }
            }
            for(var i = 0;i < _arrBoomed.length;i++) {
                if(_arrBoomed[i].getStatus() === -2) {
                    _arrBoomed.splice(i, 1);
                    i--;
                }else {
                    _arrBoomed[i].drawBullet(ctx);
                }
            }

            // for (var i = 0; i < _arr.length; ++i) {
            //     // 检测子弹是否已经销毁
            //     var status = _arr[i].getStatus()
            //     if (status === -1) {
            //         _arr[i].boom();
            //     }else if (status === -2){
            //         _arr.splice(i, 1);
            //         --i;
            //     } else {
            //         _arr[i].drawBullet(ctx);
            //     }
            // }
        }
    }
}
