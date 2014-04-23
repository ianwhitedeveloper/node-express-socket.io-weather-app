
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Talk of the Weather Will Do' });
};
