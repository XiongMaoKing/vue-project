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
    // fe1316.lunbo_navtive();
    fe1316.lunbo_zepto();
    fe1316.nav_slide();
    fe1316.text_scroll();
});



var fe1316 = {
    tool: {
        zero: function(m) {
            return m < 10 ? "0" + m : m;
        },
        removeTrans: function(obj) {
            obj.style.transition = "none";
            obj.style.webkitTransition = "none";
        },
        addTrans: function(obj) {
            obj.style.transition = "all 0.3s";
            obj.style.webkitTransition = "all 0.3s";
        },
        translate: function(obj, disX) {
            obj.style.transform = disX;
            obj.style.webkitTransform = disX;
        },
        // 封装一个函数 来实现 transitionend 和 webkittrnasitionend的事件写法兼容 通过
        // 传入回调函数的形式 实现代码简化
        transitionend: function(dom, callback) {
            if (dom && typeof dom == "object") {
                dom.addEventListener('transitionend', function(e) {
                    (typeof callback == 'function') && callback.call(dom, e);
                })
                dom.addEventListener('webkitTransitionend', function(e) {
                    (typeof callback == 'function') && callback.call(dom, e);
                })
            }
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
        this.tool.translate(lunbo, 'translateX(' + (-iW * num) + 'px)');
        // 有必要兼容旧的webkit内核浏览器 safari  chrome

        var that = this;

        // 开启一个定时器
        var timer = setInterval(function() {
            num++;
            //添加一个位移的过渡时间
            that.tool.addTrans(lunbo);
            // 位移
            that.tool.translate(lunbo, 'translateX(' + (-iW * num) + 'px)');

        }, 2000);

        that.tool.transitionend(lunbo, function() {
            console.log('触发了我的transitionend事件啦');
            console.log(num);
            // num 右边临界点 6
            if (num >= navs.length + 1) {
                num = 1;
                // 移除过渡时间
                that.tool.removeTrans(lunbo);
                that.tool.translate(lunbo, 'translateX(' + (-iW * num) + 'px)');
            }

            // 左边的临界值  0
            if (num <= 0) {
                num = navs.length;
                // 移除过渡时间
                that.tool.removeTrans(lunbo);
                that.tool.translate(lunbo, 'translateX(' + (-iW * num) + 'px)');
            }

            // 当前这一次滑动完毕之后 应让小方块跟着走‘
            // 让之前的那个带active类的小方块去掉active
            document.querySelector('.nav>ol>li.active').classList.remove('active');
            // 让当前的小方块 加上这个类active
            navs[num - 1].classList.add('active');

        });


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
            that.tool.removeTrans(lunbo);
            that.tool.translate(lunbo, 'translateX(' + (-iW * num + disX) + 'px)');
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
                that.tool.addTrans(lunbo);
                that.tool.translate(lunbo, 'translateX(' + (-iW * num) + 'px)');


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
                    that.tool.addTrans(lunbo);
                    that.tool.translate(lunbo, 'translateX(' + (-iW * num) + 'px)');

                }, 2000);
            }
        });
    },
    lunbo_zepto: function() {
        // *  功能1: 让轮播图自动走起来 （定时器） 小方块跟着走
        //  *  功能2: 手指触摸的时候 让轮播图跟着滑动 （touch事件）
        //  *  功能3: 手指触摸的完毕 判断 手指滑动的距离 如果滑动的距离大于屏幕宽度的1/3 就让轮播图滑动过去（下一张）
        //  *         如果滑动的距离小于屏幕的1/3  让轮播图吸附回去
        //  * 功能4: 判断手指滑动的方向 如果是 向左 往下一张滑动  向右的滑动的时候 往前一张滑动
        //  * 
        var lunbo = $('.lunbo_con').eq(0);
        var iW = lunbo.children("li").eq(0).width();
        console.log(iW);
        var navs = $('.nav>ol>li');
        // 在第一个前面添加最后一个一样的li
        var first = lunbo.children('li').eq(0).clone();
        var last = lunbo.find('li').last().clone();
        console.log(first, last);
        lunbo.append(first);
        lunbo.prepend(last);
        // 在最后一个的后面添加和第一个一样li
        var num = 1;
        lunbo.css({ transform: "translateX(" + (-iW * num) + "px)" });

        var animateFunc = function() {
            lunbo.animate({
                transform: "translateX(" + (-iW * num) + "px)"
            }, "linear", 2000, function() { //这是回调函数
                if (num >= navs.length + 1) {
                    num = 1;
                    lunbo.css({ transform: "translateX(" + (-iW * num) + "px)" });
                }
                // 左侧边界
                if (num <= 0) {
                    num = navs.length;
                    lunbo.css({ transform: "translateX(" + (-iW * num) + "px)" });
                }

                // 先让之前带有active类元素去掉active类
                $('.nav>ol>li.active').removeClass("active");
                // 让当前的对应的li添加active
                navs.eq(num - 1).addClass('active');
            });
        }

        var timer = setInterval(function() {
            num++;
            animateFunc();
        }, 2000);

        // 向左滑动 zepto touch模块   swipeLeft  swipeRight
        lunbo.on('swipeLeft', function() {
            // console.log('向左滑动');
            num++;
            animateFunc();
        });


        // 向右滑动
        lunbo.on('swipeRight', function() {
            // console.log('向右滑动');
            num--;
            animateFunc();
        });

        // 手指按下 清除定时器
        lunbo.on('touchstart', function() {
            clearInterval(timer);
        })

        // 手指离开的时候 开启定时器
        lunbo.on('touchend', function() {
            timer = setInterval(function() {
                num++;
                animateFunc();
            }, 2000);
        })



    },

    // 左右滑动 导航列表区域 左右滑动
    nav_slide: function() {
        // 先获取元素
        var slider = document.querySelector('.nav_list_wraper');
        var navs = document.querySelectorAll('.nav_list_circle>li');

        var startX = 0;
        var moveX = 0;
        var isMove = 0;
        var disX = 0;

        // 设置一个开关 用来判断当前是处于哪个div中 画面
        var flag = 0;
        // 获取到当前屏幕宽度
        var iW = slider.children[0].offsetWidth;
        console.log(iW);


        slider.addEventListener('touchstart', function(e) {
            startX = e.touches[0].clientX;
        })

        slider.addEventListener('touchmove', function(e) {
            isMove = true;
            moveX = e.touches[0].clientX;
            disX = moveX - startX;
            console.log(disX);

        });

        slider.addEventListener('touchend', () => {
            // 先判断是否滑动
            if (isMove) {
                // 第一个div 中  如果disX 是一个负值 并且 disX的距离 大于等于1/3  才让右边的第二个div滑过来

                // 第二个div中  disX 是一个正值  并且 滑动距离大于1/3   滑回去第一个div的位置
                if (flag) {
                    // flag: 1
                    if (disX > 0 && (Math.abs(disX) > iW / 3)) {
                        this.tool.addTrans(slider);
                        this.tool.translate(slider, "translateX(" + 0 + "px)");
                        this.tool.transitionend(slider, function() {
                            navs[1].classList.remove('active');
                            navs[0].classList.add('active');
                        });
                        flag = 0;
                    }

                } else {
                    console.log(1111);

                    // flag: 0
                    // 第一个div 0 
                    if (disX < 0 && (Math.abs(disX) >= iW / 3)) {
                        this.tool.addTrans(slider);
                        this.tool.translate(slider, "translateX(" + (-iW) + "px)");
                        this.tool.transitionend(slider, function() {
                            navs[0].classList.remove('active');
                            navs[1].classList.add('active');
                        });
                        flag = 1;
                    }

                }
            }
        });


    },
    text_scroll: function() {
        // 1 获取元素
        var oUl = document.querySelector('.jdkb>ul');

        // 最后的位置添加一个和第一个一样的li
        var firstLi = oUl.children[0].cloneNode(true);
        oUl.appendChild(firstLi);

        var aLi = oUl.querySelectorAll('li');
        // 拿到一个li的高度
        var iH = aLi[0].offsetHeight;



        // 设置全局变量 用来控制li的滚动
        var num = 0;
        // 自动走起来
        var timer = setInterval(function() {
            num++;
            this.tool.addTrans(oUl);
            this.tool.translate(oUl, 'translateY(' + (-iH * num) + 'px)');
            var that = this;
            this.tool.transitionend(oUl, function() {
                console.log(num);
                if (num >= aLi.length - 1) {
                    num = 0;
                    that.tool.removeTrans(oUl);
                    that.tool.translate(oUl, "translateY(" + (-iH * num) + "px)");
                }


            })
        }.bind(this), 2000);
    }





}