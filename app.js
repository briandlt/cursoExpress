const express = require("express");
const bodyParser = require('body-parser');
const User = require("./models/user").User;
const session = require('express-session');
const router_app = require("./routes_app");
const session_middleware = require("./middlewares/session");

const app = express();

// Servicio de archivos estáticos en Express
app.use(express.static('public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(session({
    secret: "123byuhbsdah12ub",
    resave: false,
    saveUninitialized: false
}));

app.set("view engine", "pug");

app.get("/", function (req, res) {
    console.log(req.session.user_id);
    res.render("index");
})

app.get("/login", function (req, res) {
    res.render("login");
})

app.get("/signup", function (req, res) {
    res.render("signup");
})

app.post("/users", function(req, res){
    let user = new User({email: req.body.email,
                            username: req.body.username,
                            password: req.body.password,
                            password_confirmation: req.body.password_confirmation
                        });
    console.log(user.password_confirmation);

    user.save().then(function(us){
        res.send("Usuario guardado exitosamente");
    },function(err){
        console.log(String(err));
        res.send("Hubo un error al tratar de guardar el usuario");
    });
});

//  EL LOGIN DIRECCIONA A ESTA RUTA CUANDO INTENTAS INICIAR SESION
app.post("/sessions", function(req, res){
    
    // USAMOS LOS PARAMETROS QUE ENVIAMOS EN EL LOGIN PARA VER LAS CREDENCIALES SON CORRECTAS
    User.findOne({email:req.body.email, password:req.body.password}, function(err, user){
        if(!err){
            // SI ME DEVUELVE UN SUAURIO QUIERE DECIR QUE LAS CREDENCIALES SON CORRECTAS
            if(user){
                req.session.user_id = user._id;
                res.redirect("/app");
            }else{ // DE LO CONTRARIO REDIRECCIONAMOS AL LOGIN Y MANDAMOS UN MENSAJE DE FALLO 
                console.log("Tus credenciales son incorrectas");
                res.redirect("/login");
            }
        }else{
            console.log(err);
        }   
    })
});

app.use("/app", session_middleware);
app.use("/app", router_app);

app.listen(8080, () =>{
    console.log("Server on port 8080");
});