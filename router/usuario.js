var connection = require('../config/db'),
    Q          = require('q'),
    utilidades = require('../utils/utilidades'),
	seguridad  = require('../utils/seguridad');

/**
 *	HttpGet
 *
 *  Creates an administrator user.
 *	
 *	@return
 *		A JSON string:
 *		{
 *			"msg" : "OK - Base64EncodeString(user id)"
 *		}
 *
 *	@error
 *		A JSON string:
 *		{
 *			"msg" : "Error description"
 *		}
 *		Or an exception.
 */
exports.crearAdmin = function(req, res) {
    var admin = {
        usuario_n : 'admin',
        usuario_p : 'qwerty256'
    };
	var sql = '', mensaje = '', resultado = '';
	
    if (connection) {
        sql =
			'SET @resultado = ""; ' +
            'CALL promociones.sp_crearUsuarioAdmin(?, ?, ?, @resultado); ' +
            'SELECT @resultado;';
		
		connection.db.query(
            sql,
            //[
			//	seguridad.AES(seguidad.SHA512(admin.usuario_n), usuario_p),
			//	seguridad.SHA512(admin.usuario_n),
			//	seguridad.AES(seguidad.SHA512(admin.usuario_p), usuario_p)
			//],
			[admin.usuario_n, admin.usuario_n, admin.usuario_p],
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

/**
 *	HttpGet
 *
 *  Checks if an user name exists.
 *
 *	@param
 *		A request url parameter (an user name).
 *	
 *	@return
 *		A JSON string:
 *		{
 *			"msg" : true (or false)
 *		}
 *
 *	@error
 *		An exception.
 */
exports.existeUsuario = function(req, res) {
	//var username = seguridad.SHA512(req.params.val);
	var username = req.params.val;
	var sql = '';
		
	if (connection) {
		sql =
			'SELECT * ' +
			'FROM ' +
				'promociones.tb_usuario AS U ' +
			'WHERE ' +
				'U.usuario_ = ? OR U.usuarioCorreo_ = ?;';
		
		connection.db.query(
			sql,
			[username, username],
			function(err, result) {
				if (err) throw err;					
				res.contentType('application/json');
				res.write(JSON.stringify({ msg : result.length > 0 ? true : false }));
				res.end();
			}
		);
	}
};

/**
 *	HttpGet
 *
 *  Checks if an email exists.
 *
 *	@param
 *		A request url parameter (an user email).
 *	
 *	@return
 *		A JSON string:
 *		{
 *			"msg" : true (or false)
 *		}
 *
 *	@error
 *		An exception.
 */
exports.existeCorreo = function(req, res) {
	//var mail = seguridad.SHA512(req.params.val);
	var mail = req.params.val;
	var sql = '';
		
	if (connection) {
		sql =
			'SELECT * ' +
			'FROM ' +
				'promociones.tb_usuario AS U ' +
			'WHERE ' +
				'U.usuarioCorreo_ = ?;';
		
		connection.db.query(
			sql,
			[mail],
			function(err, result) {
				if (err) throw err;					
				res.contentType('application/json');
				res.write(JSON.stringify( { msg : result.length > 0 ? true : false }));
				res.end();
			}
		);
	}
};

/**
 *	HttpPost
 *
 *  Creates an user.
 *
 *	@param
 *		A JSON request body:
 *		{
 *			"param"     : "Base64EncodeString(xxxxy0z1-0000-zzz0-xyxy-10yy0xxy|1)"	A string in Base64 that represents an user session or id related to the user who creates the request.
 *			"usuario_n" : "test",													A string that represents the user name.
 *			"usuario_m" : "test@test.com",											A string that represents the email. This field can be optional.
 *			"usuario_p" : "qwerty42",												A string that represents The password.
 *			"activo"    : 1,														An integer that represents the status (1 for active and 0 for inactive). This field can be optional.
 *			"perfil"    : 1															An integer identifier that represents the profile to be associated.
 *		}
 *	
 *	@return
 *		A JSON string:
 *		{
 *			"msg" : "OK - Base64EncodeString(user id)"
 *		}
 *
 *	@error
 *		A JSON string:
 *		{
 *			"msg" : "Error description"
 *		}
 *		Or an exception.
 */
exports.crearUsuario = function(req, res) {
	var user = null;
	
	var callback = function(id) {
		var sql = '', mensaje = '', resultado = '';
	
		if (connection) {
			sql =
				'SET @resultado = ""; ' +
				'CALL promociones.sp_crearUsuario(?, ?, ?, ?, ?, ?, ?, ?, @resultado); ' +
				'SELECT @resultado;';
			
			connection.db.query(
				sql,
				//[
				//	id,
				//	seguridad.encodeAES(seguridad.SHA512(req.body.usuario_n), req.body.usuario_p),
				//	seguridad.SHA512(req.body.usuario_n),
				//	typeof req.body.usuario_m !== undefined || req.body.usuario_m != null ? seguridad.encodeAES(seguridad.SHA512(req.body.usuario_m), req.body.usuario_p) : null,
				//	typeof req.body.usuario_m !== undefined || req.body.usuario_m != null ? seguridad.SHA512(req.body.usuario_m) : null,
				//	seguridad.encodeAES(seguridad.SHA512(req.body.usuario_p), req.body.usuario_p),
				//	typeof req.body.activo !== undefined || req.body.activo != null ? req.body.activo : null,
				//	req.body.perfil
				//],
				[
					id,
					req.body.usuario_n,
					req.body.usuario_n,
					typeof req.body.usuario_m !== undefined || req.body.usuario_m != null ? req.body.usuario_m : null,
					typeof req.body.usuario_m !== undefined || req.body.usuario_m != null ? req.body.usuario_m : null,
					req.body.usuario_p,
					typeof req.body.activo !== undefined || req.body.activo != null ? req.body.activo : null,
					req.body.perfil
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
        user = seguridad.decodeBase64(req.body.param);
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
 *  Updates an user name related to an user.
 *
 *	@param
 *		A request url parameter (an user session or id in Base64 related to the user that we want to update).
 *	@param
 *		A JSON request body:
 *		{
 *			"usuario_n" : "test",			A string that represents the new user name.
 *			"usuario_m" : "test@test.com",	A string that represents the new email. This field can be optional.
 *			"usuario_p" : "qwerty42"		A string that represents the user's password.
 *		}
 *	
 *	@return
 *		A JSON string:
 *		{
 *			"msg" : "OK - Base64EncodeString(user id)"
 *		}
 *
 *	@error
 *		A JSON string:
 *		{
 *			"msg" : "Error description"
 *		}
 *		Or an exception.
 */
exports.modificarUsuario = function(req, res) {
	var user = seguridad.decodeBase64(req.params.val);
	
	var callback = function(id) {
		var sql = '', mensaje = '', resultado = '';
		
		if (connection) {
			sql =
				'SET @resultado = ""; ' +
				'CALL promociones.sp_modificarUsuario(?, ?, ?, ?, ?, ?, NULL, NULL, @resultado); ' +
				'SELECT @resultado;';
			
			connection.db.query(
				sql,
				//[
				//	id,
				//	id,
				//	seguridad.AES(seguridad.SHA512(req.body.usuario_n), req.body.usuario_p),
				//	seguridad.SHA512(req.body.usuario_n),
				//	typeof req.body.usuario_m !== undefined || req.body.usuario_m != null ? seguridad.AES(seguridad.SHA512(req.body.usuario_m), req.body.usuario_p) : null,
				//	typeof req.body.usuario_m !== undefined || req.body.usuario_m != null ? seguridad.SHA512(req.body.usuario_m) : null
				//],
				[
					id,
					id,
					req.body.usuario_n,
					req.body.usuario_n,
					typeof req.body.usuario_m !== undefined || req.body.usuario_m != null ? req.body.usuario_m : null,
					typeof req.body.usuario_m !== undefined || req.body.usuario_m != null ? req.body.usuario_m : null,
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
	
	if ((/^\d+$/g).test(user))
        callback(user);
	else
		utilidades.buscarIdUsuario(user).then(
            callback,
            function(err) {
                throw err;
            }
        );
};

/**
 *	HttpPut
 *
 *  Updates a password related to an user.
 *
 *	@param
 *		A request url parameter (an user session or id in Base64 related to the user that we want to update).
 *	@param
 *		A JSON request body:
 *		{
 *			"usuario_p"  : "qwerty42",	A string that represents the user password.//NOT FORGET TO ENCODE
 *			"usuario_np" : "42qwerty"	A string that represents the user new password.//NOT FORGET TO ENCODE
 *		}
 *	
 *	@return
 *		A JSON string:
 *		{
 *			"msg" : "OK - Base64EncodeString(user id)"
 *		}
 *
 *	@error
 *		A JSON string:
 *		{
 *			"msg" : "Error description"
 *		}
 *		Or an exception.
 */
exports.modificarContrasena = function(req, res) {
	var user = seguridad.decodeBase64(req.params.val);
	
	var callback_1 = function(id) {
		var deferred = Q.defer();
        var sql = '';
			
		if (connection) {
			sql =
				'SELECT ' +
					'? AS id, U.usuario AS usuario, U.usuarioCorreo AS usuarioCorreo ' +
				'FROM ' +
					'promociones.tb_usuario AS U ' +
				'WHERE ' +
					'U.id_usuario = ?;';
			
			connection.db.query(
				sql,
				[id],
				function(err, result) {
					if (err) deferred.reject(err);
					
					if (result.length <= 0) {
						res.contentType('application/json');
						res.write(JSON.stringify({ msg : 'ERROR - ! - Error buscando datos' }));
						res.end();
					}					
					else                   
                        deferred.resolve(result[0]);
						//callback(result[0].id, result[0].usuario, result[0].usuarioCorreo);
				}
			);
		}
        
        return deferred.promise;
	};
	
	var callback_2 = function(data) {
		var sql = '', mensaje = '', resultado = '';
		
		if (connection) {
			sql =
				'SET @resultado = ""; ' +
				'CALL promociones.sp_modificarUsuario(?, ?, ?, NULL, ?, NULL, ?, NULL, @resultado); ' +
				'SELECT @resultado;';
			
			connection.db.query(
				sql,
				//[
				//	data.id,
				//	data.id,
				//	seguridad.encodeAES(seguridad.decodeAES(data.usuario, req.body.usuario_p), req.body.usuario_np),
				//	data.usuarioCorreo != null ? seguridad.encodeAES(seguridad.decodeAES(data.usuarioCorreo, req.body.usuario_p), req.body.usuario_np) : null,
				//	seguridad.encodeAES(seguridad.SHA512(req.body.usuario_np), req.body.usuario_np)
				//],
				[
					data.id,
					data.id,
					data.usuario,
					data.usuarioCorreo != null ? data.usuarioCorreo : null,
					req.body.usuario_np
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
	
	if ((/^\d+$/g).test(user))
		callback_1(user).then(
            callback_2,
            function(err) {
                throw err;
            }
        );
	else 
        utilidades.buscarIdUsuario(user).then(
            callback_1
        ).then(
            callback_2,
            function(err) {
                throw err;
            }
        );
};

exports.cambiarEstadoUsuario = function(req, res) {
    
};

//exports.eliminarUsuario = function(req, res) {

//};