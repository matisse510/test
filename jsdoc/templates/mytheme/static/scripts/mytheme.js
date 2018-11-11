window.onload = function() {
    var tmpScrollVal = window.pageYOffset + 1;
    window.scrollTo(0, tmpScrollVal);
    window.scrollTo(0, tmpScrollVal - 1);
    window.onscroll = function() {
        var t = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
        var offsetT = t + 200;
        var ul = document.querySelectorAll('h4.name');
        var className = '';
        var navUl = document.querySelectorAll('.nav-li');
        for(var i = ul.length - 1;i > 0;i--) {
            if(ul[i].offsetTop > offsetT && ul[i - 1].offsetTop < offsetT) {
                className = ul[i - 1].id;
                navUl = document.querySelectorAll('.nav-li');
                navUl.forEach(function(val, k, p) {
                    val.removeAttribute('decoration')
                })
                document.querySelector('.nav-li.' + className).setAttribute('decoration', 'under-line')
         
            }
        }
    }

    var navUl = document.querySelectorAll('.nav-li');
    navUl.forEach(function(v, k, p) {
        v.addEventListener('click',function(e) {
            console.log(1)
            var navUl = document.querySelectorAll('.nav-li');
            navUl.forEach(function(val, k, p) {
                val.removeAttribute('decoration')
            })
            this.setAttribute('decoration', 'under-line');
        })
    })    
}