/**
 * 将一个图片转为canvas画布
 * @param {image} item image对象或image标签元素
 * @return {object} 返回一个canvas画布
 */
function imgToCanvas(item, callback) {
    var _callback = callback || null;
    var c = document.createElement('canvas');
    var ctx = c.getContext('2d');
    var img = new Image();
    img.src = item.src;
    img.onload = function() {
        var w = img.width;
        var h = img.height;
        c.width = w;
        c.height = h;
        ctx.drawImage(img, 0, 0, w, h);
        if(_callback) {
            _callback(c);
        }
    }
}

