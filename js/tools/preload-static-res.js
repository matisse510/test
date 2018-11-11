// 战斗场景预加载资源
var gameStagePreloadRes = {
    count:0
};
var gameStagePreloader = function(str,callback) {
    gameStagePreloadRes.count++;
    imgToCanvas(picture[str], callback);
}
;(function(){

    // 玩家皮肤
    gameStagePreloader('playerImage', function(c) {
        gameStagePreloadRes.PLAYER = c;
    });

    // 玩家子弹皮肤
    gameStagePreloader('bulletImage', function(c) {
        gameStagePreloadRes.PLAYER_BULLET_SKIN = c;
    });

    // 玩家子弹皮肤--状态：击中敌机
    gameStagePreloader('bulletBoomedImage', function(c) {
        var t = document.createElement('canvas');
        var tCtx = t.getContext('2d');
        var w = 30;
        var h = 30;
        t.width = w;
        t.height = h;
        tCtx.drawImage(c, 32, 32, w, h, 0, 0, w, h);
        gameStagePreloadRes.PLAYER_BULLET_BOOMED_SKIN = t;
    });

    // 敌机子弹皮肤
    gameStagePreloader('EnemyBulletImage', function(c) {
        gameStagePreloadRes.ENEMY_BULLET_SKIN = c;
    });

    // 敌机--机型：小瞎子
    gameStagePreloader('enemy1', function(c) {
        gameStagePreloadRes.ENEMY_BLINDMAN_SKIN = c;
    });

    // 敌机--机型：防御者
    gameStagePreloader('bigEnemy', function(c) {
        gameStagePreloadRes.ENEMY_DEFENDER_SKIN = c;
    });

    // 敌机坠毁动画
    gameStagePreloader('bulletBoomedImage', function(c) {
        gameStagePreloadRes.CRASH_BG = c;
    });

})();
// 战斗场景预加载资源 end
// gameStagePreloadRes.key = 1; // test code