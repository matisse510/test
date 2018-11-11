/**
 * 玩家积分对象
 * @param {number} initScore 玩家开场的初始得分
 * @property {method} Score#getScore 获取玩家当前分数
 * @property {method} Score#setScore 设置玩家分数
 * @property {method} Score#add 修改玩家分数。参数值大于0为奖励得分、小于0为惩罚减分
 * @property {function} Score~setScoreArr 设置玩家分数的数组形式
 */ 
var Score = function(initScore) {
    var _self = this;
    _self.arr = [];
    var _score = 0;
    var _digit = 8; // 积分目前限制最高8位
    _self.arr = (function(dig){var arr = [];for(var i = 0;i < dig;i++){arr.push(new Image())}return arr})(_digit); 

    /**
     * 玩家得分accessor
     */
    _self.getScore = function() {
        return typeof _score === 'number' ? _score : 0;
    }
    _self.setScore = function(s) {
        var str = s + '';
        _score = typeof s === 'number' ? s : _score;
        setScoreArr(_score)
        // for(var i = 0;i < _digit;i++) {
        //     if(i < str.length) {
        //         _self.arr[i].src = (function(j){return picture['font' + j].src})(str.charAt(i));
        //     }else {
        //         _self.arr[i].src = '';
        //     }
        // }
    }

    /**
     * 
     * @param {number} s 设置玩家得分的数组形式
     */
    function setScoreArr(s) {
        if(typeof s === 'number') {
            var str = s + '';
        }else {
            return false;
        }
        for(var i = 0;i < _digit;i++) {
            if(i < str.length) {
                _self.arr[i].src = (function(j){return picture['font' + j].src})(str.charAt(i));
            }else {
                _self.arr[i].src = '';
            }
        }
    }

    _self.add = function(val) {
        var _val = typeof val === 'number' ? val : 0;
        _score += _val;
        setScoreArr(_score)
        console.log('val, score : ',val,_score)
    }


    function init() {
        typeof initScore === 'number' ? _self.setScore(initScore) : _self.setScore(0);// 初始化分数
    }
    init();
}