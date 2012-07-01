/*
 * GET home page.
 */

exports.index = function (req, res) {

    var params = {
        title : 'This is awesome',
        names : [
            'axel'
            , 'juan'
            , 'pepe'
        ]
    };

    res.render('index', params);
};