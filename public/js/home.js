$(function(){
    if ($('#page').val() != 'home') {
        return;
    }

    // init
    h_initEvent4play();
    h_initEvent4search();
});

// Global
var pager = dt.util.pager();

// Functions
function h_initEvent4play(){
    $('.item-card, .sitem-row').click(function(e){
        console.log('id: ', $(this).attr('data'));
        console.log('DT: ', dt);
        dt.util.form.post('/play', {'id':$(this).attr('data')});

    });
}

function h_initEvent4search(){
    $('.section-title-more').click(function(e){
        console.log('data: ', $(this).find('a').attr('data'));
        dt.util.form.post('/search', {'sort': $(this).find('a').attr('data')});

    });
}

