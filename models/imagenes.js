const mongoose = require("mongoose");
let Schema = mongoose.Schema;

let img_schema = new Schema({
    title: {type: String, required: true}
});

let Imagen = mongoose.model("Imagen", img_schema);

module.exports = Imagen;