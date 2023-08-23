const Login = require("../models/LoginModel");

exports.index = (req, res) => {
  res.render("login");
};

exports.register = async (req, res) => {
  try {
    const login = new Login(req.body);
    await login.register();

    if (login.error.length > 0) {
      req.flash("errors", login.error);
      return res.redirect("/login/index");
    }
    req.flash("success", "seu usuario foi criado com sucesso");
    return res.redirect("/login/index");
  } catch (error) {
    console.log(error);
    return res.render("404");
  }
};

exports.login = async (req, res) => {
    try {
      const login = new Login(req.body);
      await login.login();
  
      if (login.error.length > 0) {
        req.flash("errors", login.error);
        return res.redirect("/login/index");
      }
      req.flash("success", "Logado com sucesso");
      req.session.user = login.user;
      return res.redirect("/");
    } catch (error) {
      console.log(error);
      return res.render("404");
    }
  };

  exports.logout = (req, res) =>{
    req.session.destroy();
    return res.redirect("/");
  }

