var express    = require('express'),
    http       = require('http'),
    path       = require('path'),
    bodyParser = require('body-parser');
    
var env               = 'dev',
    app_config        = require('./app_config')[env],
    sesion            = require('../router/sesion'),
    usuario           = require('../router/usuario'),
	usuariod          = require('../router/usuariod'),
    dispositivo       = require('../router/dispositivo'),
    evento            = require('../router/evento'),
    superdistribuidor = require('../router/superdistribuidor'),
    distribuidor      = require('../router/distribuidor'),
    empresa           = require('../router/empresa'),
    sucursal          = require('../router/sucursal'),
    consumidor        = require('../router/consumidor');
    
var app = express();

app.set('port', process.env.PORT || app_config.port);

// view engine setup
var rutas = require('../router/main')(app);

app.set('views', path.join(__dirname, '../views'));
//app.set('view engine', 'jade');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

//app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

/*************************************************************************************************/
/******************************************** SESION *********************************************/
/*************************************************************************************************/

/* [HttpGet] */
/* [HttpPost] */
app.post('/sesion/autenticar'   , sesion.autenticar   );
app.post('/sesion/reautenticar' , sesion.reautenticar );
app.post('/sesion/desautenticar', sesion.desautenticar);
/* [HttpPut] */
/* [HttpDelete] */

/*************************************************************************************************/
/******************************************* USUARIO *********************************************/
/*************************************************************************************************/
/* HttpGet */
app.get   ('/usuario/admin'          , usuario.crearAdmin         );
app.get   ('/usuario/usuario/:val'   , usuario.existeUsuario      );
app.get   ('/usuario/correo/:val'    , usuario.existeCorreo       );
/* [HttpPost] */                                               
app.post  ('/usuario'                , usuario.crearUsuario       );
/* [HttpPut] */
app.put   ('/usuario/:val'           , usuario.modificarUsuario   );
app.put   ('/usuario/contrasena/:val', usuario.modificarContrasena);
/* [HttpDelete] */
//app.delete('/usuario/:id'            , usuario.eliminarUsuario    );


/*************************************************************************************************/
/******************************************* USUARIOD ********************************************/
/*************************************************************************************************/
/* HttpGet */
app.get   ('/usuariod/:val?'    , usuariod.buscarUsuarioD    );
app.get   ('/usuariod/info/:val', usuariod.buscarInfoUsuarioD);
/* [HttpPost] */
app.post  ('/usuariod'          , usuariod.crearUsuarioD     );
/* [HttpPut] */
app.put   ('/usuariod/:val'     , usuariod.modificarUsuarioD );
/* [HttpDelete] */
//app.delete('/usuariod/:id'      , usuariod.eliminarUsuarioD  );


/*************************************************************************************************/
/***************************************** DISPOSITIVO *******************************************/
/*************************************************************************************************/
/* HttpGet */
app.get   ('/dispositivo/:val?'        , dispositivo.buscarDispositivo         );
/* [HttpPost] */                                                             
app.post  ('/dispositivo'              , dispositivo.crearDispositivo          );
/* [HttpPut] */
app.put   ('/dispositivo/:val'         , dispositivo.modificarDispositivo      );
app.put   ('/dispositivo/sucursal/:val', dispositivo.asociarDispositivoSucursal);
app.put   ('/dispositivo/validar/:val' , dispositivo.validarDispositivo        );
/* [HttpDelete] */
//app.delete('/dispositivo/:id'          , dispositivo.eliminarDispositivo       );


/*************************************************************************************************/
/******************************************** EVENTO *********************************************/
/*************************************************************************************************/
/* HttpGet */
app.get   ('/evento/:val?', evento.buscarEvento   );
/* [HttpPost] */
app.post  ('/evento'      , evento.crearEvento    );
/* [HttpPut] */
app.put   ('/evento/:val' , evento.modificarEvento);
/* [HttpDelete] */
//app.delete('/evento/:id'  , evento.eliminarEvento );


/*************************************************************************************************/
/************************************** SUPERDISTRIBUIDOR ****************************************/
/*************************************************************************************************/
/* HttpGet */
app.get   ('/superdistribuidor/:val?', superdistribuidor.buscarSuperDistribuidor   );
/* [HttpPost] */
app.post  ('/superdistribuidor'      , superdistribuidor.crearSuperDistribuidor    );
/* [HttpPut] */
app.put   ('/superdistribuidor/:val' , superdistribuidor.modificarSuperDistribuidor);
/* [HttpDelete] */
//app.delete('/superdistribuidor/:id'  , superdistribuidor.eliminarSuperDistribuidor );


/*************************************************************************************************/
/***************************************** DISTRIBUIDOR ******************************************/
/*************************************************************************************************/
/* HttpGet */
app.get   ('/distribuidor/:val?', distribuidor.buscarDistribuidor   );
/* [HttpPost] */
app.post  ('/distribuidor'      , distribuidor.crearDistribuidor    );
/* [HttpPut] */
app.put   ('/distribuidor/:val' , distribuidor.modificarDistribuidor);
/* [HttpDelete] */
//app.delete('/distribuidor/:id'  , distribuidor.eliminarDistribuidor );


/*************************************************************************************************/
/******************************************** EMPRESA ********************************************/
/*************************************************************************************************/
/* HttpGet */
app.get   ('/empresa/:val?', empresa.buscarEmpresa   );
/* [HttpPost] */
app.post  ('/empresa'      , empresa.crearEmpresa    );
/* [HttpPut] */
app.put   ('/empresa/:val' , empresa.modificarEmpresa);
/* [HttpDelete] */
//app.delete('/empresa/:id'  , empresa.eliminarEmpresa );


/*************************************************************************************************/
/******************************************** SUCURSAL *******************************************/
/*************************************************************************************************/
/* HttpGet */
app.get   ('/sucursal/:val?', sucursal.buscarSucursal   );
/* [HttpPost] */
app.post  ('/sucursal'      , sucursal.crearSucursal    );
/* [HttpPut] */
app.put   ('/sucursal/:val' , sucursal.modificarSucursal);
/* [HttpDelete] */
//app.delete('/sucursal/:id'  , sucursal.eliminarSucursal );


/*************************************************************************************************/
/******************************************* CONSUMIDOR ******************************************/
/*************************************************************************************************/
/* HttpGet */
app.get   ('/consumidor/:val?', consumidor.buscarConsumidor   );
/* [HttpPost] */
app.post  ('/consumidor'      , consumidor.crearConsumidor    );
/* [HttpPut] */
app.put   ('/consumidor/:val' , consumidor.modificarConsumidor);
/* [HttpDelete] */
//app.delete('/consumidor/:id'  , consumidor.eliminarConsumidor );

exports.app    = app;
exports.http   = http;