var connection = require('../config/db'),
    Q          = require('q'),
    utilidades = require('../utils/utilidades'),
	seguridad  = require('../utils/seguridad');
    
exports.buscarConsumidor = function(req, res) {
	var client = typeof req.params.val !== undefined || req.params.val != null ? seguridad.decodeBase64(req.params.val) : null;
};
    
/**
 *	HttpPost
 *
 *  Creates a client.
 *
 *	@param
 *		A JSON request body:
 *		{
 *			"param"           : "Base64EncodeString(xxxxy0z1-0000-zzz0-xyxy-10yy0xxy|1)",   A string in Base64 that represents an user session or id related to the user that creates the request.
 *          "nombre"          : "XXXXX",                                                    A string that represents the name related the client that we want to create. This field can be optional.
 *          "apellido"        : "XXXXX",                                                    A string that represents the last name related the client that we want to create. This field can be optional.
 *          "tlfCelular"      : "XXXXX",                                                    A string that represents the mobile telephone number related to the client that we want to create.
 *          "correo"          : "XXXXX@XXXX.XXX",                                           A string that represents the e-mail related to the client that we want to create. This field can be optional.
 *          "twitter"         : "XXXXX",                                                    A string that represents the twitter user name related to the client that we want to create. This field can be optional.
 *          "facebook"        : "XXXXX",                                                    A string that represents the facebook user name related to the client that we want to create. This field can be optional. 
 *          "fechaNacimiento" : "YYYY-MM-DD",                                               A string that represents the birth date related to the client that we want to create. This field can be optional.
 *          "tipoConsumidor"  : 0,                                                          An integer identifier that represents the client type related to the client that we want to create.
 *          "sexo"            : 0,                                                          An integer identifier that represents the sex related to the client that we want to create. This field can be optional.
 *          "ciudad"          : 0                                                           An integer identifier that represents the city related to the client that we want to create. This field can be optional.
 *		}
 *	
 *	@return
 *		A JSON string:
 *		{
 *			"msg" : "OK - Base64EncodeString(client id)"
 *		}
 *
 *	@error
 *		A jSON string:
 *		{
 *			"msg" : "Error description"
 *		}
 *		Or an exception.
 */
exports.crearConsumidor = function(req, res) {
	var user = typeof req.body.param !== undefined || req.body.param != null ? seguridad.decodeBase64(req.body.param) : null;
	
	var callback = function(id) {
		var sql = '', mensaje = '', resultado = '';
	
		if (connection) {
			sql =
				'SET @resultado = ""; ' +
				'CALL promociones.sp_crearConsumidor(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @resultado); ' +
				'SELECT @resultado;';
			
			connection.db.query(
				sql,
				[
					id,
					typeof req.body.nombre          !== undefined || req.body.nombre          != null ? req.body.nombre          : null,
					typeof req.body.apellido        !== undefined || req.body.apellido        != null ? req.body.apellido        : null,
                    req.body.tlfCelular,                                                                                         
                    typeof req.body.correo          !== undefined || req.body.correo          != null ? req.body.correo          : null,
                    typeof req.body.twitter         !== undefined || req.body.twitter         != null ? req.body.twitter         : null,
                    typeof req.body.facebook        !== undefined || req.body.facebook        != null ? req.body.facebook        : null,
                    typeof req.body.fechaNacimiento !== undefined || req.body.fechaNacimiento != null ? req.body.fechaNacimiento : null,
                    req.body.tipoConsumidor,
                    typeof req.body.sexo            !== undefined || req.body.sexo            != null ? req.body.sexo            : null,
                    typeof req.body.ciudad          !== undefined || req.body.ciudad          != null ? req.body.ciudad          : null,
				],
				function(err, result) {
					if (err) throw err;
					mensaje   = result[3][0]['@resultado'];
					resultado = result[1][0]['res'];
			
					res.contentType('application/json');
					res.write(JSON.stringify({ msg : (/ERROR/g).test(mensaje) ? mensaje : "OK - " + seguridad.encodeBase64(resultado) }));
					res.end();
				}
			);
		}
	};
    
    if (user != null) {
        if ((/^\d+$/g).test(user))
            callback(user);
        else
            utilidades.buscarIdUsuario(user).then(
                callback,
                function(err) {
                    throw err;
                }
            );
    }
	else
		callback(null);
};

