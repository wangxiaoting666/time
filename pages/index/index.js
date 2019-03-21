var imgUrls = [
  { image: "../../img/love.jpg" },
  { image: "../../img/banner1.jpg" },
  { image: "../../img/banner2.jpg" }
];
var ctx=null;
var factor={
              speed:.008,  // 运动速度，值越小越慢
              t:0    //  贝塞尔函数系数
            };
var timer = null;  // 循环定时器

var app = getApp()
Page( {  
  data: {  
    imgUrls: imgUrls,
    autoplay: true,           //是否自动切换  
    indicatorDots: true,      //是否显示圆点  
    interval: 5000,           //自动切换间隔  
    duration: 500,            //滑动动画时长  
    indicatorColor: "#f4f4f4", //滑动圆点颜色  
    indicatorActiveColor: "#f4645f", //当前圆点颜色  
    current: 1,             //当前所在页面的 index  
    circular: true,          //是否采用衔接滑动  
    //其中只可放置<swiper-item/>组件，否则会导致未定义的行为。
    week_day: '',
    last_week: '',
    week_speed: '',
    newDay: '',
    totalYear: '',
    Year_spend: '',
    last_Year: '',
    months: '',
    day: '',
    last_month: '',
    month_spend: '',
    nonth_total: '',
    style_img: ''
      
  }, 
  imageLoad: function () {
    //bindload 图片加载的时候自动设定宽度  
    this.setData({
      imageWidth: wx.getSystemInfoSync().windowWidth,
      imageHeight: wx.getSystemInfoSync().windowHeight
    })
  }, 
  
 


  onLoad: function() {  
    //数据
    var dateArr = new Array(31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31);  
    var date = new Date();  
    var day = date.getDate();  
    var month = date.getMonth(); //getMonth()是从0开始  
    var year = date.getFullYear();  

    var newDay = 0;  
    for ( var i = 0; i < month; i++) {  
        newDay += dateArr[i];  
    }  
    newDay += day;

    var totalYear = 0;  
    for ( var i = 0; i < 12; i++) {  
        totalYear += dateArr[i];  
    }
    //判断是否闰年  
    if (month > 1 && (year % 4 == 0 && year % 100 != 0) || year % 400 == 0) {  
        newDay += 1;  
        totalYear += 1;  
    }  
    var ss = totalYear - newDay;

    var week_day = date.getDay(); //今天是这周的第几天
    var last_week = 7 - week_day; // 周日距离今天的天数（负数表示）

    var week_speed = Math.round((week_day/7)*100)  ;  
    switch(week_day)
    {
      case 1:
        week_day = '一'
        break;
      case 2:
        week_day = '二'
        break;
      case 3:
        week_day = '三'
        break;
      case 4:
        week_day = '四'
        break;
      case 5:
        week_day = '五'
        break;
      case 6:
        week_day = '六'
        break;
      default:
        week_day = '日'
    }    
    // week_day    今天是这周的第几天
    // last_week   周日距离今天的天数（负数表示）
    // week_speed  周百分比
    // newDay     今年已过去的天数
    // totalYear  今年总天数
    // Year_spend 年百分比
    var Year_spend = Math.round((newDay/totalYear)*100);
    // months   月
    // day  日
    // last_month 剩下的天数
    // month_spend 月百分比
    var last_month = dateArr[month] - day;
    var month_spend = Math.round((day/dateArr[month])*100);


    var h = date.getHours();
    var h_spend = Math.round((h/24)*100);
    this.setData({
      week_day: week_day,
      last_week: last_week,
      week_speed: week_speed,
      months: month+1,
      day: day,
      last_month: last_month,
      month_spend: month_spend,
      nonth_total: dateArr[month],
      newDay: newDay,
      totalYear: totalYear,
      Year_spend: Year_spend,
      last_Year: totalYear - newDay,

      h:h,
      last_h: 24-h,
      h_spend: h_spend,    
    });

    ctx = wx.createCanvasContext('canvas_wi')
    this.startTimer();
  },  
  startTimer:function(){
    var that = this
       that.setData({
          style_img:'transform:scale(1.3);'
      })
      setTimeout(function(){
            that.setData({
              style_img:'transform:scale(1);'
            })
      },500)
        that.drawImage([[{x:30,y:400},{x:70,y:300},{x:-50,y:150},{x:30,y:0}],[{x:30,y:400},{x:30,y:300},{x:80,y:150},{x:30,y:0}],[{x:30,y:400},{x:0,y:90},{x:80,y:100},{x:30,y:0}]])
              
  },
  drawImage:function(data){
    var that = this
    var p10= data[0][0];   // 三阶贝塞尔曲线起点坐标值
    var p11= data[0][1];   // 三阶贝塞尔曲线第一个控制点坐标值
    var p12= data[0][2];   // 三阶贝塞尔曲线第二个控制点坐标值
    var p13= data[0][3];   // 三阶贝塞尔曲线终点坐标值

    var p20= data[1][0];
    var p21= data[1][1];
    var p22= data[1][2];
    var p23= data[1][3];

    var p30= data[2][0];
    var p31= data[2][1];
    var p32= data[2][2];
    var p33= data[2][3];
    
    var t = factor.t;

    /*计算多项式系数 （下同）*/    
    var cx1 = 3*(p11.x-p10.x);
    var bx1 = 3*(p12.x-p11.x)-cx1;
    var ax1 = p13.x-p10.x-cx1-bx1;

    var cy1 = 3*(p11.y-p10.y);
    var by1 = 3*(p12.y-p11.y)-cy1;
    var ay1 = p13.y-p10.y-cy1-by1;

    var xt1 = ax1*(t*t*t)+bx1*(t*t)+cx1*t+p10.x;
    var yt1 = ay1*(t*t*t)+by1*(t*t)+cy1*t+p10.y;

    /** ---------------------------------------- */
    var cx2 = 3*(p21.x-p20.x);
    var bx2 = 3*(p22.x-p21.x)-cx2;
    var ax2 = p23.x-p20.x-cx2-bx2;

    var cy2 = 3*(p21.y-p20.y);
    var by2 = 3*(p22.y-p21.y)-cy2;
    var ay2 = p23.y-p20.y-cy2-by2;

    var xt2 = ax2*(t*t*t)+bx2*(t*t)+cx2*t+p20.x;
    var yt2 = ay2*(t*t*t)+by2*(t*t)+cy2*t+p20.y;


  /** ---------------------------------------- */
     var cx3 = 3*(p31.x-p30.x);
    var bx3 = 3*(p32.x-p31.x)-cx3;
    var ax3 = p33.x-p30.x-cx3-bx3;

    var cy3 = 3*(p31.y-p30.y);
    var by3 = 3*(p32.y-p31.y)-cy3;
    var ay3 = p33.y-p30.y-cy3-by3;

    /*计算xt yt的值 */
    var xt3 = ax3*(t*t*t)+bx3*(t*t)+cx3*t+p30.x;
    var yt3 = ay3*(t*t*t)+by3*(t*t)+cy3*t+p30.y;
    factor.t +=factor.speed;
    ctx.drawImage("../../img/heart1.png",xt1,yt1,30,30);
    ctx.drawImage("../../img/heart2.png",xt2,yt2,30,30);
    ctx.drawImage("../../img/heart3.png",xt3,yt3,30,30);
    ctx.draw();
    if(factor.t>1){
        factor.t=0;
        cancelAnimationFrame(timer);
        that.startTimer();
    }else{
        timer = requestAnimationFrame(function(){
            that.drawImage([[{x:30,y:400},{x:70,y:300},{x:-50,y:150},{x:30,y:0}],[{x:30,y:400},{x:30,y:300},{x:80,y:150},{x:30,y:0}],[{x:30,y:400},{x:0,y:90},{x:80,y:100},{x:30,y:0}]])
      })
    }
  },
  onClickImage:function(e){
    var that = this
      that.setData({
          style_img:'transform:scale(1.3);'
      })
      setTimeout(function(){
            that.setData({
              style_img:'transform:scale(1);'
            })
      },500)
  },
  // 页面渲染完成后 调用  
  onReady: function () { 
    var interval = setInterval(function () { 
    var totalSecond = '2018/02/21'; 
      var date1=new Date(totalSecond);
      console.log(date1)
      var totalSecs=(new Date()-date1)/1000;
      // 天
      var dayStr=Math.floor(totalSecs/3600/24);
      // 时
      var hrStr=Math.floor((totalSecs-dayStr*24*3600)/3600);
      var hrStr = hrStr.toString();  
      if (hrStr.length == 1) hrStr = '0' + hrStr; 
      // 分
      var minStr=Math.floor((totalSecs-dayStr*24*3600-hrStr*3600)/60);
      var minStr = minStr.toString();  
      if (minStr.length == 1) minStr = '0' + minStr; 
      // 秒
      var secStr=Math.floor((totalSecs-dayStr*24*3600-hrStr*3600-minStr*60));      
      var secStr = secStr.toString();  
      if (secStr.length == 1) secStr = '0' + secStr;  
      this.setData({  
        countDownDay: dayStr,  
        countDownHour: hrStr,  
        countDownMinute: minStr,  
        countDownSecond: secStr,  
      });  
      totalSecond++;
    }.bind(this), 1000);  
  }, 
  onUnload:function(){
    if(timer!=null){
        cancelAnimationFrame(timer);
    }    
  },
}) 