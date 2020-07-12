/*
Sublime編譯: https://ithelp.ithome.com.tw/articles/10184828
爬蟲相關:
https://tutorials.webduino.io/zh-tw/docs/socket/useful/exchange-nodejs.html
https://larrylu.blog/nodejs-request-cheerio-weather-414e33f45c7d
*/

var request = require("request");
var cheerio = require("cheerio");
var iconv = require('iconv-lite');
var headers = { 
  'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_10_1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/39.0.2171.65 Safari/537.36'
};

var stock = function(stockid) {
  return new Promise(function(resolve, reject) {
    console.log("stockid: "+stockid);
  	request({
  		//鉅亨網
  		url: "https://invest.cnyes.com/twstock/tws/"+stockid,
  		method: "GET"
    	}, function(error, response, body) {
      	if (error || !body) {
        		reject(error);
      	}else{
          //console.log(body);
        	//顯示當日收盤價
        	var $ = cheerio.load(body);
        	//選擇想爬的元素,檢查,右鍵Copy, Copy Selector
    			var target = $("#_profile-TWS\\:"+stockid+"\\:STOCK > div.jsx-2160330290.header-wrapper > div.jsx-2160330290.header-info > div.jsx-2160330290.info-price > div > span");
    			//console.log(target.text());
          resolve(target.text);
      	}
    	});
    });
};
function getStockPrice(stockid, callback) {
  stock(stockid).then(function(result) {
    callback(result);
  }).catch(function(e) {
    //handle error here
  });
}
var requestAllStockInfo = function(callback){
  request({
    //鉅亨網
    url: "https://www.tej.com.tw/webtej/doc/uid.htm",
    encoding: null,
    headers: headers,
    method: "GET"
    }, function(error, response, body) {
      if (error || !body) {
          return;
      }else{
          //console.log(body);
          //顯示當日收盤價
          var html = iconv.decode(body, 'big5')
          var $ = cheerio.load(html, { decodeEntities: false });
          //選擇想爬的元素,檢查,右鍵Copy, Copy Selector
          var tds_ = $("td");
          // declare a 2d array
          var sInfo = new Array(tds_.length);

          for (var i = 0; i < sInfo.length; i++) {
            sInfo[i] = new Array(2);
          }
          var amount = 0
          for (var i = 0 ; i < tds_.length ; i ++){
            wid = parseInt($(tds_[i]).attr('width'));
            text = $(tds_[i]).text().trim().replace('\n','');
            if (wid != null && wid > 160 && wid < 170 && text.length > 0){
              nt = text.replace(/\s+/g,'')
              sInfo[amount] = [parseInt(nt.substring(0, 4)),nt.substring(4,nt.length)];
              amount += 1;
            }
          }
          sInfo = sInfo.slice(0,amount)
          console.log("re: "+sInfo.length);
          callback(null, sInfo);
      }
    });
};
var getAllStockInfo = function(){
  requestAllStockInfo(function(err, results){
    console.log("get: "+results.length);
    return results;
    });
};
getStockPrice(1101);
module.exports = {
    stock: stock,
    requestAllStockInfo: requestAllStockInfo,
    getAllStockInfo: getAllStockInfo
}