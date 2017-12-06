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
    s_attachEvent4PaginationMb();
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
    // Init special filter search text `#txt_search`
    $('#txt_search').val($('#keyword').val());

    s_attachEvent4Filter();
}

function s_reset_filter(){
    $('.s-f-item a').each(function(e){
        if ($(this).attr('data') == 'All') {
            $(this).addClass('selected');
        }else{
            $(this).removeClass('selected');
        }
    });
    if ($('#sort').length > 0) {
        var sort = $('#sort').val().trim();
        $('.s-f-sort .s-f-item a').each(function(e){
            if ($(this).attr('data') == sort) {
                $(this).addClass('selected');
            }else{
                $(this).removeClass('selected');
            }
        }); 
    }
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
        if (data.rowCount.total > 0) {
            for(var i=0; i < data.rows.length; i++){
                var row = data.rows[i];
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
                mainHtml.push('</div><div class="s-m-row-definition">');
                mainHtml.push('<span>', row.definition, '</span>');
                mainHtml.push('</div></div><div class="s-m-row-rated">');
                mainHtml.push('<i class="fa fa-star">&ensp;', row.rate, '</i>');
                mainHtml.push('</div><div class="s-m-row-views">');
                mainHtml.push('<i class="fa fa-eye">&ensp;', dt.util.format.number2kview(row.views), '</i>');
                mainHtml.push('</div></div></div>');
            }
        } else {
            mainHtml.push('<div class="info-area" style="height:300px"><div class="info-text"><span>', 'No video returned based on your search condition.', '</span></div></div>');
        }
        
        $('.s-main').html(mainHtml.join(''));
        s_attachEvent4Play();

        // construct paginaton content
        pager.setTotalItem(data.rowCount.total);
        $('.page-mb-current a').html(pager.getPage());
        $('#page_total').html(pager.getTotalPage());
        if(pager.isFirstPage()){
            !$('.page-mb-previous').hasClass('disabled') && $('.page-mb-previous').addClass('disabled');
        }else{
            $('.page-mb-previous').hasClass('disabled') && $('.page-mb-previous').removeClass('disabled');
        }
        if(pager.isLastPage()){
            !$('.page-mb-next').hasClass('disabled') && $('.page-mb-next').addClass('disabled');
        }else{
            $('.page-mb-next').hasClass('disabled') && $('.page-mb-next').removeClass('disabled');
        }

        s_constructPagination4Pc();

        dt.util.loading.hide();
    }).fail(function(status, xhr, error){
        if (error === 'q-abort') {
            return;
        }
        // show error alarm

        dt.util.loading.hide();
    });
}

function s_constructPagination4Pc(){
    var paginationPcHtml = [];
    paginationPcHtml.push('<li class="page-item page-pc-previous"><a class="page-link" href="javascript:void(0);">Previous</a></li>');
    paginationPcHtml.push('<li class="page-item page-pc-num" data="', 1, '"><a class="page-link" href="javascript:void(0);">1</a></li>');
    var pageStepBegin = pager.getStepBegin(), pageStepEnd = pager.getStepEnd(), currentPage = pager.getPage(), totalPage = pager.getTotalPage(), pageStepLength = pager.getStep();  
    if(pageStepBegin < 2){
        pageStepBegin = 1;
    }
    pageStepEnd = pageStepBegin + pageStepLength - 1;
    if(pageStepEnd > totalPage){
        pageStepEnd = totalPage;
    }
    if(totalPage > pageStepLength && pageStepEnd - pageStepBegin < pageStepLength - 1){
        pageStepBegin = pageStepEnd - pageStepLength + 1;
    }
    if(pageStepBegin > 2){
        var dotPrevious = currentPage - pageStepLength;
        if (dotPrevious <= 1) {
            dotPrevious = 2;
        }
        paginationPcHtml.push('<li class="page-item page-pc-num" data="', dotPrevious, '"><a class="page-link" href="javascript:void(0);">...</a></li>');
    }
    if(pageStepBegin !== 1){
        paginationPcHtml.push('<li class="page-item page-pc-num" data="', pageStepBegin, '"><a class="page-link" href="javascript:void(0);">', pageStepBegin, '</a></li>');    
    }
    for(var s = pageStepBegin + 1; s <= pageStepEnd; s++){
        paginationPcHtml.push('<li class="page-item page-pc-num" data="', s, '"><a class="page-link" href="javascript:void(0);">', s, '</a></li>');    
    }
    console.log('Currentpage: ', currentPage, 'pageStepBegin: ', pageStepBegin, 'pageStepEnd: ', pageStepEnd, 'totalPage: ', totalPage);
    if(pageStepEnd < totalPage - 1){
        var dotNext = +currentPage + +pageStepLength;
        if (dotNext >= totalPage) {
            dotNext = totalPage - 1;
        }
        paginationPcHtml.push('<li class="page-item page-pc-num" data="', dotNext, '"><a class="page-link" href="javascript:void(0);">...</a></li>');
    }
    if(pageStepEnd !== totalPage){
        paginationPcHtml.push('<li class="page-item page-pc-num" data="', totalPage, '"><a class="page-link" href="javascript:void(0);">', totalPage, '</a></li>');    
    }
    paginationPcHtml.push('<li class="page-item page-pc-next"><a class="page-link" href="javascript:void(0);">Next</a></li>');
    $('.pagination-pc').html(paginationPcHtml.join(''));

    $('.page-item.page-pc-num').each(function(e){
        $(this).attr('data') == currentPage && $(this).addClass('active');
    });
    if(pager.isFirstPage()){
        !$('.page-pc-previous').hasClass('disabled') && $('.page-pc-previous').addClass('disabled');
    }else{
        $('.page-pc-previous').hasClass('disabled') && $('.page-pc-previous').removeClass('disabled');
    }
    if(pager.isLastPage()){
        !$('.page-pc-next').hasClass('disabled') && $('.page-pc-next').addClass('disabled');
    }else{
        $('.page-pc-next').hasClass('disabled') && $('.page-pc-next').removeClass('disabled');
    }
    s_attachEvent4PaginationPc();
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

function s_attachEvent4PaginationMb(){
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
    $('#page_go').click(function(e){
        var pageNumber = $('#page_number').val();
        if(!$.isNumeric(pageNumber) || pageNumber < 1 || pageNumber > pager.getTotalPage()){
            dt.util.system.error('Please input the page number betwwen 1 and ' + pager.getTotalPage());
            return;
        }
        pager.setPage(pageNumber);
        $('#page_number').val('');
        s_retrieveData();
    });
}

function s_attachEvent4PaginationPc(){
    $('.page-pc-previous').click(function(e){
        if(pager.isFirstPage()){
            return;
        }
        pager.decreasePage();
        s_retrieveData();
    });
    $('.page-pc-next').click(function(e){
        if(pager.isLastPage()){
            return;
        }
        pager.increasePage();
        s_retrieveData();
    });
    $('.page-item.page-pc-num').click(function(e){
        pager.setPage($(this).attr('data'));
        s_retrieveData();
    });
}
