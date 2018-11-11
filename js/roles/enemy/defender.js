/**
 * 敌机机型-防御者： 固定时间间隔向正前方射击
 */
function Defender() {
    var _self = this;
    // 继承敌机类
    extend(Defender, Enemy);

    // 自定义属性、方法

    function init() {
        // 自定义初始化
        _self.setSkin(gameStagePreloadRes.ENEMY_DEFENDER_SKIN);
    }
    init();
}