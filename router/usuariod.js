var connection = require('../config/db'),
    Q          = require('q'),
    utilidades = require('../utils/utilidades'),
	seguridad  = require('../utils/seguridad');

exports.buscarUsuarioD = function(req, res) {
	var userD = typeof req.params.val !== undefined || req.params.val != null ? seguridad.decodeBase64(req.params.val) : null;
};
   
/**
 *	HttpGet
 *
 *  Gets an user information.
 *
 *	@param
 *		A request url parameter (an user session or id in Base 64 related to the user that we want to get the information).
 *	
 *	@return
 *		A JSON string:
 *		{
 *			"nombre"            : "XXXXX",  A string that represents the user name.
 *          "apellido"          : "XXXXX",  A string that represents the user last name.
 *          "perfil"            : 0,        An integer identifier that represents the profile related to the user.
 *          "idioma"            : 0,        An integer identifier that represents the language related to the user.
 *          "superdistribuidor" : 0,        An integer identifier that represents the super distributor related to the user. This field applies when the profile value is 2.
 *          "distribuidor"      : 0,        An integer identifier that represents the distributor related to the user. This field applies when the profile value is 3.
 *          "empresa"           : 0,        An integer identifier that represents the company related to the user. This field applies when the profile value is 4.
 *          "sucursal"          : 0         An integer identifier that represents the branch office related to the user. This field applies when the profile value is 5.
 *		}
 *
 *	@error
 *		A JSON string:
 *		{
 *			"msg" : "Error description"
 *		}
 *		Or an exception.
 */
