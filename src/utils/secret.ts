const CryptoJS = require('crypto-js');
/**
 * AES-256-ECB对称加密
 * @param text {string} 要加密的明文
 * @param secretKey {string} 密钥，43位随机大小写与数字
 * @returns {string} 加密后的密文，Base64格式
 */
const secretKey = 'KUf4hM5rThssysJhcRFCfxLR8Imihjl0eMsyhh1M7Wk';
export function AES_ECB_ENCRYPT(text) {
  const keyHex = CryptoJS.enc.Base64.parse(secretKey);
  const messageHex = CryptoJS.enc.Utf8.parse(text);
  const encrypted = CryptoJS.AES.encrypt(messageHex, keyHex, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  });
  return encrypted.toString();
}

/**
 * AES-256-ECB对称解密
 * @param textBase64 {string} 要解密的密文，Base64格式
 * @param secretKey {string} 密钥，43位随机大小写与数字
 * @returns {string} 解密后的明文
 */
export function AES_ECB_DECRYPT(textBase64) {
  const keyHex = CryptoJS.enc.Base64.parse(secretKey);
  const decrypt = CryptoJS.AES.decrypt(textBase64, keyHex, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  });
  return CryptoJS.enc.Utf8.stringify(decrypt);
}
