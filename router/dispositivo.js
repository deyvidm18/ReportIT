var connection = require('../config/db'),
    Q          = require('q'),
    utilidades = require('../utils/utilidades'),
	seguridad  = require('../utils/seguridad');

exports.buscarDispositivo = function(req, res) {
	var device = typeof req.params.val !== undefined || req.params.val != null ? seguridad.decodeBase64(req.params.val) : null;
};
    
/**
 *	HttpPost
 *
 *  Creates a device.
 *
 *	@param
 *		A JSON request body:
 *		{
 *			"param"            : "Base64EncodeString(xxxxy0z1-0000-zzz0-xyxy-10yy0xxy|1)",  A string in Base64 that represents an user session or id related to the user that creates the request.
 *          "identificador"    : "XXXXX",                                                   A string that represents the identifier (e.g. IMEI) related to the device which we want to create.
 *          "nombre"           : "XXXXX",                                                   A string that represents the name related to the device which we want to create.
 *          "marca"            : "XXXXX",                                                   A string that represents the brand related to the device which we want to create.
 *          "modelo"           : "XXXXX",                                                   A string that represents the model related to the device which we want to create.
 *          "serial"           : "XXXXX",                                                   A string that represents the serial number related to the device which we want to create.
 *          "sistemaOperativo" : "XXXXX",                                                   A string that represents the operative system related to the device which we want to create. This field can be optional.
 *          "version"          : "XXXXX",                                                   A string that represents the operative system version related to the device which we want to create. This field can be optional.
 *          "tipoDispositivo"  : 0                                                          An integer identifier that represents the device type related to the device which we want to create.
 *		}
 *	
 *	@return
 *		A JSON string:
 *		{
 *			"msg" : "OK - Base64EncodeString(device id)"
 *		}
 *
 *	@error
 *		A JSON string:
 *		{
 *			"msg" : "Error description"
 *		}
 *		Or an exception.
 */
