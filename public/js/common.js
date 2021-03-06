/*
 * Global settings
 * */
var dt = dt || {};

// Config
dt.config = dt.config || {
    'API': $('#api').val() || '',
    'loading': {
        'id': '#loading_panel'
    },
    'screen': {
        'xs': 568
    }
};

// Promise queue
dt.promiseq = dt.promiseq || {
    'instance': null,
    'abort': function(){
        dt.promiseq.instance && dt.promiseq.instance.abort('q-abort');
        dt.util.loading.hide();
    }
};

// Util
dt.util = dt.util || {
    'device': {

    },
    'loading': {
        'show': function () {
            $(dt.config.loading.id).show();
        },
        'hide': function () {
            $(dt.config.loading.id).hide();
        }
    },
    'http': {
        'post': function (url, data, headerOptions) {
            dt.util.loading.show();
            return $.ajax({
                url: url,
                type: 'post',
                data: data,
                contentType: 'application/x-www-form-urlencoded; charset=UTF-8',
                dataType: 'json',
                headers: headerOptions || {}
            });
        }
    },
    'system': {
        'error': function (msg) {
            var msg = msg || 'You seems to meet up a system error. It is appreciated if you can send an email to us via: rhinostudio2017@gmail.com';
            alert(msg);
        }
    },
    'format': {
        'number2kview': function (number) {
            var strNumber = number + '', strLength = strNumber.length;
            if (strLength <= 3) {
                return number;
            }
            var strView = '', start = 3, end;
            strView = ',' + strNumber.slice(-start);
            while (start < strLength) {
                end = -start;
                start += 3;
                if (start > strLength) {
                    start = strLength;
                }
                strView = ',' + strNumber.slice(-start, end) + strView;
            }
            strView = strView.slice(1);
            return strView;
        }
    },
    'pager': function () {
        function Pager() {
            var currentPage = 1, totalPage = 1, totalItem = 0, itemCount = 10, itemStart = 0, showStep = 5;
            this.setPage = function (page) {
                currentPage = page;
            };
            this.getPage = function () {
                return currentPage;
            };
            this.setTotalPage = function (pageCount) {
                totalPage = pageCount;
            };
            this.getTotalPage = function () {
                return totalPage;
            };
            this.increasePage = function () {
                currentPage < totalPage && currentPage++;
            };
            this.decreasePage = function () {
                currentPage > 1 && currentPage--;
            };
            this.isFirstPage = function () {
                return currentPage == 1;
            };
            this.isLastPage = function () {
                return currentPage == totalPage;
            };
            this.setItemCount = function (count) {
                itemCount = count;
            };
            this.getItemCount = function () {
                return itemCount;
            };
            this.setTotalItem = function (itemNumber) {
                totalItem = parseInt(itemNumber);
                this.setTotalPage(Math.ceil(totalItem / itemCount));
            };
            this.getItemStart = function () {
                return (currentPage - 1) * itemCount;
            };
            this.setStep = function(step){
                if (step % 2 === 0) {
                    step++;
                }
                showStep = step;
            };
            this.getStep = function(){
                return showStep;
            };
            this.getStepBegin = function(){
                return currentPage - Math.floor(showStep / 2);
            };
            this.getStepEnd = function(){
                return currentPage + Math.floor(showStep / 2);
            };
        }

        return new Pager();
    },
    'form': {
        'post': function (url, data, target) {
            var form = document.createElement('form');
            form.target = typeof target !== 'undefined' ? target : '_blank';
            form.method = 'POST';
            form.action = url;
            form.style.display = 'none';

            for (var key in data) {
                var input = document.createElement('input');
                input.type = 'text';
                input.name = key;
                input.value = data[key];
                form.appendChild(input);
            }

            document.body.appendChild(form);
            form.submit();
            document.body.removeChild(form);
        }
    }
};

/**
 * Common initialization
 */
// Attach event for button#btn_search
$(function(){
    $('#form_submit').submit(function(e){
        e.preventDefault();
        var page = $('#page').val();
        if (page == 'search') {
            $('#keyword').val($('#txt_search').val());
            $('#sort').val('date');
            typeof pager == 'object' && pager.setPage(1);
            typeof search_searchResources == 'function' && search_searchResources();
            if (typeof s_reset_filter == 'function' && typeof s_retrieveData == 'function') {
                s_reset_filter();
                s_retrieveData();
            }
        } else {
            var data = {}, url = '/search';
            data.keyword = $('#txt_search').val().trim();
            data.sort = 'date';
            dt.util.form.post(url, data);
        }
    });
});