/**
 *	HttpPut
 *
 *  Updates a client.
 *
 *	@param
 *		A request url parameter (an id in Base64 related to the client that we want to update).
 *	@param
 *		A JSON request body (fields to update should be set with a value):
 *		{
 *			"param"           : "Base64EncodeString(xxxxy0z1-0000-zzz0-xyxy-10yy0xxy|1)",   A string in Base64 that represents an user session or id related to the user that creates the request.
 *          "nombre"          : "XXXXX",                                                    A string that represents the name related the client that we want to create.
 *          "apellido"        : "XXXXX",                                                    A string that represents the last name related the client that we want to create.
 *          "tlfCelular"      : "XXXXX",                                                    A string that represents the mobile telephone number related to the client that we want to create.
 *          "correo"          : "XXXXX@XXXX.XXX",                                           A string that represents the e-mail related to the client that we want to create.
 *          "twitter"         : "XXXXX",                                                    A string that represents the twitter user name related to the client that we want to create.
 *          "facebook"        : "XXXXX",                                                    A string that represents the facebook user name related to the client that we want to create.
 *          "fechaNacimiento" : "YYYY-MM-DD",                                               A string that represents the birth date related to the client that we want to create.
 *          "tipoConsumidor"  : 0,                                                          An integer identifier that represents the client type related to the client that we want to create.
 *          "sexo"            : 0,                                                          An integer identifier that represents the sex related to the client that we want to create.
 *          "ciudad"          : 0                                                           An integer identifier that represents the city related to the client that we want to create.
 *		}
 *	
 *	@return
 *		A JSON string:
 *		{
 *			"msg" : "OK - Base64EncodeString(client id)"
 *		}
 *
 *	@error
 *		A JSON string:
 *		{
 *			"msg" : "Error description"
 *		}
 *		Or an exception.
 */
exports.modificarConsumidor = function(req, res) {
	var client = seguridad.decodeBase64(req.params.val);
	
	var callback = function(data) {
		var sql = '', mensaje = '', resultado = '';
		
		if (connection) {
			sql =
				'SET @resultado = ""; ' +
				'CALL promociones.sp_modificarConsumidor(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @resultado); ' +
				'SELECT @resultado;';
			
			connection.db.query(
				sql,
				[
					data[1],
					data[0],
                    typeof req.body.nombre          !== undefined || req.body.nombre          != null ? req.body.nombre          : null,
                    typeof req.body.apellido        !== undefined || req.body.apellido        != null ? req.body.apellido        : null,
                    typeof req.body.tlfCelular      !== undefined || req.body.tlfCelular      != null ? req.body.tlfCelular      : null,
                    typeof req.body.correo          !== undefined || req.body.correo          != null ? req.body.correo          : null,
                    typeof req.body.twitter         !== undefined || req.body.twitter         != null ? req.body.twitter         : null,
                    typeof req.body.facebook        !== undefined || req.body.facebook        != null ? req.body.facebook        : null,
                    typeof req.body.fechaNacimiento !== undefined || req.body.fechaNacimiento != null ? req.body.fechaNacimiento : null,
                    typeof req.body.tipoConsumidor  !== undefined || req.body.tipoConsumidor  != null ? req.body.tipoConsumidor  : null,
                    typeof req.body.sexo            !== undefined || req.body.sexo            != null ? req.body.sexo            : null,
                    typeof req.body.ciudad          !== undefined || req.body.ciudad          != null ? req.body.ciudad          : null
				],
				function(err, result) {
					if (err) throw err;
					mensaje   = result[3][0]['@resultado'];
					resultado = result[1][0]['res'];
										
					res.contentType('application/json');
					res.write(JSON.stringify({ msg : (/ERROR/g).test(mensaje) ? mensaje : "OK - " + seguridad.encodeBase64(resultado) }));
					res.end();
				}
			);
		}
    };
	
	if (typeof req.body.param !== undefined || req.body.param != null) {
		if ((/^\d+$/g).test(seguridad.decodeBase64(req.body.param)))
			callback([client, seguridad.decodeBase64(req.body.param)]);
		else
			Q.all([client, utilidades.buscarIdUsuario(seguridad.decodeBase64(req.body.param))]).then(
				callback,
				function(err) {
					throw err;
				}
			);
	}
	else
		callback([client, null]);
};

//exports.eliminarConsumidor = function(req, res) {

//};