exports.crearDispositivo = function(req, res) {
	var user = typeof req.body.param !== undefined || req.body.param != null ? seguridad.decodeBase64(req.body.param) : null;
	
	var callback = function(id) {
		var sql = '', mensaje = '', resultado = '';
	
		if (connection) {
			sql =
				'SET @resultado = ""; ' +
				'CALL promociones.sp_crearDispositivo(?, ?, ?, ?, ?, ?, ?, ?, ?, @resultado); ' +
				'SELECT @resultado;';
			
			connection.db.query(
				sql,
				[
					id,
					req.body.identificador,
					req.body.nombre,
					req.body.marca,
					req.body.modelo,                                                                                                
					req.body.serial,
                    typeof req.body.sistemaOperativo !== undefined || req.body.sistemaOperativo != null ? req.body.sistemaOperativo : null,
					typeof req.body.version          !== undefined || req.body.version          != null ? req.body.version          : null,
					req.body.tipoDispositivo
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
 *  Updates a device.
 *
 *	@param
 *		A request url parameter (an IMEI's device or id in Base64 related to the device that we want to update).
 *	@param
 *		A JSON request body (Fields to update should be set with a value):
 *		{
 *		    "param"            : "Base64EncodeString(xxxxy0z1-0000-zzz0-xyxy-10yy0xxy|1)",  A string in Base64 that represents an user session or id related to the user that creates the request.
 *          "identificador"    : "XXXXX",                                                   A string that represents the identifier (e.g. IMEI) related to the device which we want to create.
 *          "nombre"           : "XXXXX",                                                   A string that represents the name related to the device which we want to create.
 *          "marca"            : "XXXXX",                                                   A string that represents the brand related to the device which we want to create.
 *          "modelo"           : "XXXXX",                                                   A string that represents the model related to the device which we want to create.
 *          "serial"           : "XXXXX",                                                   A string that represents the serial number related to the device which we want to create.
 *          "sistemaOperativo" : "XXXXX",                                                   A string that represents the operative system related to the device which we want to create.
 *          "version"          : "XXXXX",                                                   A string that represents the operative system version related to the device which we want to create.
 *          "activo"           : 0                                                          An integer that represents the status (1 for active and 0 for inactive) related to the device which we want to create.
 *		}
 *	
 *	@return
 *		A JSON string:
 *		{
 *			"msg" : "OK - Base64EncodeString(device id)"
 *		}
 *
 *	@error
 *		A JSON string:
 *		{
 *			"msg" : "Error description"
 *		}
 *		Or an exception.
 */
exports.modificarDispositivo = function(req, res) {
	var device = seguridad.decodeBase64(req.params.val);
	
	var callback = function(data) {
		var sql = '', mensaje = '', resultado = '';
		
		if (connection) {
			sql =
				'SET @resultado = ""; ' +
				'CALL promociones.sp_modificarDispositivo(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @resultado); ' +
				'SELECT @resultado;';
			
			connection.db.query(
				sql,
				[
					data[1],
					data[0],
                    typeof req.body.identificador    !== undefined || req.body.identificador    != null ? req.body.identificador    : null,
					typeof req.body.nombre           !== undefined || req.body.nombre           != null ? req.body.nombre           : null,
					typeof req.body.marca            !== undefined || req.body.marca            != null ? req.body.marca            : null,
					typeof req.body.modelo           !== undefined || req.body.modelo           != null ? req.body.modelo           : null,
					typeof req.body.serial           !== undefined || req.body.serial           != null ? req.body.serial           : null,
                    typeof req.body.sistemaOperativo !== undefined || req.body.sistemaOperativo != null ? req.body.sistemaOperativo : null,
					typeof req.body.version          !== undefined || req.body.version          != null ? req.body.version          : null,
                    typeof req.body.activo           !== undefined || req.body.activo           != null ? req.body.activo           : null
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
		if ((/^\d+$/g).test(seguridad.decodeBase64(req.body.param))) {
			if ((/^\d+$/g).test(device))
				callback([device, seguridad.decodeBase64(req.body.param)]);
			else
				Q.all([utilidades.buscarIdDispositivo, seguridad.decodeBase64(req.body.param)]).then(
					callback,
					function(err) {
						throw err;
					}
				);
		}
		else {
			if ((/^\d+$/g).test(device))
				Q.all([device, utilidades.buscarIdUsuario(seguridad.decodeBase64(req.body.param))]).then(
					callback,
					function(err) {
						throw err;
					}
				);
			else
				Q.all([utilidades.buscarIdDispositivo(device), utilidades.buscarIdUsuario(seguridad.decodeBase64(req.body.param))]).then(
					callback,
					function(err) {
						throw err;
					}
				);
		}
	}
	else {
		if ((/^\d+$/g).test(device))
			callback([device, null]);
		else
			Q.all([utilidades.buscarIdDispositivo(device), null]).then(
				callback,
				function(err) {
					throw err;
				}
			);
	}
};

/**
 *	HttpPut
 *
 *  Creates a relation between a device and a branch office.
 *
 *	@param
 *		A request url parameter (an IMEI's device or id in Base64 related to the device that we want to update).
 *	@param
 *		A JSON request body (fields to update should be set with a value):
 *		{
 *		    "param"    : "Base64EncodeString(xxxxy0z1-0000-zzz0-xyxy-10yy0xxy|1)",  A string in Base64 that represents an user session or id related to the user that creates the request.
 *          "sucursal" : "XXXXX"                                                    An integer identifier that represents the branch office that we will associate to the device.
 *		}
 *	
 *	@return
 *		A JSON string:
 *		{
 *			"msg" : "OK - Base64EncodeString(device id)"
 *		}
 *
 *	@error
 *		A JSON string:
 *		{
 *			"msg" : "Error description"
 *		}
 *		Or an exception.
 */
exports.asociarDispositivoSucursal = function(req, res) {
	var device = seguridad.decodeBase64(req.params.val);
	
	var callback = function(data) {
		var sql = '', mensaje = '', resultado = '';
		
		if (connection) {
			sql =
				'SET @resultado = ""; ' +
				'CALL promociones.sp_asociarDispositivoSucursal(?, ?, ?, @resultado); ' +
				'SELECT @resultado;';
			
			connection.db.query(
				sql,
				[
					data[1],
					data[0],
                    req.body.sucursal
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
		if ((/^\d+$/g).test(seguridad.decodeBase64(req.body.param))) {
			if ((/^\d+$/g).test(device))
				callback([device, seguridad.decodeBase64(req.body.param)]);
			else
				Q.all([utilidades.buscarIdDispositivo(device), seguridad.decodeBase64(req.body.param)]).then(
					callback,
					function(err) {
						throw err;
					}
				);
		}
		else {
			if ((/^\d+$/g).test(device))
				Q.all([device, utilidades.buscarIdUsuario(seguridad.decodeBase64(req.body.param))]).then(
					callback,
					function(err) {
						throw err;
					}
				);
			else
				Q.all([utilidades.buscarIdDispositivo(device), utilidades.buscarIdUsuario(seguridad.decodeBase64(req.body.param))]).then(
					callback,
					function(err) {
						throw err;
					}
				);
		}
	}
	else {
		if ((/^\d+$/g).test(device))
			callback([device, null]);
		else
			Q.all([utilidades.buscarIdDispositivo(device), null]).then(
				callback,
				function(err) {
					throw err;
				}
			);
	}
};

/**
 *	HttpPut
 *
 *  Checks if a device stills on-line and updates its revision date.
 *
 *	@param
 *		A request url parameter (an IMEI's device or id in Base64 related to the device that we want to update).
 *	
 *	@return
 *		A JSON string:
 *		{
 *			"msg" : "OK - Base64EncodeString(device id)"
 *		}
 *
 *	@error
 *		A JSON string:
 *		{
 *			"msg" : "Error description"
 *		}
 *		Or an exception.
 */
exports.validarDispositivo = function(req, res) {
	var device = seguridad.decodeBase64(req.params.val);
	
	var callback = function(id) {
		var sql = '', mensaje = '', resultado = '';
	
		if (connection) {
			sql =
				'SET @resultado = ""; ' +
				'CALL promociones.sp_validarDispositivo(?, @resultado); ' +
				'SELECT @resultado;';
			
			connection.db.query(
				sql,
				[id],
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
	
	if ((/^\d+$/g).test(device))
        callback(device);
    else
        utilidades.buscarIdDispositivo(device).then(
            callback,
            function(err) {
                throw err;
            }
        );
};

//exports.eliminarDispositivo = function(req, res) {

//};