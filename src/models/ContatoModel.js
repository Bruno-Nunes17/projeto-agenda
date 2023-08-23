const mongoose = require("mongoose");
const validator = require("validator");

const ContatoSchema = new mongoose.Schema({
  nome: { type: String, required: true },
  sobrenome: { type: String, required: false, default: "" },
  email: { type: String, required: false, default: "" },
  telefone: { type: String, required: false, default: "" },
  criaDoEM: { type: Date, default: Date.now },
});

const ContatoModel = mongoose.model("Contato", ContatoSchema);

class Contato {
  constructor(body) {
    this.body = body;
    this.error = [];
    this.contato = null;
  }

  async buscarPorId(id) {
    if (typeof id !== "string") return;
    const contato = await ContatoModel.findById(id);
    return contato;
  }

  async buscarContatos() {
    const contato = await ContatoModel.find()
    .sort({ criaDoEM: -1});
    return contato;
  }
  async delete(id) {
    if (typeof id !== "string") return;
    const contato = await ContatoModel.findByIdAndDelete(id);
    return contato;
  }
  
  async edit(id) {
    if (typeof id !== 'string') return;
    this.valida();
    if(this.error.length > 0 ) return;
    this.contato = await ContatoModel.findByIdAndUpdate(id, this.body, { new: true });
    return this.contato;
  }
  async userExists() {
    this.contato = await ContatoModel.findOne({ email: this.body.email});
    if (this.contato) this.error.push("O usuario já existe");
  }

  async register() {
    this.valida();
    if (this.error.length > 0) return;
    this.contato = await ContatoModel.create(this.body);
  }

  valida() {
    this.cleanUp();
    if (this.body.email && !validator.isEmail(this.body.email)) {
      this.error.push("E-mail inválido");
    }
    if (!this.body.nome) {
      this.error.push("Nome é um campo obrigatário");
    }
    if (!this.body.email && !this.body.telefone) {
      this.error.push(
        "Você deve cadastrar pelo menos um email ou telefone por contato"
      );
    }
  }

  cleanUp() {
    for (const key in this.body) {
      if (typeof this.body[key] !== "string") {
        this.body[key] = "";
      }
    }
    this.body = {
      nome: this.body.nome,
      sobrenome: this.body.sobrenome,
      email: this.body.email,
      telefone: this.body.telefone,
    };
  }
}

module.exports = Contato;
