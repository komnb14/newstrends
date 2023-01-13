import db from '../lib/db.js';
import bcrypt from 'bcrypt';
import AppError, { isAppError } from '../lib/AppError.js';
import { generateToken } from '../lib/tokens.js';
import { User } from '@prisma/client';

interface AuthParams {
  username: string;
  password: string;
}

const SALT_ROUNDS = 10;

class UserService {
  private static instance: UserService;

  public static getInstance() {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  async generateTokens(user: User) {
    const { id: userId, username } = user;
    const [accessToken, refreshToken] = await Promise.all([
      generateToken({
        type: 'access_token',
        tokenId: 1,
        userId: userId,
        username: username,
      }),
      generateToken({
        type: 'refresh_token',
        tokenId: 1,
        rotationCounter: 1,
      }),
    ]);

    return {
      accessToken: accessToken,
      refreshToken: refreshToken,
    };
  }

  async register({ username, password }: AuthParams) {
    const exists = await db.user.findUnique({
      where: {
        username,
      },
    });
    if (exists) {
      throw new AppError('UserExistsError');
    }
    const hash = await bcrypt.hash(password, SALT_ROUNDS);
    const user = await db.user.create({
      data: {
        username,
        passwordHash: hash,
      },
    });
    const tokens = await this.generateTokens(user);
    return {
      user: user,
      tokens: tokens,
    };
  }

  async login({ username, password }: AuthParams) {
    const user = await db.user.findUnique({
      where: {
        username,
      },
    });
    if (!user) {
      throw new AppError('AuthenticationError');
    }
    try {
      const result = await bcrypt.compare(password, user.passwordHash);

      if (!result) {
        // noinspection ExceptionCaughtLocallyJS
        throw new AppError('AuthenticationError');
      }
    } catch (e) {
      if (isAppError(e)) {
        throw e;
      } else {
        throw new AppError('UnknownError');
      }
    }

    const tokens = await this.generateTokens(user);
    return {
      user,
      tokens: tokens,
    };
  }
}

export default UserService;
