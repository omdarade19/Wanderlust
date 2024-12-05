const User = require("../models/user.js");


module.exports.signupFormRender =  (req, res)=>{
    res.render("users/signup.ejs");
};

module.exports.signup = async(req, res)=>{
    try{
        let {username, email, password} =req.body;
    const newUser = new User({email, username});
    console.log(newUser);
    const registereduser = await User.register(newUser, password);
    console.log(registereduser);
    req.logIn(registereduser, (err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","Welcome to Wanderlust");
        res.redirect("/listing");
    });
   
    }catch(err){
        req.flash("error", err.message);
        res.redirect("/signup");
    }
};

module.exports.loginFormRender = (req, res)=>{
    res.render("users/login.ejs");
};

module.exports.login =  async(req, res)=>{
    let redirectUrl = res.locals.redirectUrl || "/listing";
   req.flash("success","welcome back to Wanderlust");
   res.redirect(redirectUrl);
};

module.exports.logout = (req, res, next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success","You are logged out !");
        res.redirect("/listing");
    });
};