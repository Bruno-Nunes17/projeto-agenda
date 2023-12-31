const Contato = require("../models/ContatoModel");

exports.index = (req, res) => {
  res.render("contato", {
    contato: {},
  });
};

exports.register = async (req, res) => {
  try {
    const contato = new Contato(req.body);
    await contato.register();

    if (contato.error.length > 0) {
      req.flash("errors", contato.error);
      req.session.save(() => res.redirect("/contato/index"));
      return;
    }

    req.flash("success", "Contato Cadastrado com sucesso.");
    req.session.save(() =>
      res.redirect(`/contato/index/${contato.contato._id}`)
    );
    return;
  } catch (error) {
    console.log(error);
    return res.render("404");
  }
};

exports.editIndex = async (req, res) => {
  try {
    if (!req.params.id) return res.render("404");
    const contato = new Contato(req.body);
    const user = await contato.buscarPorId(req.params.id);

    if (!user) return res.render("404");

    res.render("contato", { contato: user });
  } catch (error) {
    console.log(error);
    res.render("404");
  }
};

exports.edit = async function (req, res) {
  try {
    if (!req.params.id) return res.render("404");
    const contato = new Contato(req.body);
    await contato.edit(req.params.id);

    if (contato.error.length > 0) {
      req.flash("errors", contato.error);
      req.session.save(() => res.redirect(`/contato/index/${req.params.id}`));
      return;
    }

    req.flash("success", "Contato editado com sucesso.");
    req.session.save(() =>
      res.redirect(`/contato/index/${contato.contato._id}`)
    );
    return;
  } catch (e) {
    console.log(e);
    res.render("404");
  }
};

exports.delete = async (req, res) => {
  try {
    if (!req.params.id) return res.render("404");
    const contato = new Contato(req.body);
    const user = await contato.delete(req.params.id);

    if (!user) return res.render("404");

    req.flash("success", 'Contato apagado com sucesso');
    req.session.save(() => res.redirect('/'));
    return;
  } catch (error) {
    console.log(error);
    res.render("404");
  }
};
