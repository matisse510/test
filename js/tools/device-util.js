/*
 * description: 设备相关的工具集合
 * author: owen
 * update: 2018-08-13
 */

/**
 * 判断当前设备是否为移动端
 * @function isMobile
 * @return {boolean} 当为移动端时，返回true，否则为false
 */
var isMobile = function () {
    if ((navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
        return true
    } else {
        return false
    }
}


