'use strict';

module.exports = function() {

    // We need to have this exact function signature, so disable the jshint
    // warning about `next` being unused
    /*jshint unused:false*/
    return function handleErrors(err, req, res, next) {
        err.status = err.status || 500;
        
        if (err.status > 499) {
            console.error('Server Error:', err.stack);
            if (process.env.NODE_ENV === 'production') {
                err.message = 'There was a problem processing your request on the server. Please contact StrongLoop for assistance!';
            }
        }
        
        if (err.status === 401) {
            res.set(
                'WWW-Authenticate',
                'Basic realm=' + err.message
            );
            return res.status(err.status).end();
        }
        
        res
            .status(err.status)
            .render('error', {
                error: err
            });
    };
    /*jshint unused:true*/

};
