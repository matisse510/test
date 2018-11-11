/**
 * 游戏舞台(地图)
 * @param context 游戏画布
 * @property {method} GameStage#drawBackground 绘制战斗场景画布
 * @property {method} GameStage#shootBullet 射击子弹方法
 * @property {method} GameStage#isBulletTime 创建子弹处理轮询
 * @property {method} GameStage#scaleTime 子弹处理轮询的回调函数
 * @property {method} GameStage#click 游戏舞台对象click事件handler
 * @property {method} GameStage#moveByEnemy 敌机依次执行移动方法
 * @property {function} GameStage~pausekey 暂停游戏函数
 * @propertyxx {function} GameStage~createLayerCtx 生成一个能覆盖游戏界面的画布层
 */
var GameStage = function (context) {
    var _self = this;
    _self.score = new Score(0); // 玩家得分对象
    _self.fly = new Player(); // 玩家对象
    _self.ctx = context; // 游戏容器画布
    // _self.ctxBg = createLayerCtx(CANVAS_WIDTH, CANVAS_HEIGHT); // 生成背景画布层
    // _self.ctxEnemy = createLayerCtx(CANVAS_WIDTH, CANVAS_HEIGHT); // 生成包含敌机、boss的角色画布层
    // _self.ctxPlayer = createLayerCtx(CANVAS_WIDTH, CANVAS_HEIGHT); // 生成玩家的角色画布层
    // _self.ctxBullets = createLayerCtx(CANVAS_WIDTH, CANVAS_HEIGHT); // 生成子弹画布层
    // _self.ctxPanel = createLayerCtx(CANVAS_WIDTH, CANVAS_HEIGHT); // 生成游戏界面组件画布层
    _self.enemyArray = new EnemyArray(); // 创建敌机队列
    _self.createEnemyTimer = null; // 创建敌机队列的轮询
    _self.createEnemyPriod = 1000 / FFT; // 创建敌机时间间隔
    _self.enemyMaxNum = 10; // 创建敌机最大数量
    _self.createEnemyTimeLeft = _self.createEnemyPriod; // 距离下次创建敌机剩余时间
    // _self.createEnemyChance = 0.1; // 每次轮询创建敌机可能性
    _self.pauseStatus = false; // 游戏场景暂停状态标识，true为暂停状态，false为游戏进行状态。默认false
    _self.PlayerCrashCGTime = _self.fly.getCrashTime() + 1500;
    
    // var intervalTime = 3; // 玩家子弹发射轮询的调用任务时间间隔
    // var bulletShootTime = 100; // 子弹间隔时间
    // var tempTime = 0;
    var intervalId = null;
    var wscale = wScale;
    var hscale = hScale;

    // 背景图移动轴y
    var background = {
        x: 0,
        y: 0,
        speed: 25 / FFT,
        playerSpeed: 75 / FFT,
        stop: CANVAS_HEIGHT - _self.fly.getHeight() - 60,
        start: false
    };

    // 自定义样式
    var dataPanelStyle = { // 计分板自定义样式
        offsetX: 20 * wscale,
        offsetY: 20 * hscale
    }
    var lifePanelStyle = {
        gapY: 10 * hscale
    }
    var lifeIconStyle = {
        offsetX: dataPanelStyle.offsetX + 5 * wscale,
        offsetY: dataPanelStyle.offsetY,
        width: 43 * wscale,
        height:28 * hscale,
        gapX: 10 * wscale
    }
    var lifeBarStyle = {
        offsetX: dataPanelStyle.offsetX + lifeIconStyle.width + lifeIconStyle.gapX,
        offsetY: dataPanelStyle.offsetY,
        width: 130 * wscale,
        heihgt: 20 * hscale
    }
    var scoreIconStyle = {
        offsetX: dataPanelStyle.offsetX,
        offsetY: dataPanelStyle.offsetY + lifeIconStyle.height + lifePanelStyle.gapY,
        width: 50 * wscale,
        height: 35 * hscale
    }
    var scoreNumStyle = { // 游戏分数的自定义样式
        offsetX: dataPanelStyle.offsetX + scoreIconStyle.width + 10 * wscale,
        offsetY: dataPanelStyle.offsetY + lifeIconStyle.height + lifePanelStyle.gapY,
        gapX: 10 * wscale,
        width: 20 * wscale,
        height: 28 * hscale
    }
    // 暂停按钮
    var btnPause = {
        x: CANVAS_WIDTH - 50,
        y: 15,
        width: 35,
        height: 30
    };
	// 重新开始按钮
    var returnBtn={
    	x: SCREEN_WIDTH/2 - 75,
        y: SCREEN_HEIGHT/2+50,
        width:150,
        height:50
    }
    // 开始按钮
    var startBtn={
    	x: SCREEN_WIDTH/2 - 75,
        y: SCREEN_HEIGHT/2-20,
        width:150,
        height:50
    }
    

    // 实例方法
    /**
     * 战斗场景初始化
     */
    // var tt; // 模拟获取分数计时器，后期需删除
    _self.init = function() {
        // if(tt) clearInterval(tt);
        // tt = setInterval(function(){var num = Math.floor(Math.random() * 100);num += _self.score.getScore(); _self.score.setScore(num)}, 500); // 模拟获取分数
        _self.drawBackground();
        _self.drawPlayer();
    }

    /**
     * 战斗结算方法
     */
    _self.handleBattle = function() { 
        _self.createEnemy();
        _self.moveByEnemy();
        _self.shootBulletByPlayer();
        _self.shootBulletByEnemy();
        _self.collisionHandler();
    }

    /**
     * 绘制战斗场景方法
     */
    _self.drawBattleFiled = function() {
        /******************************************************** */
        // 如下方法应分别刷新对应的画布层
        _self.drawBackground();
        _self.drawEnemy();
        _self.drawPlayer();
        _self.drawBullets();
        _self.drawPanel();
        _self.drawEffect();

        // 将各个画布层叠加在一起，刷新游戏容器画布
        /******************************************************** */
    }
   
    /**
     * 产生敌机方法
     */
    // var count = 0;
    _self.createEnemy = function() {
        // 产生敌机
        if(_self.createEnemyTimerValid() &&  _self.enemyArray.get().length < _self.enemyMaxNum) { // 随机时间序列，产生敌机
            // TODO: 判断是否能在坐标（x,y）处生成
            _self.enemyArray.add(new BlindMan({
                x:Math.floor(CANVAS_WIDTH * Math.random()),
                y: 0
            }));
            // count++;
        }
    }

    /**
     * 判断产生敌机轮询是否有效方法
     */
    _self.createEnemyTimerValid = function() {
        if(_self.createEnemyTimer === null) {
            _self.createEnemyTimer = setInterval(_self.createEnemyTimerHandler, FFT);
            return true;
        }
        return false;
    }
    _self.createEnemyTimerHandler = function() {
        _self.createEnemyTimeLeft -= 1;
        if(_self.createEnemyTimeLeft <= 0) {
            clearInterval(_self.createEnemyTimer);
            _self.createEnemyTimer = null;
            _self.createEnemyTimeLeft = _self.createEnemyPriod;
        }
    }



    /**
     * 敌机移动方法
     */
    _self.moveByEnemy = function() {
        var len = _self.enemyArray.get().length;
        for(var i = 0;i < len;i++) {
            _self.enemyArray.get()[i].move();
        }
    }

    /**
     * 玩家射击方法
     */
    _self.shootBulletByPlayer = function() {
        _self.fly.shootBullet();
    }

    /**
     * 敌机射击方法
     */
    _self.shootBulletByEnemy = function() {
        for(var i = 0;i < _self.enemyArray.get().length;i++) {
            _self.enemyArray.get()[i].shootBullet();
        }
    }

    
    
    /**
     * 玩家 && 敌机 && 子弹，碰撞检测及战斗结算
     */
    _self.collisionHandler = function() {
        // _self.fly
        // _self.fly.bulletArray
        // _self.enemyArray
        // _self.enmeyArray[i].bulletArray
        // 玩家 && 敌机 && 子弹，碰撞检测及战斗结算
        // 碰撞检测
        // 检测敌机子弹是否击中玩家
        // 检测玩家是否与敌机相撞

        /**
         * 对数据进行结构整理
         * @param {arrayLike} arr 将角色组数据整理为碰撞检测需要的结构
         */
        function formatData(arr) {
            var ans = [];
            for(var i = 0;i < arr.length;i++) {
                if(arr[i].getStatus() > -1) {
                    var tmpArr = [];
                    tmpArr.push(arr[i].getSkin());
                    tmpArr.push(arr[i].getX());
                    tmpArr.push(arr[i].getY());
                    tmpArr.push(arr[i].getWidth());
                    tmpArr.push(arr[i].getHeight());
                    ans.push(tmpArr)
                }
            }
            return ans;
        }
        var posEnemy = formatData(_self.enemyArray.get());
        var posPlayer = formatData([_self.fly]);
        // var posBulletsByEnemy = formatData(_self.enemyArray.bulletArray);
        var posBulletsByPlayer = formatData(_self.fly.bulletArray.get());
        
        // var hittedPlayer = occuredCollision(posPlayer, posBulletsByEnemy)
        // var crashedBullets = occuredCollision(posBulletsByPlayer, posBulletsByEnemy)


        // 检测玩家与敌机发生碰撞
        var crashedUnits = occuredCollision([posEnemy, posPlayer]);
        // 对发生碰撞的敌机与玩家进行处理
        for(var i = 0;i < crashedUnits.length;i++) {
            // 玩家血量结算，-> 玩家存活，游戏继续；玩家死亡，进入'game over'页面
            // _self.fly.bulletArray.get()[crashedUnits[i][3]].boom(); // 击中敌机的子弹发生爆炸
            // 玩家承担伤害
            // _self.enemyArray.get()[crashedUnits[i][1]]
            var crashedUnits_con1 = _self.fly.getStatus();
            var crashedUnits_con2 = _self.fly.takeDamage(_self.enemyArray.get()[crashedUnits[i][1]].getHealth());
            if(crashedUnits_con2 > 0) {
                // 敌机被击落，游戏继续
                _self.enemyArray.get()[crashedUnits[i][1]].crash();
            }else if(crashedUnits_con1 > -1 && crashedUnits_con2 <= 0) { 
                // 玩家被击落，游戏结束
                if(crashedUnits_con2 === 0) {
                    _self.enemyArray.get()[crashedUnits[i][1]].crash();
                }
                _self.fly.crash();
                // 生命跳转游戏结束页面
                setTimeout(function(){
                    // TODO: 清空敌机数组，子弹数组
                    window.gameState = GAME_STATE_OVER;
                }, _self.PlayerCrashCGTime);
                // _self.score.add(_self.enemyArray.get()[crashedUnits[i][1]].getBonus());
                // _self.enemyArray.get()[crashedUnits[i][1]].crash();
            }
        }

        // 检测玩家子弹是否击中敌机
        var hittedEnemy = occuredCollision([posEnemy, posBulletsByPlayer]);
        // 对发生碰撞的敌机和玩家子弹进行处理
        for(i = 0;i < hittedEnemy.length;i++) {
            _self.fly.bulletArray.get()[hittedEnemy[i][3]].boom(); // 击中敌机的子弹发生爆炸
            // 敌机承担伤害
            var hittedEnemy_con1 = _self.enemyArray.get()[hittedEnemy[i][1]].getStatus();
            var hittedEnemy_con2 = _self.enemyArray.get()[hittedEnemy[i][1]].takeDamage(_self.fly.getAD());
            if(hittedEnemy_con1 > -1 && hittedEnemy_con2 <= 0) { 
                // 更新玩家得分
                _self.score.add(_self.enemyArray.get()[hittedEnemy[i][1]].getBonus());
                _self.enemyArray.get()[hittedEnemy[i][1]].crash();
            }
        }
        
    }

    /**
     * 检测物体是否发生碰撞，并返回发生碰撞物体的数组下标
     */
    /**
     * 检测多组角色间是否发生碰撞
     * @param {array<array>} arr 数组包含多个角色组，每个角色组的成员都是一个数组，结构为： [skin, x, y, width , height]
     * @return {array} 返回发生碰撞的角色单位对应的下标 
     */
    /**
     * Explain:
     * occuredCollision(参数) -> return 返回结果
     * 
     * <array> 参数 = [角色组1, 角色组2]
     * <array> 角色组n = [角色组n单位1, 角色组n单位2, ... 角色组n单位m]
     * <array> 角色组n单位m = [角色组n单位m皮肤, 角色组n单位m左上角横坐标, 角色组n单位m左上角纵坐标, 角色组n单位m宽度, 角色组n单位m高度]
     * <canvas> 角色组n单位m皮肤
     * <number> 角色组n单位m左上角横坐标
     * <number> 角色组n单位m左上角纵坐标
     * <number> 角色组n单位m宽度
     * <number> 角色组n单位m高度
     * 
     * <array> 返回结果 = [碰撞序对1角色下标, 碰撞序对2角色下标, 碰撞序对3角色下标, ...碰撞序对q角色下标]
     * <array> 碰撞序对q角色下标 = [撞击角色组标号, 撞击角色组内元素标号, 被撞击角色组标号, 被撞击角色组内元素标号]
     * <number> 撞击角色组标号
     * <number> 撞击角色组内元素标号
     * <number> 撞击角色组标号
     * <number> 撞击角色组内元素标号
     * 
     * Example:
     * 角色组1--敌机：group1 = [ [enemySkinCanvas, 0, 100, 150, 150], [enemySkinCanvas, 250, 100, 150, 150] ]
     * 角色组2--玩家：group2 = [ [playerSkinCanvas, 200, 100, 150, 150] ]
     * 
     * 调用：
     * occuredCollision([group1, group2])
     * 
     * 结果预测：
     * 玩家将与group1中所有敌机都发生碰撞。
     * 
     * 返回结果：
     * [
     *  [0, 0, 1, 0],
     *  [0, 1, 1, 0]
     * ]
     */
    function occuredCollision(arr) {
        var ans = [];
        if(arr && arr instanceof Array) {
            if(arr.length > 1) {
                var glen = arr.length;
            }else {
                return ans;
            }
        }else {
            console.warn('传入参数类型错误，碰撞检测')
            return ans;
        }
        // 4重循环，判断碰撞
        for(var gi = 0;gi < glen;gi++) { // 每个角色组之间相互检测碰撞
            for(var gj = gi + 1;gj < glen;gj++) {
                var alen = arr[gi].length;
                var blen = arr[gj].length;
                for(var ui = 0;ui < alen;ui++) { // 两个不同的角色组中所有角色相互检测碰撞
                    for(var uj = 0;uj < blen;uj++) {
                        var A1 = arr[gi][ui][1] - arr[gj][uj][1] - arr[gj][uj][3];
                        var B1 = arr[gi][ui][2] - arr[gj][uj][2] - arr[gj][uj][4];
                        var C1 = arr[gi][ui][1] + arr[gi][ui][3] - arr[gj][uj][1];
                        var D1 = arr[gi][ui][2] + arr[gi][ui][4] - arr[gj][uj][2];
                        // var A2 = arr[gj][uj][1] - arr[gi][ui][1] - arr[gi][ui][3];
                        // var B2 = arr[gj][uj][2] - arr[gi][ui][2] - arr[gi][ui][4];
                        // var C2 = arr[gj][uj][1] + arr[gj][uj][3] - arr[gi][ui][1];
                        // var D2 = arr[gj][uj][2] + arr[gj][uj][4] - arr[gi][ui][2];
                        if(!(A1 > 0 || B1 > 0 || C1 < 0 || D1 < 0)) { //  && !(A2 > 0 || B2 > 0 || C2 < 0 || D2 < 0)
                            ans.push([gi, ui, gj, uj])
                        }
                    }
                }
            }
        }
        return ans;
    }
    // 角色组碰撞检测测试用例
    // var ey =[ [null, 0, 100, 150, 150], [null, 250, 100, 150, 150] ]
    // var p = [ [null, 200, 100, 150, 150] ];
    // var ans = occuredCollision([ ey, p]);
    // console.log('ans : ',ans)

    

    /**
     * 刷新战斗场景界面
     */
    _self.drawBackground = function () {
        if(_self.fly === null) _self.fly = new Player();
        if (background.start) {
            background.y += background.speed;
        }
        // 背景图片
        _self.ctx.clearRect(0, 0, _self.width, _self.height);
        _self.ctx.save();
        _self.ctx.drawImage(picture["gameStartBgImage"], background.x, background.y, CANVAS_WIDTH, CANVAS_HEIGHT);
        _self.ctx.drawImage(picture["gameStartBgImage"], background.x, background.y - CANVAS_HEIGHT, CANVAS_WIDTH, CANVAS_HEIGHT);
        if (background.y >= CANVAS_HEIGHT) {
            background.y = 0;
        }
        if (_self.fly.getY() <= background.stop) {
            background.start = true;
            // 改变游戏状态
            window.gameState = GAME_STATE_START;
        }
        
        // _self.ctx.restore();
    };

    /**
     * 绘制敌机
     */
    _self.drawEnemy = function() {
        _self.enemyArray.draw(_self.ctx)
    }

    /**
     * 绘制玩家
     */
    _self.drawPlayer = function() {
        // 飞机初始化
        if (!background.start) {
            _self.fly.setY(_self.fly.getY() - background.playerSpeed);
        }
        _self.ctx.drawImage(_self.fly.getSkin(), _self.fly.getX(), _self.fly.getY(), _self.fly.getWidth(), _self.fly.getHeight());
    }

    /**
     * 绘制子弹
     */
    _self.drawBullets = function() {
        _self.fly.bulletArray.bulletManage(_self.ctx);
        for(var i = 0;i < _self.enemyArray.get().length;i++) {
            _self.enemyArray.get()[i].bulletArray.bulletManage(_self.ctx);
        }
    }

    /**
     * 绘制游戏面板
     */
    _self.drawPanel = function() {
        // 暂时按钮
        _self.ctx.drawImage(picture["pauseImage"], btnPause.x, btnPause.y, btnPause.width, btnPause.height);
        // 绘制计分板
        var lifeIconCanvas = document.createElement('canvas'); // 绘制生命条文字标识
        var lifeIconCtx = lifeIconCanvas.getContext('2d');
        lifeIconCanvas.width = lifeIconStyle.width * 1.05;
        lifeIconCanvas.height = lifeIconStyle.height;
        lifeIconCtx.font = 'italic ' + (lifeIconStyle.height) + "px bold Arial";
        lifeIconCtx.textBaseline = 'middle';
        lifeIconCtx.strokeStyle = 'red';
        lifeIconCtx.strokeText('HP', 0, lifeIconStyle.height / 2);
        lifeIconCtx.shadowBlur = 5;
        lifeIconCtx.shadowColor = 'red';
        lifeIconCtx.fillStyle = '#fff';
        lifeIconCtx.fillText('HP', 0, lifeIconStyle.height / 2);
        _self.ctx.drawImage(lifeIconCanvas, 0, 0, lifeIconCanvas.width, lifeIconCanvas.height, lifeIconStyle.offsetX, lifeIconStyle.offsetY, lifeIconCanvas.width, lifeIconCanvas.height)
        ;(function(x, y, w, h, delta, lifeMax, life){// 绘制生命条
            var playerLifeBar = new PlayerLifeBar(lifeMax);
            var lifeBarCanvas = playerLifeBar.getLifeBarCanvas(w, h, 'fill', '#4c4c4c', delta);
            var tmpLife_w = w * (life / lifeMax);
            _self.ctx.drawImage(lifeBarCanvas, x, y, w, h);
            lifeBarCanvas = playerLifeBar.getLifeBarCanvas(w, h, 'stroke', 'orange', delta);
            _self.ctx.drawImage(lifeBarCanvas, x, y, w, h);
            lifeBarCanvas = playerLifeBar.getLifeBarCanvas(tmpLife_w, h, 'fill', 'orange', delta);
            _self.ctx.drawImage(lifeBarCanvas, x, y, tmpLife_w, h);
        })(lifeBarStyle.offsetX, 
            lifeBarStyle.offsetY + lifeIconCanvas.height / 2 - lifeBarStyle.heihgt / 2, 
            lifeBarStyle.width, 
            lifeBarStyle.heihgt, 
            10,
            _self.fly.getHealthMax(),
            _self.fly.getHealth());
        // 绘制记分板处玩家图标
        _self.ctx.drawImage(picture['playerImage'], 0, 0, 153, 101, scoreIconStyle.offsetX, scoreIconStyle.offsetY, scoreIconStyle.width, scoreIconStyle.height)

        // TODO: 将分数绘制独立为方法，添加到分数对象
        for(var scoreIdx = 0;scoreIdx < _self.score.arr.length;scoreIdx++) { // 绘制分数
            if(!_self.score.arr[scoreIdx].src) break;
            var x = scoreNumStyle.offsetX + scoreIdx * (scoreNumStyle.width + scoreNumStyle.gapX);
            var y = scoreNumStyle.offsetY;
            _self.ctx.drawImage(_self.score.arr[scoreIdx], 0, 0, 63, 86, x, y, scoreNumStyle.width, scoreNumStyle.height);
        }
        // 绘制计分板 end
    }

    /**
     * 绘制交互效果
     */
    _self.drawEffect = function() {
        // TODO: 玩家中弹时的交互效果
    }

    // /**
    //  * 射击子弹方法
    //  */
    // _self.shootBullet = function () {
    //     if (_self.isBulletTime()) {
    //         var bullet = new Bullet({'skin':picture["bulletImage"]});
    //         bullet.calculatePosition(_self.fly);
    //         _self.fly.bulletArray.add(bullet);
    //     }
    // };

    // /**
    //  * 判断是否为射击时机
    //  */
    // _self.isBulletTime = function () {
    //     if (intervalId === null) {
    //         intervalId = setInterval(_self.scaleTime, intervalTime);
    //         return true;
    //     }
    //     return false;
    // };

    // /**
    //  * 子弹射击轮询handler
    //  */
    // _self.scaleTime = function () {
    //     tempTime -= 2;
    //     if (tempTime <= 0) {
    //         tempTime = bulletShootTime;
    //         clearInterval(intervalId);
    //         intervalId = null;
    //     }
    // };
    

    // 内部函数
    /**
     * 暂停界面
     */
    function pausekey() {
        _self.pauseStatus = true;
       	_self.ctx.drawImage(picture["goonButton"], returnBtn.x, returnBtn.y, returnBtn.width, returnBtn.height);
      	_self.ctx.drawImage(picture["restartButton"], startBtn.x, startBtn.y, startBtn.width, startBtn.height);
    }

    /**
     * 生成一个能覆盖游戏界面的画布层
     * @param {number} w 游戏容器的canvas画布宽度
     * @param {number} h 游戏容器的canvas画布高度
     * @return {CanvasRenderingContext2D} 返回生成的canvas画布
     */
    // function createLayerCtx(w, h) {
    //     var c = document.createElement('canvas');
    //     c.width = w;
    //     c.height = h;
    //     return c.getContext('2d');
    // }


    // 绑定事件
    /**
     * 单击事件
     * @param x
     * @param y
     */
    _self.click = function (x, y) {
        // 暂时功能按钮
        if (x >= btnPause.x && x <= (btnPause.x + btnPause.width)
            && y >= btnPause.y && y <= (btnPause.y + btnPause.height)) {
            if(window.intervalId !== null) {
            	pausekey();
                stopInterval(window.intervalId);
            } else {
                startInterval();
            }
        }

        // 暂停状态下，点击按钮
        if(_self.pauseStatus) {
            if(x >= returnBtn.x && x <= (returnBtn.x + returnBtn.width)
            && y >= returnBtn.y && y <= (returnBtn.y + returnBtn.height)) {
                // 继续游戏按钮
                _self.pauseStatus = false;
                startInterval();
            }else if(x >= startBtn.x && x <= (startBtn.x + startBtn.width)
            && y >= startBtn.y && y <= (startBtn.y + startBtn.height)) {
                // 再来一次按钮
            }
        }
    };
};