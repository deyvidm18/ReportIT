var connection = require('../config/db'),
    Q          = require('q'),
    utilidades = require('../utils/utilidades'),
	seguridad  = require('../utils/seguridad');

exports.buscarSuperDistribuidor = function(req, res) {
	var superDist = typeof req.params.val !== undefined || req.params.val != null ? seguridad.decodeBase64(req.params.val) : null;
};
    
/**
 *	HttpPost
 *
 *  Creates a super distributor.
 *
 *	@param
 *		A JSON request body:
 *		{
 *			"param"         : "Base64EncodeString(xxxxy0z1-0000-zzz0-xyxy-10yy0xxy|1)", A string in Base64 that represents an user session or id related to the user that creates the request.
 *          "identificador" : "XXXXX",                                                  A string that represents an identifier related to the super distributor that we want to create. This field can be optional.
 *          "nombre"        : "XXXXX",                                                  A string that represents the name related the super distributor that we want to create.
 *          "documento"     : "XXXXX",                                                  A string that represents the document identifier related the super distributor that we want to create.
 *          "tlfOficina"    : "XXXXX",                                                  A string that represents the telephone number related to the super distributor that we want to create. This field can be optional.
 *          "tlfFax"        : "XXXXX",                                                  A string that represents the fax telephone number related to the super distributor that we want to create. This field can be optional.
 *          "correo"        : "XXXXX@XXXX.XXX",                                         A string that represents the e-mail related to the super distributor that we want to create. This field can be optional.
 *          "direccion"     : "XXXXX",                                                  A string that represents the address related to the super distributor that we want to create. This field can be optional.
 *          "ciudad"        : 0                                                         An integer identifier that represents the city related to the super distributor that we want to create.
 *		}
 *	
 *	@return
 *		A JSON string:
 *		{
 *			"msg" : "OK - Base64EncodeString(super distributor id)"
 *		}
 *
 *	@error
 *		A JSON string:
 *		{
 *			"msg" : "Error description"
 *		}
 *		Or an exception.
 */
exports.crearSuperDistribuidor = function(req, res) {
	var user = typeof req.body.param !== undefined || req.body.param != null ? seguridad.decodeBase64(req.body.param) : null;
	
	var callback = function(id) {
		var sql = '', mensaje = '', resultado = '';
	
		if (connection) {
			sql =
				'SET @resultado = ""; ' +
				'CALL promociones.sp_crearSuperDistribuidor(?, ?, ?, ?, ?, ?, ?, ?, ?, @resultado); ' +
				'SELECT @resultado;';
			
			connection.db.query(
				sql,
				[
					id,
					typeof req.body.identificador !== undefined || req.body.idntificador != null ? req.body.identificador : null,
					req.body.nombre,
					req.body.documento,
					typeof req.body.tlfOficina    !== undefined || req.body.tlfOficina   != null ? req.body.tlfOficina    : null,
					typeof req.body.tlfFax        !== undefined || req.body.tlfFax       != null ? req.body.tlfFax        : null,
					typeof req.body.correo        !== undefined || req.body.correo       != null ? req.body.correo        : null,
					typeof req.body.direccion     !== undefined || req.body.direccion    != null ? req.body.direccion     : null,
					req.body.ciudad
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
 *  Updates a super distributor.
 *
 *	@param
 *		A request url parameter (an id in Base64 related to the super distributor that we want to update).
 *	@param
 *		A JSON request body (fields to update should be set with a value):
 *		{
 *			"param"         : "Base64EncodeString(xxxxy0z1-0000-zzz0-xyxy-10yy0xxy|1)", A string in Base64 that represents an user session or id related to the user that creates the request.
 *          "identificador" : "XXXXX",                                                  A string that represents an identifier related to the super distributor that we want to create.
 *          "nombre"        : "XXXXX",                                                  A string that represents the name related the super distributor that we want to create.
 *          "documento"     : "XXXXX",                                                  A string that represents the document identifier related the super distributor that we want to create.
 *          "tlfOficina"    : "XXXXX",                                                  A string that represents the telephone number related to the super distributor that we want to create.
 *          "tlfFax"        : "XXXXX",                                                  A string that represents the fax telephone number related to the super distributor that we want to create.
 *          "correo"        : "XXXXX@XXXX.XXX",                                         A string that represents the e-mail related to the super distributor that we want to create.
 *          "direccion"     : "XXXXX",                                                  A string that represents the address related to the super distributor that we want to create.
 *          "ciudad"        : 0,                                                        An integer identifier that represents the city related to the super distributor that we want to create.
 *          "activo"        : 1                                                         An integer that represents the status (1 for active and 0 for inactive) related to the super distributor that we want to create.
 *		}
 *	
 *	@return
 *		A json string:
 *		{
 *			"msg" : "OK - Base64EncodeString(user id)"
 *		}
 *
 *	@error
 *		A json string:
 *		{
 *			"msg" : "Error description"
 *		}
 *		Or an exception.
 */
exports.modificarSuperDistribuidor = function(req, res) {
	var superDist = seguridad.decodeBase64(req.params.val);
	
	var callback = function(data) {
		var sql = '', mensaje = '', resultado = '';
		
		if (connection) {
			sql =
				'SET @resultado = ""; ' +
				'CALL promociones.sp_modificarSuperDistribuidor(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @resultado); ' +
				'SELECT @resultado;';
			
			connection.db.query(
				sql,
				[
					data[1],
					data[0],
                    typeof req.body.identificador !== undefined || req.body.identificador != null ? req.body.identificador : null,
					typeof req.body.nombre        !== undefined || req.body.nombre        != null ? req.body.nombre        : null,
					typeof req.body.documento     !== undefined || req.body.documento     != null ? req.body.documento     : null,
					typeof req.body.tlfOficina    !== undefined || req.body.tlfOficina    != null ? req.body.tlfOficina    : null,
                    typeof req.body.tlfFax        !== undefined || req.body.tlfFax        != null ? req.body.tlfFax        : null,
					typeof req.body.correo        !== undefined || req.body.correo        != null ? req.body.correo        : null,
					typeof req.body.direccion     !== undefined || req.body.direccion     != null ? req.body.direccion     : null,
					typeof req.body.ciudad        !== undefined || req.body.ciudad        != null ? req.body.ciudad        : null,
					typeof req.body.activo        !== undefined || req.body.activo        != null ? req.body.activo        : null
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
			callback([superDist, seguridad.decodeBase64(req.body.param)]);
		else
			Q.all([superDist, utilidades.buscarIdUsuario(seguridad.decodeBase64(req.body.param))]).then(
				callback,
				function(err) {
					throw err;
				}
			);
	}
	else
		callback([superDist, null]);
};

//exports.eliminarSuperDistribuidor = function(req, res) {

//};