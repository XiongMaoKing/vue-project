// 2 倒计时

// 3 返回顶部


// 移动端事件
// 轮播图
// 导航列表左右两个div来回切换
// 文字滚动

// 功能模块化 
// 采用js对象的方式进行管理

// jq： DOMContentLoaded 
// js:  onload  
// addEventListener() 绑定事件

window.addEventListener('load', function() {
    fe1316.headerSearchFunc();
    fe1316.downTime();
    fe1316.goTop();
    fe1316.lunbo_navtive();
});



var fe1316 = {
    tool: {
        zero: function(m) {
            return m < 10 ? "0" + m : m;
        }
    },
    // 1 功能1: 头部搜索区域的 背景颜色随着滚动距离显示  层级问题
    headerSearchFunc: function() {
        // 思路： 随着滚动条不断向上滚动  让顶部搜索区域的背景颜色 从透明度为0 透明度为1
        // 给一个临界值 当垂直滚动过的距离 一旦 大于等于了 比如说 轮播图区域的高度 则 透明度变为1

        // 先来获取一下这个临界值
        var lunboH = document.querySelector('.jd_lunbo').offsetHeight;
        var header = document.querySelector('header')


        // 监测滚动的变化 onscroll   ===> scrollTop
        window.addEventListener('scroll', function() {
            // 垂直方向的滚动过的距离
            var iTop = document.documentElement.scrollTop;
            console.log(iTop);
            // 当一滚动 就提高一下层级
            if (iTop > 0) {
                header.style.zIndex = 10;
            } else {
                header.style.zIndex = 0;

            }
            // 逐渐让背景颜色显示出来 （根据比值）
            header.style.backgroundColor = "rgba(228,49,48," + (iTop / lunboH) + ")";



        })

    },
    downTime: function() {
        // 设定一个时间点 3个小时
        var newTime = 60 * 60 * 3;

        // 先获取时间框中的 3个div
        var allEle = document.querySelectorAll('.time>div');
        timeFunc.bind(this);

        function timeFunc() {
            newTime--;

            var h = parseInt(newTime / 3600);
            var m = parseInt(newTime % 3600 / 60);
            var s = newTime % 60;

            if (newTime < 0) {
                clearInterval(timer);
                newTime = 0;
                return this.downTime();
            }

            // 小时
            allEle[0].innerHTML = this.tool.zero(h);
            // 分钟
            allEle[1].innerHTML = this.tool.zero(m);
            // 秒
            allEle[2].innerHTML = this.tool.zero(s);

        }

        // 开启定时器
        var timer = setInterval(timeFunc.bind(this), 1000);

    },
    goTop: function() {
        // 1 打开页面 先隐藏起来 这个返回顶部按钮
        // 当滚动的超过一屏的距离 让显示出来 
        var goTopEle = document.querySelector('.goTop');
        goTopEle.style.display = 'none';

        window.addEventListener('scroll', function() {
            var iTop = document.documentElement.scrollTop;
            var iH = document.documentElement.clientHeight;
            if (iTop >= iH) {
                goTopEle.style.display = 'block';
            } else {
                goTopEle.style.display = 'none';
            }
        })


        // 2 单击 鼠标 touch事件 touchstart  touchmove   touchend  
        // 当手指触摸返回顶部按钮 离开的时候  让滚动距离变为 0  返回顶部（定时器）
        goTopEle.addEventListener('touchend', function() {
            // console.log('触发touchend事件啦');
            var iTop = document.documentElement.scrollTop;
            var timer = setInterval(function() {
                iTop -= 50;
                if (iTop <= 0) {
                    clearInterval(timer);
                    iTop = 0;
                }
                document.documentElement.scrollTop = iTop;

            }, 10);

        });
    },
    // 轮播图// 左右盒子滑动/ 文字滚动  / 京东秒杀 内容区域列表拖动
    lunbo_navtive: function() {
        /**
         * 无缝轮播图 
         *  功能1: 让轮播图自动走起来 （定时器） 小方块跟着走
         *  功能2: 手指触摸的时候 让轮播图跟着滑动 （touch事件）
         *  功能3: 手指触摸的完毕 判断 手指滑动的距离 如果滑动的距离大于屏幕宽度的1/3 就让轮播图滑动过去（下一张）
         *         如果滑动的距离小于屏幕的1/3  让轮播图吸附回去
         * 功能4: 判断手指滑动的方向 如果是 向左 往下一张滑动  向右的滑动的时候 往前一张滑动
         * 
         */

        // 功能1 无缝轮播 需要 做一些初始化准备工作
        // 获取轮播图元素
        var lunbo = document.querySelector('.lunbo_con');
        // 获取一个屏幕的宽度 也就是一个li的宽度
        var iW = lunbo.querySelector('li').offsetWidth;
        var navs = document.querySelectorAll('.nav>ol>li');

        console.log(iW);
        console.log(navs);
        // 需要在第一个li的前面 加一个 和 最后一个li一样的元素
        var first = lunbo.children[0].cloneNode(true);
        // 需要在最后一个li的后面 加一个和 第一个li一样的元素
        var last = lunbo.children[lunbo.children.length - 1].cloneNode(true);
        lunbo.appendChild(first);
        lunbo.insertBefore(last, lunbo.children[0]);

        // 先设置一个全局变量
        var num = 1;
        // 让轮播图初始化位置应该第一张图的位置 （位移到负的一个宽度） 
        lunbo.style.transform = 'translateX(' + (-iW * num) + 'px)';
        lunbo.style.webkitTransform = 'translateX(' + (-iW * num) + 'px)';
        // 有必要兼容旧的webkit内核浏览器 safari  chrome

        // 开启一个定时器
        var timer = setInterval(function() {
            num++;
            //添加一个位移的过渡时间
            lunbo.style.transition = "all 0.3s";
            lunbo.style.webkitTransition = "all 0.3s";
            // 位移
            lunbo.style.transform = 'translateX(' + (-iW * num) + 'px)';
            lunbo.style.webkitTransform = 'translateX(' + (-iW * num) + 'px)';

        }, 2000);

        // transitionend 事件  addEventListener
        lunbo.addEventListener('transitionend', function() {
            console.log('触发了我的transitionend事件啦');
            console.log(num);
            // num 右边临界点 6
            if (num >= navs.length + 1) {
                num = 1;
                // 移除过渡时间
                lunbo.style.transition = "none";
                lunbo.style.webkitTransition = "none";
                lunbo.style.transform = 'translateX(' + (-iW * num) + 'px)';
                lunbo.style.webkitTransform = 'translateX(' + (-iW * num) + 'px)';
            }

            // 左边的临界值  0
            if (num <= 0) {
                num = navs.length;
                // 移除过渡时间
                lunbo.style.transition = "none";
                lunbo.style.webkitTransition = "none";
                lunbo.style.transform = 'translateX(' + (-iW * num) + 'px)';
                lunbo.style.webkitTransform = 'translateX(' + (-iW * num) + 'px)';
            }

            // 当前这一次滑动完毕之后 应让小方块跟着走‘
            // 让之前的那个带active类的小方块去掉active
            document.querySelector('.nav>ol>li.active').classList.remove('active');
            // 让当前的小方块 加上这个类active
            navs[num - 1].classList.add('active');

        })
        lunbo.addEventListener('webkitTransitionend', function() {
            console.log('触发了我的transitionend事件啦');
            console.log(num);
            // num 右边临界点 6
            if (num >= navs.length + 1) {
                num = 1;
                // 移除过渡时间
                lunbo.style.transition = "none";
                lunbo.style.webkitTransition = "none";
                lunbo.style.transform = 'translateX(' + (-iW * num) + 'px)';
                lunbo.style.webkitTransform = 'translateX(' + (-iW * num) + 'px)';
            }

            // 左边的临界值  0
            if (num <= 0) {
                num = navs.length;
                // 移除过渡时间
                lunbo.style.transition = "none";
                lunbo.style.webkitTransition = "none";
                lunbo.style.transform = 'translateX(' + (-iW * num) + 'px)';
                lunbo.style.webkitTransform = 'translateX(' + (-iW * num) + 'px)';
            }

            // 当前这一次滑动完毕之后 应让小方块跟着走‘
            // 让之前的那个带active类的小方块去掉active
            document.querySelector('.nav>ol>li.active').classList.remove('active');
            // 让当前的小方块 加上这个类active
            navs[num - 1].classList.add('active');

        })


        // 功能2: 做一些初始化的工作：
        // 1 开始触摸的坐标点
        var startX = 0;
        // 2 滑动的坐标
        var moveX = 0;
        // 3 是否滑动啦 （优化）
        var isMove = false;
        // 4 滑动的距离
        var disX = 0;

        // 给轮播图添加touchstart事件
        lunbo.addEventListener('touchstart', function(e) {
            // 清除定时器 不要自动执行轮播
            clearInterval(timer);
            // 获取的手指按下的坐标点x
            startX = e.touches[0].clientX;
        });
        lunbo.addEventListener('touchmove', function(e) {
            isMove = true;
            moveX = e.touches[0].clientX;
            // 滑动的位置和当初按下的位置的差值
            disX = moveX - startX;
            lunbo.style.transition = "none";
            lunbo.style.webkitTransition = "none";
            lunbo.style.transform = 'translateX(' + (-iW * num + disX) + 'px)';
            lunbo.style.webkitTransform = 'translateX(' + (-iW * num + disX) + 'px)';
        });
        lunbo.addEventListener('touchend', function() {
            // 先判断你滑动了吗？
            if (isMove) {
                // 判断disX 是否 超过屏幕的1/3 如果超过1/3 则 要滑动到下一张（？？前一张 后一张）
                if (Math.abs(disX) >= iW / 3) {
                    // 要所有改变啦
                    if (disX > 0) {
                        num--;
                    } else {
                        num++;
                    }
                }
                //添加一个位移的过渡时间
                lunbo.style.transition = "all 0.3s";
                lunbo.style.webkitTransition = "all 0.3s";
                lunbo.style.transform = 'translateX(' + (-iW * num) + 'px)';
                lunbo.style.webkitTransform = 'translateX(' + (-iW * num) + 'px)';


                // 1 开始触摸的坐标点
                startX = 0;
                // 2 滑动的坐标
                moveX = 0;
                // 3 是否滑动啦 （优化）
                isMove = false;
                // 4 滑动的距离
                disX = 0;

                // 再开启定时器
                timer = setInterval(function() {
                    num++;
                    //添加一个位移的过渡时间
                    lunbo.style.transition = "all 0.3s";
                    lunbo.style.webkitTransition = "all 0.3s";
                    // 位移
                    lunbo.style.transform = 'translateX(' + (-iW * num) + 'px)';
                    lunbo.style.webkitTransform = 'translateX(' + (-iW * num) + 'px)';

                }, 2000);
            }
        });







    }



}