/**
 * Generic Page require login routing middleware
 */
exports.requiresLogin = function(req, res, next) {
    
    if (!req.isAuthenticated()) {
        //return res.send(401, 'User is not authorized');
        console.log('not authenticated requires login');
        return res.status(401).redirect('/signin');
    }
    next();
};


/**
 * [requiresAnonymous description]
 * @param  {object} req Request object
 * @param  {object} res Response object
 * @return {[type]}     Redirect a user to back referred page or call the next
 *                      middleware
 */
exports.requiresAnonymous = function(req, res, next) {
    // If user is authenticated, redirect back to referering URL
    if (req.isAuthenticated()) {
        var httpReferrer = req.get('Referrer');
        if (httpReferrer && httpReferrer.length > 0)
            return res.status(200).redirect('/');
        else
            res.redirect('/');
    }
    next();
};


/**
 * User Page authorizations routing middleware
 */
exports.user = {
    hasAuthorization: function(req, res, next) {
        if (req.profile.id != req.user.id) {
           return res.status(401).redirect('/');
        }
        next();
    }
};