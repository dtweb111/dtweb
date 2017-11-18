var associateController = {};

associateController.dmca = function(req, res){
    res.render('dmca');
};

associateController.privacy = function(req, res){
    res.render('privacy');
};

associateController.terms = function(req, res){
    res.render('terms');
};

module.exports = associateController;
