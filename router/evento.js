var connection = require('../config/db'),
    Q          = require('q'),
    utilidades = require('../utils/utilidades'),
	seguridad  = require('../utils/seguridad');

exports.buscarEvento = function(req, res) {
	var evento = typeof req.params.val !== undefined || req.params.val != null ? seguridad.decodeBase64(req.params.val) : null;
};
    
/**
 *	HttpPost
 *
 *  Creates an event.
 *
 *	@param
 *		A JSON request body:
 *		{
 *			"param"       : "Base64EncodeString(xxxxy0z1-0000-zzz0-xyxy-10yy0xxy|1)",  A string in Base64 that represents an user session or id related to the user that creates the request.
 *          "nombre"      : "XXXXX",                                                   A string that represents the name related the event which we want to create.
 *          "descripcion" : "XXXXX",                                                   A string that represents the resume related to the event which we want to create. This field can be optional.
 *          "fechaInicio" : "YYYY-MM-DD HH:mm:ss",                                     A string that represents the start datetime related to the event which we want to create.
 *          "fechaFin"    : "YYYY-MM-DD HH:mm:ss"                                      A string that represents the end datetime related to the event which we want to create. This field can be optional.
 *		}
 *	
 *	@return
 *		A JSON string:
 *		{
 *			"msg" : "OK - Base64EncodeString(event id)"
 *		}
 *
 *	@error
 *		A JSON string:
 *		{
 *			"msg" : "Error description"
 *		}
 *		Or an exception.
 */
exports.crearEvento = function(req, res) {
	var user = typeof req.body.param !== undefined || req.body.param != null ? seguridad.decodeBase64(req.body.param) : null;
	
	var callback = function(id) {
		var sql = '', mensaje = '', resultado = '';
	
		if (connection) {
			sql =
				'SET @resultado = ""; ' +
				'CALL promociones.sp_crearEvento(?, ?, ?, ?, ?, @resultado); ' +
				'SELECT @resultado;';
			
			connection.db.query(
				sql,
				[
					id,
					req.body.nombre,
					typeof req.body.descripcion !== undefined || req.body.descripcion != null ? req.body.descripcion : null,
					req.body.fechaInicio,                                                                                                
					typeof req.body.fechaFin    !== undefined || req.body.fechaFin    != null ? req.body.fechaFin    : null
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
 *  Updates an event.
 *
 *	@param
 *		A request url parameter (an id in Base64 related to the event that we want to update).
 *	@param
 *		A JSON request body (fields to update should be set with a value):
 *		{
 *			"param"       : "Base64EncodeString(xxxxy0z1-0000-zzz0-xyxy-10yy0xxy|1)",  A string in Base64 that represents an user session or id related to the user that creates the request.
 *          "nombre"      : "XXXXX",                                                   A string that represents the name related the event which we want to create.
 *          "descripcion" : "XXXXX",                                                   A string that represents the resume related to the event which we want to create.
 *          "fechaInicio" : "YYYY-MM-DD HH:mm:ss",                                     A string that represents the start datetime related to the event which we want to create.
 *          "fechaFin"    : "YYYY-MM-DD HH:mm:ss",                                     A string that represents the end datetime related to the event which we want to create.
 *          "activo"      : 0                                                          An integer that represents the status (1 for active and 0 for inactive) related to the event which we want to create.
 *		}
 *	
 *	@return
 *		A JSON string:
 *		{
 *			"msg" : "OK - Base64EncodeString(event id)"
 *		}
 *
 *	@error
 *		A JSON string:
 *		{
 *			"msg" : "Error description"
 *		}
 *		Or an exception.
 */
exports.modificarEvento = function(req, res) {
	var event = seguridad.decodeBase64(req.params.val);
	
	var callback = function(data) {
		var sql = '', mensaje = '', resultado = '';
		
		if (connection) {
			sql =
				'SET @resultado = ""; ' +
				'CALL promociones.sp_modificarEvento(?, ?, ?, ?, ?, ?, ?, @resultado); ' +
				'SELECT @resultado;';
			
			connection.db.query(
				sql,
				[
					data[1],
					data[0],
                    typeof req.body.nombre      !== undefined || req.body.nombre      != null ? req.body.nombre      : null,
					typeof req.body.descripcion !== undefined || req.body.descripcion != null ? req.body.descripcion : null,
					typeof req.body.fechaInicio !== undefined || req.body.fechaInicio != null ? req.body.fechaInicio : null,
					typeof req.body.fechaFin    !== undefined || req.body.fechaFin    != null ? req.body.fechaFin    : null,
                    typeof req.body.activo      !== undefined || req.body.activo      != null ? req.body.activo      : null
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
			callback([event, seguridad.decodeBase64(req.body.param)]);
		else
			Q.all([event, utilidades.buscarIdUsuario(seguridad.decodeBase64(req.body.param))]).then(
				callback,
				function(err) {
					throw err;
				}
			);
	}
	else
		callback([event, null]);
};

//exports.eliminarEvento = function(req, res) {

//};