import dotenv from "dotenv";

dotenv.config();

export default class AuthUtil {
  static BCRYPT_SALT = Number(process.env.BCRYPT_SALT) || 4;
  static UserType = {
    Student: 'Student',
    Teacher: 'Teacher',
    Admin: 'Admin',
  };
  static checkManager(type) {
    switch (type) {
      default:
      case AuthUtil.UserType.Student: {
        return false;
      }
      case AuthUtil.UserType.Admin:
      case AuthUtil.UserType.Teacher: {
        return true;
      }
    }
  }
}