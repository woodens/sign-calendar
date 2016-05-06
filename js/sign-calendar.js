;(function($, window, document,undefined) {
    $.fn.SignCalendar=function (opt) {
        return new SignCalendar(this,opt);
    }
    var SignCalendar = function(ele,opt){
        this.$element = ele;
        var curDate = new Date();
        this.defaults={
            year:curDate.getFullYear(),
            month:curDate.getMonth()+1,
            times:[]
        };
        this.option = $.extend({}, this.defaults, opt);
        this.switchMonth(this.option['year'],this.option['month']);
    }
    /**
     * 创建头部
     * @param year
     * @param month
     * @returns {*}
     */
    SignCalendar.prototype.createCalendarHeader = function (year,month) {
        var dateStr = year+'年'+month+'月';
        var calendarHeaderHtml = [];
        calendarHeaderHtml.push('<div class="calendar-header">');
        calendarHeaderHtml.push('<a class="month-prev switch-btn" href="javascript:;">&lt;</a>');
        calendarHeaderHtml.push('<a class="calendar-month-txt calendar-title" href="javascript:;" data-year="'+year+'" data-month="'+month+'">'+dateStr+'</a>');

        //如果是当月的不显示前进按钮
        if(new Date().getFullYear()==year && new Date().getMonth()+1==month){
            calendarHeaderHtml.push('<a class="month-next switch-btn switch-btn-disable" href="javascript:;">&gt;</a>');
        }else{
            calendarHeaderHtml.push('<a class="month-next switch-btn" href="javascript:;">&gt;</a>');
        }

        calendarHeaderHtml.push('</div>');
        return calendarHeaderHtml.join('');
    }
    /**
     * 创建星期
     * @returns
     */
    SignCalendar.prototype.createCalendarWeek = function () {
        var calendarWeekHtml = [];
        calendarWeekHtml.push('<div class="calendar-week">');
        var weeks = '日一二三四五六';

        for(var i = 0 ; i < 7 ; i++){
            //todo 周六周日添加颜色
            // if((i+1) % 7 == 1 || (i+1) % 7 == 0){
            //     calendarWeekHtml.push('<span class="weekend">'+weeks.charAt(i)+'</span>');
            // }else{
            //     calendarWeekHtml.push('<span>'+weeks.charAt(i)+'</span>');
            // }
            calendarWeekHtml.push('<span>'+weeks.charAt(i)+'</span>');
        }
        calendarWeekHtml.push('</div>');
        return calendarWeekHtml.join('');
    }

    /**
     * 创建日历列表
     * @param year
     * @param month
     * @param data
     * @returns {*}
     */
    SignCalendar.prototype.createCalendarList = function(year,month){
        var calendarList = [];

        var visibleDay = findVisibleDay(year,month); //当月显示的日期
        var signDay = findSignDay(visibleDay,year,month,this.option['times']);//当月签到的日期

        var prevVisibleDays = visibleDay['prevVisibleDays'],
            curDays = visibleDay['curDays'],
            nextVisibleDays = visibleDay['nextVisibleDays'];

        var prevSignDays = signDay['prevSignDays'],
            curSignDays = signDay['curSignDays'],
            nextSignDays = signDay['nextSignDays'];

        //循环日期 设置样式
        calendarList.push('<div class="calendar-list"><div>');
        for(var visibleDay in prevVisibleDays){
            var cellHtml = '';
            for(var signDay in prevSignDays){
                if(prevSignDays[signDay]==prevVisibleDays[visibleDay]){
                    cellHtml = '<span><a class="prev-m prev-to-month pasted signed" href="javascript:;">'+prevVisibleDays[visibleDay]+'</a></span>';
                }
            }
            if(!cellHtml){
                cellHtml = '<span><a class="prev-m prev-to-month pasted" href="javascript:;">'+prevVisibleDays[visibleDay]+'</a></span>';
            }
            calendarList.push(cellHtml);
        }
        for(var curDay in curDays){
            var cellHtml = '';
            for(var curSignDay in curSignDays){
                if(curSignDays[curSignDay]==curDays[curDay]){
                    cellHtml = '<span><a class="signed" href="javascript:;">'+curDays[curDay]+'</a></span>';
                }
            }
            if(!cellHtml){
                cellHtml = '<span><a href="javascript:;">'+curDays[curDay]+'</a></span>';
            }
            calendarList.push(cellHtml);
        }
        for(var nextVisibleDay in nextVisibleDays){
            var cellHtml = '';
            for(var nextSignDay in nextSignDays){
                if(nextVisibleDays[nextVisibleDay]==nextSignDays[nextSignDay]){
                    cellHtml = '<span><a class="next-m next-to-month signed" href="javascript:;">'+nextVisibleDays[nextVisibleDay]+'</a></span>';
                }
            }
            if(!cellHtml){
                cellHtml = '<span><a class="next-m next-to-month" href="javascript:;">'+nextVisibleDays[nextVisibleDay]+'</a></span>';
            }
            calendarList.push(cellHtml);
        }
        calendarList.push('</div></div>');
        return calendarList.join('');
    }
    /**
     * 初始化事件
     */
    SignCalendar.prototype.initEvent = function(){
        var $this = this;
        var monthTxt = $(this.$element).find('.calendar-month-txt');
        var year = monthTxt.data('year');
        var month = monthTxt.data('month');
        $(this.$element).find('.month-prev').click(function(){
            //计算前一个月的年份及月份
            var prevMonth = month;
            var prevYear = year;
            if (month == 1) {
                prevMonth = 12;
                prevYear = prevYear - 1;
            }
            else {
                prevMonth = prevMonth - 1;
            }
            $this.switchMonth(prevYear,prevMonth);
        });

        var monthNext = $(this.$element).find('.month-prev');
        if(!monthNext.hasClass('switch-btn-disabled')){
            $(this.$element).find('.month-next').click(function(){
                //计算后一个月的年份及月份
                var nextMonth = month;
                var nextYear = year;
                if (month == 12) {
                    nextMonth = 1;
                    nextYear = nextYear + 1;
                }
                else {
                    nextMonth = nextMonth + 1;
                }
                $this.switchMonth(nextYear,nextMonth);
            });
        }
    }
    /**
     * 移动月份
     * @param year
     * @param month
     */
    SignCalendar.prototype.switchMonth = function(year,month){
        this.option['year'] = year;
        this.option['month'] = month;

        var calendarHeaderHtml = this.createCalendarHeader(year,month);
        var calendarWeekHtml = this.createCalendarWeek();
        var calendarListHtml = this.createCalendarList(year,month);
        $(this.$element).html('<div class="calendar-content">'+calendarHeaderHtml+calendarWeekHtml+calendarListHtml+'</div>');
        this.initEvent();
    }
    /**
     * 查询设定的年月可显示的天
     * @param year
     * @param month
     * @returns {{}}
     */
    function findVisibleDay(year,month){
        var visibleDay = {};
        var prevVisibleDays = [];
        var curDays = [];
        var nextVisibleDays = [];

        var curDate  = new Date(year,month-1);
        var totalDays = getCountDays(year,month);
        for(var i=0; i<totalDays;i++){
            curDays.push(i+1);
        }

        var firstDay = new Date(year,month-1,1).getDay();
        if(firstDay!=0){
            var prevMonth = month;
            var prevYear = year;
            if (month == 1) {
                prevMonth = 12;
                prevYear = prevYear - 1;
            }else {
                prevMonth = prevMonth - 1;
            }
            var prevTotalDays = getCountDays(prevYear,prevMonth);
            for(var i=prevTotalDays-firstDay;i<prevTotalDays+1;i++){
                prevVisibleDays.push(i);
            }
        }

        for(var i=1;i<42-totalDays-prevVisibleDays.length+1;i++){
            nextVisibleDays.push(i);
        }

        visibleDay['prevVisibleDays'] = prevVisibleDays;
        visibleDay['curDays'] = curDays;
        visibleDay['nextVisibleDays'] = nextVisibleDays;
        return visibleDay;
    }

    /**
     * 查询设定的年月所有签到天
     * @param visibleDay
     * @param year
     * @param month
     * @param times
     * @returns {{}}
     */
    function findSignDay(visibleDay,year,month,times){
        var prevVisibleDays = visibleDay['prevVisibleDays'],curDays = visibleDay['curDays'],nextVisibleDays = visibleDay['nextVisibleDays'];
        var signDay = {},prevSignDays=[],curSignDays=[],nextSignDays=[],organizedSigns = organizeSignTime(times);
        var prevMonth = month,prevYear = year,nextMonth = month,nextYear = year;
        if (month == 1) {
            prevMonth = 12;
            prevYear = prevYear - 1;
        }else {
            prevMonth = prevMonth - 1;
        }

        if (month == 12) {
            nextMonth = 1;
            nextYear = prevYear + 1;
        }else {
            nextMonth = nextMonth + 1;
        }
        for(var organizedSignIndex in organizedSigns){
            var organizedSign = organizedSigns[organizedSignIndex];
            if(organizedSign['year']==prevYear&&organizedSign['month']==prevMonth){
                for(var prevVisibleDayIndex in prevVisibleDays){
                    if(organizedSign['day']==prevVisibleDays[prevVisibleDayIndex]){
                        prevSignDays.push(prevVisibleDays[prevVisibleDayIndex]);
                    }
                }
            }
            if(organizedSign['year']==year&&organizedSign['month']==month){
                for(var curDayIndex in curDays){
                    if(organizedSign['day']==curDays[curDayIndex]){
                        curSignDays.push(curDays[curDayIndex]);
                    }
                }
            }
            if(organizedSign['year']==nextYear&&organizedSign['month']==nextMonth){
                for(var nextVisibleDayIndex in nextVisibleDays){
                    if(organizedSign['day']==nextVisibleDays[nextVisibleDayIndex]){
                        nextSignDays.push(nextVisibleDays[nextVisibleDayIndex]);
                    }
                }
            }
        }
        signDay['prevSignDays'] = prevSignDays;
        signDay['curSignDays'] = curSignDays;
        signDay['nextSignDays'] = nextSignDays;
        return signDay;
    }

    /**
     * 格式化签到日期
     * @param times
     * @returns {Array}
     */
    function organizeSignTime(times){
        var organizedSigns = [];
        times = times || {};
        for(var timeIndex in times){
            var organizedSign = {},signDate = new Date();
            signDate.setTime(times[timeIndex]*1000);
            organizedSign['year'] = signDate.getFullYear();
            organizedSign['month'] = signDate.getMonth()+1;
            organizedSign['day']  = signDate.getDate();
            organizedSigns.push(organizedSign);
        }
        return organizedSigns;
    }

    /**
     * 获取一月总天数
     * @param year
     * @param month
     * @returns {number}
     */
    function getCountDays(year,month) {
        var curDate = new Date();
        curDate.setFullYear(year);
        curDate.setMonth(month);
        curDate.setDate(0);
        return curDate.getDate();
    }
})(jQuery,window,document);