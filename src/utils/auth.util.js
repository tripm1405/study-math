import dotenv from "dotenv";

dotenv.config();

export default class AuthUtil {
  static BCRYPT_SALT = Number(process.env.BCRYPT_SALT) || 4;
  static UserType = {
    HocSinh: 'HocSinh',
    GiaoVien: 'GiaoVien',
  };
  static currentUser = {
    fullName: 'Khả Vy',
    type: AuthUtil.UserType.HocSinh,
  };
}