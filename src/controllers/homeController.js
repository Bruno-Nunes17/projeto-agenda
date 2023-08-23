const { async } = require("regenerator-runtime");
const Contato = require("../models/ContatoModel");

exports.index = async (req, res) => {
  try {
    const contato = new Contato(req.body);
    const contatos = await contato.buscarContatos();
    res.render("index", { contatos });
  } catch (error) {
    console.log(error);
    res.render('404')
  }
};
