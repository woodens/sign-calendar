;(function($, window, document,undefined) {
    $.fn.SignCalendar=function () {
        return new SignCalendar(this);
    }
    var SignCalendar = function(ele,opt){
        this.$element = ele;
        this.defaults={};
        this.option = $.extend({}, this.defaults, opt);
        this.init();
    }
    /**
     * 初始化
     */
    SignCalendar.prototype.init = function(){
        var calendarHeaderHtml = this.createCalendarHeader('2016/05','2016年05月').outerHTML;
        var calendarWeekHtml = this.createCalendarWeek().outerHTML;
        var calendarListHtml = this.createCalendarList('2016/05',['2016-05-06']).outerHTML;
        this.$element.innerHTML = calendarHeaderHtml+calendarWeekHtml+calendarListHtml;
    }
    /**
     * 创建头部
     * @param date     日历时间  yyyy/MM
     * @param dateStr  日历时间字符串 XX年xx月
     * @returns {*}
     */
    SignCalendar.prototype.createCalendarHeader = function (date,dateStr) {
        var calendarHeader =  createElement('div',{'class':'calendar-header'});
        var prevHtml = createElement('a',{'class':'month-prev switch-btn','href':'javascript:;'},'&lt;');
        var textHtml = createElement('a',{'class':'calendar-month-txt calendar-title','href':'javascript:;','data-value':date},dateStr);
        var nextHtml = createElement('a',{'class':'month-next switch-btn','href':'javascript:;'},'&gt;');
        //todo 如果跳转的时间距今超过六个月不显示后退按钮

        //todo 如果是当月的不显示前进按钮

        //todo 绑定事件

        calendarHeader.appendChild(prevHtml);
        calendarHeader.appendChild(textHtml);
        calendarHeader.appendChild(nextHtml);
        return calendarHeader;
    }
    /**
     * 创建星期
     * @returns {Element}
     */
    SignCalendar.prototype.createCalendarWeek = function () {
        var calendarWeek = createElement('div', {'class' : 'calendar-week'}),
            weeks = '日一二三四五六';

        for(var i = 0 ; i < 7 ; i++){
            var n = i + 1, data = {};
            if(n % 7 == 1 || n % 7 == 0)data['class'] = 'weekend';
            calendarWeek.appendChild(createElement('span', data, weeks.charAt(i)));
        }
        return calendarWeek;
    }

    /**
     * 创建日历列表
     * @param date
     * @param data
     * @returns {*}
     */
    SignCalendar.prototype.createCalendarList = function(date,data){
        var calendarList = createElement('div',{'class':'calendar-list'});
        //todo 计算当前月份显示用的开始日期及结束日期
        //todo 循环日期 设置样式
        return calendarList;
    }
    /**
     * 创建元素
     * @param tagname [标签名字]
     * @param attr    [属性(多个)]
     * @param html    [内容]
     */
    function createElement(tagname, attr, html){
        if(!tagname)return;

        attr = attr || {};
        html = html || '';

        var element = document.createElement(tagname);

        for(var i in attr){
            element.setAttribute(i, attr[i]);
        }

        element.innerHTML = html;
        return element;
    }
})(jQuery,window,document);