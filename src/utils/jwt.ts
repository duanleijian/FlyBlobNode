const jwt = require('jsonwebtoken');
const privateKey = '3486u34jidsjkofsdkf213123';
export function createToken(payload, date) {
  // return jwt.sign(payload, privateKey, { expiresIn: date ? date : 60 * 60 });
  return jwt.sign(
    {
      ...payload,
      // exp: Math.floor(Date.now() / 1000) + (date ? date : 60),
    },
    privateKey,
    { expiresIn: date ? date : 60 * 60 },
  );
}
export function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, privateKey);
    return { decoded, err: null };
  } catch (err) {
    return { decoded: null, err };
  }
}
