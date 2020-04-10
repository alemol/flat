//@ts-check
const express = require('express');
const app = express();
const path = require('path');
//Configuración inicial
app.set('port',3000);
app.set('views',path.join(__dirname,'views'));
app.engine('html',require('ejs').renderFile);
app.set('view engine','ejs');
//middlewares//preprocesar permisos

//routes
app.use(require('./routes/index'));

//static files//media 
app.use(express.static(path.join(__dirname,'public')))

//Escuchando el servidor
app.listen(app.get('port'),()=>{
    console.log('Server en el puerto',app.get('port'));
})