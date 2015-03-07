var express    = require('express'),
    http       = require('http'),
    path       = require('path'),
    bodyParser = require('body-parser');
    
var env        = 'dev',
    app_config = require('./app_config')[env],
    sesion     = require('../router/sesion');
    usuario    = require('../router/usuario');
	usuariod   = require('../router/usuariod');
    
var app = express();

app.set('port', process.env.PORT || app_config.port);

app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/*************************************************************************************************/
/******************************************** SESION *********************************************/
/*************************************************************************************************/

/* [HttpGet] */

/* [HttpPost] */
app.post('/sesion/autenticar', sesion.autenticar);
app.post('/sesion/reautenticar', sesion.reautenticar);
app.post('/sesion/desautenticar', sesion.desautenticar);

app.post('/sesion/reautenticarX', sesion.reautenticarX);

/* [HttpPut] */

/* [HttpDelete] */

/*************************************************************************************************/
/******************************************* USUARIO *********************************************/
/*************************************************************************************************/

/* HttpGet */
app.get('/usuario/admin', usuario.crearAdmin);
app.get('/usuario/usuario/:val', usuario.existeUsuario);
app.get('/usuario/correo/:val', usuario.existeCorreo);

/* [HttpPost] */
app.post('/usuario', usuario.crearUsuario);

/* [HttpPut] */
app.put('/usuario/:val', usuario.modificarUsuario);

/* [HttpDelete] */
//app.delete('/usuario/:id', usuario.deleteUsuario);

/*************************************************************************************************/
/******************************************* USUARIOD *********************************************/
/*************************************************************************************************/

/* HttpGet */
app.get('/usuariod/usuariod/:val', usuariod.buscarInfoUsuarioD);

/* [HttpPost] */


/* [HttpPut] */


/* [HttpDelete] */



exports.app    = app;
exports.http   = http;