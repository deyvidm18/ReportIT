var CryptoJS = require('crypto-js');

var key = '123pollitoingles',
	cfg = 'qwert256';

/* Base64 coding */
exports.encodeBase64 = function(normalString) {
	return CryptoJS.enc.Base64.stringify(CryptoJS.enc.Utf8.parse(normalString));
};

exports.decodeBase64 = function(base64String) {
	return CryptoJS.enc.Base64.parse(base64String).toString(CryptoJS.enc.Utf8);
};

/* AES coding */
exports.encodeAES = function(normalString, key) {
	return CryptoJS.AES.encrypt(
		normalString, 
		typeof key !== undefined ? key : this.key,
		this.cfg
	);
};

exports.decodeAES = function(cipherString, key) {
	return CryptoJS.AES.decrypt(
		cipherString, 
		typeof key !== undefined ? key : this.key,
		this.cfg
	);
};

/* 3DES coding */
exports.encode3DES = function(normalString, key) {
	return CryptoJS.TripleDES.encrypt(
		normalString, 
		typeof key !== undefined ? key : this.key,
		this.cfg
	);
};

exports.decode3DES = function(cipherString, key) {
	return CryptoJS.TripleDES.decrypt(
		cipherString, 
		typeof key !== undefined ? key : this.key,
		this.cfg
	);
};

/* MD5 hashing */
exports.MD5 = function(text, key) {
	return typeof key !== undefined ? CryptoJS.HmacMD5(text, key) : CryptoJS.MD5(text);
};

/* SHA1 hashing */
exports.SHA1 = function(text, key) {
	return typeof key !== undefined ? CryptoJS.HmacSHA1(text, key) : CryptoJS.SHA1(text);
};

/* SHA224 hashing */
exports.SHA224 = function(text, key) {
	return typeof key !== undefined ? CryptoJS.HmacSHA224(text, key) : CryptoJS.SHA224(text);
};

/* SHA256 hashing */
exports.SHA256 = function(text, key) {
	return typeof key !== undefined ? CryptoJS.HmacSHA256(text, key) : CryptoJS.SHA256(text);
};

/* SHA3 hashing */
exports.SHA3 = function(text, key) {
	return typeof key !== undefined ? CryptoJS.HmacSHA3(text, key) : CryptoJS.SHA3(text);
};

/* SHA384 hashing */
exports.SHA384 = function(text, key) {
	return typeof key !== undefined ? CryptoJS.HmacSHA384(text, key) : CryptoJS.SHA384(text);
};

/* SHA512 hashing */
exports.SHA512 = function(text, key) {
	return typeof key !== undefined ? CryptoJS.HmacSHA512(text, key) : CryptoJS.SHA512(text);
};