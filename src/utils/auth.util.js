import dotenv from "dotenv";

dotenv.config();

export default class AuthConfig {
  static JWT_SECRET = process.env.JWT_SECRET || 'JWT_SECRET';
}