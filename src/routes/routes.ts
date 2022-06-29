

function getRoot(req:any, res:any) {
    res.render('main')
}

function getLogin(req:any, res:any) {
    if (req.isAuthenticated()) {
        res.redirect('profile')
    } else {
        res.render('login');
    }
}

function getSignup(req:any, res:any) {
    res.render('signup');
}

function postLogin (req:any, res:any) {
    if (req.isAuthenticated()) {
        res.redirect('profile')
    } else {
        res.redirect('login')
    }
}

function postSignup (req:any, res:any) {
    if (req.isAuthenticated()) {
        res.redirect('profile')
    } else {
        res.redirect('login')
    }
}

function getProfile (req:any, res:any) {
    if (req.isAuthenticated()) {
        let user = req.user;
        res.render('profileUser', { user: user, isUser:true })
    } else {
        res.redirect('login')
    }
}

function getFaillogin (req:any, res:any) {
    console.log('error en login');
    res.render('login-error', {});
}

function getFailsignup (req:any, res:any) {
    console.log('error en signup');
    res.render('signup-error', {});
}

function getLogout (req:any, res:any) {
    req.logout( (err:any) => {
        if (!err) {
            res.render('main');
        } 
    });
}

function failRoute(req:any, res:any){
    res.status(404).render('routing-error', {});
}

function checkAuthentication(req:any, res:any, next:any) {
    if (req.isAuthenticated()) {
        //req.isAuthenticated() will return true if user is logged in
        next();
    } else {
        res.redirect("/login");
    }
}


export default {   getRoot,
    getLogin,
    postLogin,
    getFaillogin,
    getLogout,
    failRoute,
    getSignup,
    postSignup,
    getFailsignup,
    checkAuthentication,
    getProfile}