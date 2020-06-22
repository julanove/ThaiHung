﻿var moment = require('moment');

var register = function (Handlebars) {

    var helpers = {

        homeNews: function (content) {

            var highlight = '';
            var smallnews = '<div class="other-news">';
            var i = 0;

            for (const key of content) {
                if (i == 0) {
                    highlight += '<div class="highlight-news">';
                    highlight += '<img class="w-100" src="/static/' + key.image + '">';
                    highlight += '<div class="des">';
                    highlight += '<h4>' + key.title + '</h4>';
                    highlight += '<div class="news-date">' + formatDate(key.datetime) + '</div>';
                    highlight += '<div class="readmore">続きを読む<svg width="20" height="20"><path d="M2,10 L17,10 L10,5 M17,10 L10,15" stroke-width="1" fill="none" stroke="var(--blue)"></svg></div>';
                    highlight += '</div></div>';
                }
                else {
                    smallnews += '<div class="small-news">';
                    smallnews += '<img class="w-100" src="/static/'+ key.image + '">';
                    smallnews += '<div class="des">';
                    smallnews += '<h5>' + key.title + '</h5>';
                    smallnews += '<span class="news-date">' + formatDate(key.datetime) + '</span>';
                    smallnews += '<div class="readmore">続きを読む<svg width="20" height="20"><path d="M2,10 L17,10 L10,5 M17,10 L10,15" stroke-width="1" fill="none" stroke="var(--blue)"></svg></div>';
                    smallnews += '</div></div>';
                }
                i++;
            }

            smallnews += '</div>';
            var result = highlight + smallnews;
            //console.log(result);
            //return result;
            return new Handlebars.SafeString(result);
        },

        newsShow: function (content) {

            var highlight = '';
            var smallnews = '';
            var y = 0;

            for (const key of content) {
                if (y == 0) {
                    highlight += '<div class="highlight-news">';
                    highlight += '<div class="new-image"><a href="/news-details/'+key.newid+'"><img class="w-100" src="/static/'+ key.image +'"></a></div>';
                    highlight += '<div class="news-des">';
                    highlight += '<h3>'+key.title+'</h3>';
                    highlight += '<span class="date">' + formatDate(key.datetime) +'</span>';
                    highlight += '<hr>';
                    highlight += '<div class="">' + key.content+'</div>';
                    highlight += '<div class="readmore">続きを読む<svg width="20" height="20"><path d="M2,10 L17,10 L10,5 M17,10 L10,15" ';
                    highlight += 'stroke-width="1" fill="none" stroke="var(--white)"></svg></div>';
                    highlight += '</div></div>';
                }
                else {
                smallnews += '<div class="new-item">' + 
                    '<div class="new-image"><a href="/news-details/' + key.newid +'"><img class="w-100" src="/static/'+key.image+'"></a></div>' + 
                     '<div class="news-des">' + 
                    '<h4>' + key.title +'</h4>' + 
                    '<span class="date">' + formatDate(key.datetime) +'</span>' + 
                    '<div class="">' + key.content.substring(30) + '...</div>' + 
                         '<div class="readmore">続きを読む<svg width="20" height="20"><path d="M2,10 L17,10 L10,5 M17,10 L10,15" stroke-width="1" fill="none" stroke="var(--white)"></svg></div>' + 
                          '</div>' + 
                        '</div>';
                }
                y++;
            }

            var result = highlight + smallnews;
            return new Handlebars.SafeString(result);

        },

        paging: function (current, count, offset, type, category) {

            var result = '';
            var from = 0;
            var to = 0;

            console.log('' + category);
            var cate = category == 0 ? '' : (category + '/');

            var maxPage = count / offset;

            //if (current == 1)
            result += '<div class="paginator-container">' +
                '<div class="paginator" >' +
                '<a class="skip" href="/' + type + cate +'/1"> &lt;&lt; </a>' +
                '<a class="skip" href="/' + type + '/' + cate + (current - 1) +'"> &lt; </a>' +
                '<a class="active" href="/' + type + '/' + cate + current+'">' + current+'</a>' +
                    //'<a href="/news/2">2</a>' +
                    //'<a href="/news/3">3</a>' +
                    //'<a href="#">4</a>' +
                    //'<a href="#">5</a>' +
                '<a href="/'+type+ '/' + cate + maxPage +'">' + maxPage+'</a>' +
                '<a class="skip" href="/' + type + '/' + cate + (parseInt(current) + 1) + '"> &gt; </a>' +
                '<a class="skip" href="/' + type + '/' + cate + maxPage +'"> &gt;&gt; </a>' +
                    '</div >' +
                '</div >';

            return new Handlebars.SafeString(result);

        },

        formatDate: function (datetime) {
            if (moment) {
                return moment(datetime).format("dddd DD.MM.YYYY HH:mm");
            }
            else {
                return datetime;
            }
        },

        productTypeShow: function (category, categoryType) {

            var result = '';

            for (const key of category) {
                result +=  
                    '<li class="nav-item d-inline-block border-0  ' + (categoryType == key.productTypeID ? "active" : "") + ' "> ' +
                '<a class="nav-link" href="/product/' + key.productTypeID + '/1"  aria-selected="' + (categoryType == key.productTypeID ? "false" : "true") + '">' + key.name + '</a>' +
                //'<a class="nav-link" data-toggle="tab" href="/product/' + key.productTypeID + '/1" role="tab" aria-selected="' + (categoryType == key.productTypeID ? "false" : "true") + '">' + key.name + '</a>' +
                    '</li >';
            }

            return new Handlebars.SafeString(result);
        },

        productShow: function (content) {

            var result = '';

            for (const key of content) {
                result += '<div class="product-item"> '+
                          '<a href="/product-details/'+ key.productID +'"><img src="/static/'+key.image+'" ></a>'+
                          '<div class="product-name">'+key.name+'</div>'+
                          '<div class="product-excerpt">'+  key.description + '</div>'+
                          '</div >'
            }

            return new Handlebars.SafeString(result);
        },
        
    };

    if (Handlebars && typeof Handlebars.registerHelper === "function") {
        for (var prop in helpers) {
            Handlebars.registerHelper(prop, helpers[prop]);
        }
    } else {
        return helpers;
    }
    
}

module.exports.register = register;


    function formatDate(datetime) {
    if (moment) {
        return moment(datetime).format("dddd DD.MM.YYYY HH:mm");
    }
    else {
        return datetime;
    }
}






      
        
            
              
               
               
              
           
         
    