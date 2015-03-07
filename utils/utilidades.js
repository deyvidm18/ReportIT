var connection = require('../config/db'),
    Q          = require('q');

exports.buscarIdPerfilUsuario = function(sesion) {
    var deferred = Q.defer();
    var sql = '';
	var resultado = {
		usuario  : -1,
		perfil   : -1,
		usuariod : -1
	};
		
    if (connection) {
		sql =
			'SELECT ' +
				'IFNULL(S.id_usuario   , -1) AS usuario, ' +
				'IFNULL(UP.id_perfil   , -1) AS perfil, ' +
				'IFNULL(UUD.id_usuariod, -1) AS usuariod ' +
			'FROM ' +
				'promociones.tb_sesion AS S ' +
				'INNER JOIN ' +
				'promociones.tb_usuario_perfil UP ' +
				'ON S.id_usuario = UP.id_usuario ' +
				'LEFT OUTER JOIN ' +
				'promociones.tb_usuario_usuarioD UUD ' +
				'ON S.id_usuario = UUD.id_usuario ' +
			'WHERE ' +
				'S.sesion = ? AND S.activo = 1;';
		
        connection.db.query(
            sql,
            [sesion],
            function(err, result) {
                if (err) deferred.reject(err);
				if (result.length > 0) resultado = result[0];
                deferred.resolve(resultado);
            }
        );
        
        return deferred.promise;
    }
};
    
exports.buscarIdUsuario = function(sesion) {
    var deferred = Q.defer();

    this.buscarIdPerfilUsuarioX(sesion).then(
        function(data) {
            deferred.resolve(data.usuario);
        },
        function(err) {
            deferred.reject(err);
        }
    );
    
    return deferred.promise;
};

exports.buscarIdPerfil = function(sesion, callback) {
	var deferred = Q.defer();

    this.buscarIdPerfilUsuarioX(sesion).then(
        function(data) {
            deferred.resolve(data.perfil);
        },
        function(err) {
            deferred.reject(err);
        }
    );
    
    return deferred.promise;
};

exports.buscarIdUsuarioD = function(sesion, callback) {
	var deferred = Q.defer();

    this.buscarIdPerfilUsuarioX(sesion).then(
        function(data) {
            deferred.resolve(data.usuariod);
        },
        function(err) {
            deferred.reject(err);
        }
    );
    
    return deferred.promise;
};

exports.buscarIdDispositivo = function(identificador) {
    var deferred = Q.defer();
    var sql = '';
		
    if (connection) {
		sql =
			'SELECT ' +
				'IFNULL(D.id_dispositivo, -1) AS dispostivo ' +
			'FROM ' +
				'promociones.tb_dispositivo AS D ' +
			'WHERE ' +
				'D.identificacion = ?;';
		
        connection.db.query(
            sql,
            [identificador],
            function(err, result) {
                if (err) deferred.reject(err);
				deferred.resolve(result[0].dispostivo);
            }
        );
    }
    
    return deferred.promise;
};