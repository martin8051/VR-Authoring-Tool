var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('index', { title: 'VR Lab - Welcome'});
});

router.get('/team', function(req, res, next) {
	res.render('team', {title: 'VR Lab - Project Team'});
});

module.exports = router;
