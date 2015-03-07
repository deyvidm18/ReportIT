var connection = require('../config/db'),
	utilidades = require('../utils/utilidades'),
    seguridad  = require('../utils/seguridad');
	
/**
 *	HttpPost
 *
 *  Creates a session unique id.
 *
 *	@param 
 *		A JSON request body:
 *		{
 *			"usuario_n" : "example",	A string that represents an user name.
 *			"usuario_p" : "123456"		A string that represents an user password.
 *		}
 *	
 *	@return
 *		A JSON string:
 *		{
 *			"fechaI"  : "YYYY-MM-DD HH:mm:ss",                                  A string that represents the session start datetime.
 *			"fechaUO" : "YYYY-MM-DD HH:mm:ss",                                  A string that represents the session last operation datetime.
 *			"sesion"  : "Base64EncodeString(xxxxy0z1-0000-zzz0-xyxy-10yy0xxy)"  A string that represents the session created.
 *		}
 *
 *	@error
 *		A JSON string:
 *		{
 *			"msg" : "Error description"
 *		}
 *		Or an exception.
 */
exports.autenticar = function(req, res) {
    var sql = '', mensaje = '', resultado = '';
    
    if (connection) {
		sql =
			'SET @resultado = ""; ' +
            'CALL promociones.sp_autenticarUsuario(?, ?, @resultado); ' +
            'SELECT @resultado;';
			
        connection.db.query(
            sql,
			//[
			//	seguridad.encodeAES(seguridad.SHA512(req.body.usuario_n), req.body.usuario_p),
			//	seguridad.encodeAES(seguridad.SHA512(req.body.usuario_p), req.body.usuario_p)
			//],
            [req.body.usuario_n, req.body.usuario_p],
            function(err, result) {
                if (err) throw err;
                mensaje   = result[3][0]['@resultado'];
                resultado = result[1][0]['res'];
                
                if ((/ERROR/g).test(mensaje)) {
                    res.contentType('application/json');
                    res.write(JSON.stringify({ msg : mensaje }));
                    res.end();
                }
                else {
                    (
                        function(id) {
							sql = 
								'SELECT ' +
									'S.sesion AS sesion, ' +
									'DATE_FORMAT(S.fechaInicio, "%Y-%m-%d %H:%i:%s") AS fechaI, ' +
									'DATE_FORMAT(S.fechaUltimaOp, "%Y-%m-%d %H:%i:%s") AS fechaUO ' +
								'FROM ' +
									'promociones.tb_sesion AS S ' +
								'WHERE ' +
									'S.id_sesion = ?;';
						
                            connection.db.query(
                                sql,
                                [id],
                                function(err, result) {
                                    if (err) throw err;
									result[0].sesion = seguridad.encodeBase64(result[0].sesion);								
                                    res.contentType('application/json');
                                    res.write(JSON.stringify(result[0]));
                                    res.end();
                                }
                            );       
                        }
                    )(resultado);
                }
            }
        );
    }
};

/**
 *	HttpPost
 *
 *  Updates a session unique id previously created.
 *
 *	@param 
 *		A JSON request body:
 *		{
 *			"param" : "Base64EncodeString(xxxxy0z1-0000-zzz0-xyxy-10yy0xxy)"	A string in Base64 that represents an user session.
 *		}
 *	
 *	@return
 *		A JSON string:
 *		A JSON string:
 *		{
 *			"fechaI"  : "YYYY-MM-DD HH:mm:ss",                                  A string that represents the session start datetime.
 *			"fechaUO" : "YYYY-MM-DD HH:mm:ss",                                  A string that represents the session last operation datetime.
 *			"sesion"  : "Base64EncodeString(xxxxy0z1-0000-zzz0-xyxy-10yy0xxy)"  A string that represents the session updated.
 *		}
 *
 *	@error
 *		A JSON string:
 *		{
 *			"msg" : "Error description"
 *		}
 *		Or an exception.
 */
exports.reautenticar = function(req, res) {
    var callback = function(id) {
        var sql = '', mensaje = '', resultado = '';

        if (connection) {
            sql =
                'SET @resultado = ""; ' +
                'CALL promociones.sp_reautenticarUsuario(?, @resultado); ' +
                'SELECT @resultado;';
        
            connection.db.query(
                sql,
                [id],
                function(err, result) {
                    if (err) throw err;
                    mensaje   = result[3][0]['@resultado'];
                    resultado = result[1][0]['res'];
                    
                    if ((/ERROR/g).test(mensaje)) {
                        res.contentType('application/json');
                        res.write(JSON.stringify({ msg : mensaje }));
                        res.end();
                    }
                    else {
                        (
                            function(id) {
                                sql =
                                    'SELECT ' +
                                        'S.sesion AS sesion, ' +
                                        'DATE_FORMAT(S.fechaInicio, "%Y-%m-%d %H:%i:%s") AS fechaI, ' +
                                        'DATE_FORMAT(S.fechaUltimaOp, "%Y-%m-%d %H:%i:%s") AS fechaUO ' +
                                    'FROM ' +
                                        'promociones.tb_sesion AS S ' +
                                    'WHERE ' +
                                        'S.id_sesion = ?;';
                                        
                                connection.db.query(
                                    sql,
                                    [id],
                                    function(err, result) {
                                        if (err) throw err;
                                        res.contentType('application/json');
                                        result[0].sesion = seguridad.encodeBase64(result[0].sesion);
                                        res.write(JSON.stringify(result[0]));
                                        res.end();
                                    }
                                );       
                            }
                        )(resultado);
                    }
                }
            );
        }
    };
    
    utilidades.buscarIdUsuario(seguridad.decodeBase64(req.body.param)).then(
        callback,
        function(err) {
            throw err;
        }
    );        
};

/**
 *	HttpPost
 *
 *  Disables a session unique id previously created.
 *
 *	@param 
 *		A JSON request body:
 *		{
 *			"param" : "Base64EncodeString(xxxxy0z1-0000-zzz0-xyxy-10yy0xxy)"    A string in Base64 that represents an user session.
 *		}
 *	
 *	@return
 *		A JSON string:
 *		{
 *			"msg" : "OK - Base64EncodeString(session id)"
 *		}
 *
 *	@error
 *		A JSON string:
 *		{
 *			"msg" : "Error description"
 *		}
 *		Or an exception.
 */
exports.desautenticar = function(req, res) {
	var callback = function(id) {
        var sql = '', mensaje = '', resultado = '';
		
		if (connection) {
			sql =
				'SET @resultado = ""; ' +
				'CALL promociones.sp_desautenticarUsuario(?, @resultado); ' +
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
    
    utilidades.buscarIdUsuario(seguridad.decodeBase64(req.body.param)).then(
        callback,
        function(err) {
            throw err;
        }
    );
};