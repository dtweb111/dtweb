var utils = {};

/**
 * Convert number to comma separeted views
 */
utils.number2kview = function(number) {
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
};

module.exports = utils;
