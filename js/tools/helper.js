/**
 * 数组帮助(数组完成比对、删除操作)
 */


/**
 * 根据元素对象删除数组内的元素
 * @method Array.remove
 * @param arg
 */
Array.prototype.remove = function(arg) {
    var i, n = 0;
    var len = this.length;
    for(i = 0; i < len; ++i){
        if(this[i] != arg)
            this[n++] = this[i];
    }
    // 是否需要更新长度
    if(n < i)
        this.length = n;
};

/**
 * 根据元素下标删除数组内的元素
 * @method Array.removeIndex
 * @param index{Number}
 *
 */
Array.prototype.removeIndex = function(index){
    var i, n = 0;
    var len = this.length;
    for(i = 0; i < len; ++i){
        if(this[i] != this[index])
            this[n++] = this[i];
    }
    if(n < i)
        this.length = n;
};

/**
 * 查找该对象是否有该元素
 * @method Array.contain
 * @param arg
 * @returns {boolean}
 */
Array.prototype.contain = function (arg) {
    for(var i = 0; i < this.length; ++i){
        if(this[i] == arg)
            return true;
    }
    return false;
};