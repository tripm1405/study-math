export default class BlocklyUtil {
  static BCRYPT_SALT = Number(process.env.BCRYPT_SALT) || 4;
}