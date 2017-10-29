var badRequestController = {};

badRequestController.index = function(req, res){
    res.render('badRequest');
};

module.exports = badRequestController;
