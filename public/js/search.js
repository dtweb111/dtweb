$(function(){
    if ($('#page').val() != 'search') {
        return;
    }

    // init
    s_init();
});

// Global
var pager = dt.util.pager();

// Functions
function s_init(){
    s_init_filter();
    s_retrieveData();
    s_attachEvent4Pagination();
}

function s_init_filter(){
    $('.s-f-item a').each(function(e){
        $(this).attr('data') == 'All' && $(this).addClass('selected');
    });
    if ($('#sort').length > 0) {
        var sort = $('#sort').val().trim();
        $('.s-f-sort .s-f-item a').each(function(e){
            $(this).hasClass('selected') && $(this).removeClass('selected');;
            $(this).attr('data') == sort && $(this).addClass('selected');
        }); 
    }

    s_attachEvent4Filter();
}

function s_retrieveData(){
    var url = '/search/api/retrieve', data = {
        'category': $('.s-f-category .s-f-item a.selected').attr('data'),
        'year': $('.s-f-year .s-f-item a.selected').attr('data'),
        'sort': $('.s-f-sort .s-f-item a.selected').attr('data'),
        'offset': pager.getItemStart(),
        'limit': pager.getItemCount()
    };
    $('#keyword').length > 0 && (data.keyword = $('#keyword').val());

    console.log('Data: ', data);

    dt.promiseq.abort();
    dt.promiseq = dt.util.http.post(url, data);
    dt.promiseq.done(function(data, status, xhr){
        console.log('Data: ', data);
        // construct page content
        var mainHtml = [];
        for(var row of data.rows){
            console.log(row);
            mainHtml.push('<div class="s-m-row" data="', row.video_id, '"><div class="s-m-row-img">');
            mainHtml.push('<img src="', row.image_url, '">');
            mainHtml.push('</div>');
            mainHtml.push('<div class="s-m-row-text"><div class="s-m-row-basic"><div class="s-m-row-name">');
            mainHtml.push('<span>', row.video_name, '</span>');
            mainHtml.push('</div><div class="s-m-row-category">');
            mainHtml.push('<span>', row.categories, '</span>');
            mainHtml.push('</div><div class="s-m-row-released">');
            mainHtml.push('<span>', row.release_date, '</span>');
            mainHtml.push('</div></div><div class="s-m-row-rated">');
            mainHtml.push('<i class="fa fa-star">&ensp;', row.rate, '</i>');
            mainHtml.push('</div><div class="s-m-row-views">');
            mainHtml.push('<i class="fa fa-eye">&ensp;', dt.util.format.number2kview(row.views), '</i>');
            mainHtml.push('</div></div></div>');
        }
        $('.s-main').html(mainHtml.join(''));
        s_attachEvent4Play();

        // construct paginaton content
        pager.setTotalItem(data.rowCount.total);
        $('.page-mb-current a').html(pager.getPage());
        $('.page-total').html(pager.getTotalPage());
        if(pager.isFirstPage()){
            //$('.page-mb-previous').hasClass('active') && $('.page-mb-previous').removeClass('active');
            !$('.page-mb-previous').hasClass('disabled') && $('.page-mb-previous').addClass('disabled');
        }else{
            $('.page-mb-previous').hasClass('disabled') && $('.page-mb-previous').removeClass('disabled');
            //!$('.page-mb-previous').hasClass('active') && $('.page-mb-previous').addClass('active');
        }
        if(pager.isLastPage()){
            //$('.page-mb-next').hasClass('active') && $('.page-mb-next').removeClass('active');
            !$('.page-mb-next').hasClass('disabled') && $('.page-mb-next').addClass('disabled');
        }else{
            $('.page-mb-next').hasClass('disabled') && $('.page-mb-next').removeClass('disabled');
            //!$('.page-mb-next').hasClass('active') && $('.page-mb-next').addClass('active');
        }

        dt.util.loading.hide();
    }).fail(function(status, xhr, error){
        if (error === 'q-abort') {
            return;
        }
        // show error alarm

        dt.util.loading.hide();
    });
}

// Events
function s_attachEvent4Filter(){
    var resetSelected = function(className, selectedValue){
        $(className).find('.s-f-item a').each(function(e){
            $(this).removeClass('selected');
            $(this).attr('data') === selectedValue  && $(this).addClass('selected');
        });
    };

    $('.s-f-category .s-f-item a').click(function(e){
        resetSelected('.s-f-category', $(this).attr('data'));
        s_retrieveData();
    });

    $('.s-f-year .s-f-item a').click(function(e){
        resetSelected('.s-f-year', $(this).attr('data'));
        s_retrieveData();
    });
    
    $('.s-f-sort .s-f-item a').click(function(e){
        resetSelected('.s-f-sort', $(this).attr('data'));
        s_retrieveData();
    });
}

function s_attachEvent4Play(){
    $('.s-m-row').click(function(e){
        console.log('id: ', $(this).attr('data'));
        dt.util.form.post('/play', {'id':$(this).attr('data')});

    });
}

function s_attachEvent4Pagination(){
    $('.page-mb-previous').click(function(e){
        if(pager.isFirstPage()){
            return;
        }
        pager.decreasePage();
        s_retrieveData();
    });
    $('.page-mb-next').click(function(e){
        if(pager.isLastPage()){
            return;
        }
        pager.increasePage();
        s_retrieveData();
    });
    $('.page-mb-go').click(function(e){
        var pageNumber = $('.page-mb-number').val();
        if(!$.isNumeric(pageNumber) || pageNumber < 1 || pageNumber > pager.getTotalPage()){
            dt.util.system.error('Please input the page number betwwen 1 and ' + pager.getTotalPage());
            return;
        }
        pager.setPage(pageNumber);
        $('.page-mb-number').val('');
        s_retrieveData();
    });
}

