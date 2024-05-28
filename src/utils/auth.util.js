import dotenv from "dotenv";

dotenv.config();

export default class AuthUtil {
  static BCRYPT_SALT = Number(process.env.BCRYPT_SALT) || 4;
}