const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.connect('mongodb://localhost/fotos', { useUnifiedTopology: true, useNewUrlParser: true });

let posibles_valores = ['M', 'F'];
let email_match = [/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.([a-zA-Z]{2,4})+$/, "Coloca un email valido"];

let userSchema = new mongoose.Schema({
    name: String,
    last_name: String,
    username: {type: String, required: true, maxlength: [50, "Username demaciado grande"]},
    password: {
        type: String,
        minlength: [8,"Password demaciado corto"],
        validate: {
            validator: function(p){
                return this.password_confirmation == p;
            },
            message: "Las contraseñas no son iguales"
        }
    },
    age: {type: Number, min: [5, "La edad no puede ser menor que 5"], max: [100, "La edad no puede ser mayor que 100"]},
    email: {type: String, required: "El correo es obligatorio", match: email_match},
    date_of_birth: Date,
    sex: {type: String, enum:{values: posibles_valores, message: "Opción no válida"}}
});

userSchema.virtual("password_confirmation").get(function(){
    return this.p_c;
}).set(function(password){
    this.p_c = password;
})

let User = mongoose.model('User', userSchema);

module.exports.User = User;
