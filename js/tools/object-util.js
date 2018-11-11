/**
 * 实现函数的对象属性继承、原型链属性继承
 * @param {Class} Child 子类
 * @param {Class} Parent 父类
 * @param {object} _this 子类实例
 * @param {object} args 子类的配置参数，可覆盖父类属性的初始值
 */
function extend(Child, Parent, _this, args) {
    var F = function(){};
    Parent.call(_this, args);
    F.prototype = Parent.prototype;
    Child.prototype = new F();
    Child.prototype.constructor = Child;
    Child.prototype.uber = Parent.prototype;
}

/**
 * 合并两个对象属性。后者含有前者属性时将覆盖前者属性的值
 * @param {object} target 目标对象
 * @param {object} res 更新属性对象
 */
function merge(target, res) {
    for(var i in res) {
        target[i] = res[i]
    }
    return target;
}