exports.buscarInfoUsuarioD = function(req, res) {
	var user = seguridad.decodeBase64(req.params.val);
	
	var callback = function(id) {
		var sql = '', mensaje = '', resultado = '';
		
		if (connection) {
			sql =
				'SET @resultado = ""; ' +
				'CALL promociones.sp_buscarInfoUsuario(?, @resultado); ' +
				'SELECT @resultado;';
			
			connection.db.query(
				sql,
				[id],
				function(err, result) {
					if (err) throw err;
					mensaje   = result[3][0]['@resultado'];
					resultado = result[1][0];
			
					res.contentType('application/json');
					res.write(JSON.stringify({ msg : (/ERROR/g).test(mensaje) ? mensaje : resultado }));
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
 *	HttpPost
 *
 *  Creates the information related to an user.
 *
 *	@param
 *		A JSON request body:
 *		{
 *			"param"       : "Base64EncodeString(xxxxy0z1-0000-zzz0-xyxy-10yy0xxy|1)",   A string in Base64 that represents an user session or id related to the user that creates the request.
 *          "documento"   : "XXXXX",                                                    A string that represents the document identifier related the user whom we want to create his/her information. This field can be optional.
 *          "nombre"      : "XXXXX",                                                    A string that represents the name related to the user whom we want to create his/her information. This field can be optional.
 *          "apellido"    : "XXXXX",                                                    A string that represents the last name related to the user whom we want to create his/her information. This field can be optional.
 *          "correo"      : "XXXXX@XXXX.XXX",                                           A string that represents the e-mail related to the user whom we want to create his/her information.
 *          "tlfCasa"     : "XXXXX",                                                    A string that represents the telephone number related to the user whom we want to create his/her information. This field can be optional.
 *          "tlfOficina"  : "XXXXX",                                                    A string that represents the office telephone number related to the user whom we want to create his/her information. This field can be optional.
 *          "tlfCelular"  : "XXXXX",                                                    A string that represents the mobile telephone number related to the user whom we want to create his/her information. This field can be optional.
 *          "sexo"        : 0,                                                          An integer identifier that represents the sex related to the user whom we want to create his/her information.
 *          "tipoUsuario" : 0,                                                          An integer identifier that represents the user type related to the user whom we want to create his/her information.
 *          "ciudad"      : 0,                                                          An integer identifier that represents the city related to the user whom we want to create his/her information.
 *          "idioma"      : 0,                                                          An integer identifier that represents the language related to the user whom we want to create his/her information. This field can be optional.
 *          "sede"        : 0,                                                          An integer identifier that represents the working place related to the user whom we want to create his/her information. If the type user value is 1, this field can be optional.
 *          "usuario"     : 0                                                           An integer identifier that represents the user id related to the user whom we want to create his/her information.
 *		}
 *	
 *	@return
 *		A JSON string:
 *		{
 *			"msg" : "OK - Base64EncodeString(user information id)"
 *		}
 *
 *	@error
 *		A JSON string:
 *		{
 *			"msg" : "Error description"
 *		}
 *		Or an exception.
 */
exports.crearUsuarioD = function(req, res) {
	var user = typeof req.body.param !== undefined || req.body.param != null ? seguridad.decodeBase64(req.body.param) : null;
	
	var callback = function(id) {
		var sql = '', mensaje = '', resultado = '';
	
		if (connection) {
			sql =
				'SET @resultado = ""; ' +
				'CALL promociones.sp_crearUsuarioD(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, @resultado); ' +
				'SELECT @resultado;';
			
			connection.db.query(
				sql,
				[
					id,
					typeof req.body.documento  !== undefined || req.body.documento  != null                   ? req.body.documento  : null,
					typeof req.body.nombre     !== undefined || req.body.nombre     != null                   ? req.body.nombre     : null,
					typeof req.body.apellido   !== undefined || req.body.apellido   != null                   ? req.body.apellido   : null,
					req.body.correo,                                                                                                
					typeof req.body.tlfCasa    !== undefined || req.body.tlfCasa    != null                   ? req.body.tlfCasa    : null,
                    typeof req.body.tlfOficina !== undefined || req.body.tlfOficina != null                   ? req.body.tlfOficina : null,
					typeof req.body.tlfCelular !== undefined || req.body.tlfCelular != null                   ? req.body.tlfCelular : null,
					req.body.sexo,                                                                            
                    req.body.tipoUsuario,                                                                     
                    req.body.ciudad,                                                                          
                    typeof req.body.idioma     !== undefined || req.body.idioma     != null                   ? req.body.idioma     : null,
                    req.body.tipoUsuario > 1 && (typeof req.body.sede !== undefined || req.body.sede != null) ? req.body.sede       : null,
                    typeof req.body.usuario    !== undefined || req.body.usuario    != null                   ? req.body.usuario    : id
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
 *  Updates the information related to an user.
 *
 *	@param
 *		A request url parameter (an user session or id in Base64 related to the user that we want to update).
 *	@param
 *		A JSON request body (fields to update should be set with a value):
 *		{
 *			"param"       : "Base64EncodeString(xxxxy0z1-0000-zzz0-xyxy-10yy0xxy|1)",   A string in Base64 that represents an user session or id related to the user that creates the request.
 *          "documento"   : "XXXXX",                                                    A string that represents the document identifier related the user whom we want to create his/her information.
 *          "nombre"      : "XXXXX",                                                    A string that represents the name related to the user whom we want to create his/her information.
 *          "apellido"    : "XXXXX",                                                    A string that represents the last name related to the user whom we want to create his/her information.
 *          "correo"      : "XXXXX@XXXX.XXX",                                           A string that represents the e-mail related to the user whom we want to create his/her information.
 *          "tlfCasa"     : "XXXXX",                                                    A string that represents the telephone number related to the user whom we want to create his/her information.
 *          "tlfOficina"  : "XXXXX",                                                    A string that represents the office telephone number related to the user whom we want to create his/her information.
 *          "tlfCelular"  : "XXXXX",                                                    A string that represents the mobile telephone number related to the user whom we want to create his/her information.
 *          "sexo"        : 0,                                                          An integer identifier that represents the sex related to the user whom we want to create his/her information.
 *          "tipoUsuario" : 0,                                                          An integer identifier that represents the user type related to the user whom we want to create his/her information.
 *          "ciudad"      : 0,                                                          An integer identifier that represents the city related to the user whom we want to create his/her information.
 *          "idioma"      : 0,                                                          An integer identifier that represents the language related to the user whom we want to create his/her information.
 *          "sede"        : 0,                                                          An integer identifier that represents the working place related to the user whom we want to create his/her information.
 *          "activo"      : 1                                                           An integer that represents the user status (1 for active and 0 for inactive) related to the user whom we want to create his/her information.
 *		}
 *	
 *	@return
 *		A JSON string:
 *		{
 *			"msg" : "OK - Base64EncodeString(user information id)"
 *		}
 *
 *	@error
 *		A JSON string:
 *		{
 *			"msg" : "Error description"
 *		}
 *		Or an exception.
 */
exports.modificarUsuarioD = function(req, res) {
	var userD = seguridad.decodeBase64(req.params.val);
	
	var callback = function(data) {
		var sql = '', mensaje = '', resultado = '';
		
		if (connection) {
			sql =
				'SET @resultado = ""; ' +
				'CALL promociones.sp_modificarUsuarioD(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ? ,?, ?, ?, @resultado); ' +
				'SELECT @resultado;';
			
			connection.db.query(
				sql,
				[
					data[1],
					data[0],
					typeof req.body.documento   !== undefined || req.body.documento   != null ? req.body.documento   : null,
					typeof req.body.nombre      !== undefined || req.body.nombre      != null ? req.body.nombre      : null,
					typeof req.body.apellido    !== undefined || req.body.apellido    != null ? req.body.apellido    : null,
					typeof req.body.correo      !== undefined || req.body.correo      != null ? req.body.correo      : null,                                                                                                
					typeof req.body.tlfCasa     !== undefined || req.body.tlfCasa     != null ? req.body.tlfCasa     : null,
                    typeof req.body.tlfOficina  !== undefined || req.body.tlfOficina  != null ? req.body.tlfOficina  : null,
					typeof req.body.tlfCelular  !== undefined || req.body.tlfCelular  != null ? req.body.tlfCelular  : null,
                    typeof req.body.sexo        !== undefined || req.body.sexo        != null ? req.body.sexo        : null,                                                                            
                    typeof req.body.ciudad      !== undefined || req.body.ciudad      != null ? req.body.ciudad      : null,  
                    typeof req.body.idioma      !== undefined || req.body.idioma      != null ? req.body.idioma      : null,
                    typeof req.body.tipoUsuario !== undefined || req.body.tipoUsuario != null ? req.body.tipoUsuario : null,                                                                     
                    typeof req.body.tipoUsuario !== undefined && req.body.tipoUsuario > 1 && (typeof req.body.sede !== undefined || req.body.sede != null) ? req.body.sede : null,
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
			callback([userD, seguridad.decodeBase64(req.body.param)]);
		else
			Q.all([userD, utilidades.buscarIdUsuario(seguridad.decodeBase64(req.body.param))]).then(
				callback,
				function(err) {
					throw err;
				}
			);
	}
	else
		callback([userD, null]);
};

//exports.eliminarUsuarioD = function(req, res) {

//};