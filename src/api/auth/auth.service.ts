import { IEmailJob, IVerifyEmailJob } from '@/common/interfaces/job.interface';
import { Uuid } from '@/common/types/common.type';
import { Branded } from '@/common/types/types';
import { AllConfigType } from '@/config/config.type';
import { SYSTEM_USER_ID } from '@/constants/app.constant';
import { CacheKey } from '@/constants/cache.constant';
import { ErrorCode } from '@/constants/error-code.constant';
import { JobName, QueueName } from '@/constants/job.constant';
import { ValidationException } from '@/exceptions/validation.exception';
import { createCacheKey } from '@/utils/cache.util';
import { hashPassword, verifyPassword } from '@/utils/password.util';
import validateDate from '@/utils/validate-date';
import { InjectQueue } from '@nestjs/bullmq';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Queue } from 'bullmq';
import { Cache } from 'cache-manager';
import { plainToInstance } from 'class-transformer';
import crypto from 'crypto';
import ms from 'ms';
import { Repository } from 'typeorm';
import { SessionEntity } from '../user/entities/session.entity';
import { UserEntity } from '../user/entities/user.entity';
import { EmailReqDto } from './dto/email.req.dto';
import { EmailResDto } from './dto/email.res.dto';
import { LoginReqDto } from './dto/login.req.dto';
import { LoginResDto } from './dto/login.res.dto';
import { RefreshReqDto } from './dto/refresh.req.dto';
import { RefreshResDto } from './dto/refresh.res.dto';
import { RegisterReqDto } from './dto/register.req.dto';
import { RegisterResDto } from './dto/register.res.dto';
import { JwtPayloadType } from './types/jwt-payload.type';
import { JwtRefreshPayloadType } from './types/jwt-refresh-payload.type';

type Token = Branded<
  {
    accessToken: string;
    refreshToken: string;
    tokenExpires: number;
  },
  'token'
>;

@Injectable()
export class AuthService {
  private readonly confirmEmailSecret: string;
  private readonly confirmEmailExpires: string;
  private readonly tokenSecret: string;
  private readonly tokenExpiresIn: string;
  private readonly refreshSecret: string;
  private readonly refreshExpires: string;
  private readonly forgotSecret: string;
  private readonly forgotExpires: string;

  constructor(
    private readonly configService: ConfigService<AllConfigType>,
    private readonly jwtService: JwtService,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    @InjectRepository(SessionEntity)
    private readonly sessionRepository: Repository<SessionEntity>,
    @InjectQueue(QueueName.EMAIL)
    private readonly emailQueue: Queue<IEmailJob, any, string>,
    @Inject(CACHE_MANAGER)
    private readonly cacheManager: Cache,
  ) {
    this.confirmEmailSecret = this.configService.getOrThrow(
      'auth.confirmEmailSecret',
      { infer: true },
    );
    this.confirmEmailExpires = this.configService.getOrThrow(
      'auth.confirmEmailExpires',
      { infer: true },
    );
    this.tokenSecret = this.configService.getOrThrow('auth.secret', {
      infer: true,
    });
    this.tokenExpiresIn = this.configService.getOrThrow('auth.expires', {
      infer: true,
    });
    this.refreshSecret = this.configService.getOrThrow('auth.refreshSecret', {
      infer: true,
    });
    this.refreshExpires = this.configService.getOrThrow('auth.refreshExpires', {
      infer: true,
    });
    this.forgotSecret = this.configService.getOrThrow('auth.forgotSecret', {
      infer: true,
    });
    this.forgotExpires = this.configService.getOrThrow('auth.forgotExpires', {
      infer: true,
    });
  }

  async signIn(dto: LoginReqDto): Promise<LoginResDto> {
    const user = await this.validateCredentials(dto.email, dto.password);
    const { session, hash } = await this.createUserSession(user.id);
    const token = await this.generateAuthTokens(user.id, session.id, hash);

    return plainToInstance(LoginResDto, {
      userId: user.id,
      username: user?.username,
      email: user?.email,
      bio: user?.bio,
      image: user?.image,
      isEmailVerified: validateDate(user?.emailVerifiedAt),
      ...token,
    });
  }

  async register(dto: RegisterReqDto): Promise<RegisterResDto> {
    await this.checkExistingEmail(dto.email);
    const user = await this.createUser(dto);
    const { session, hash } = await this.createUserSession(user.id);

    const token = await this.generateAuthTokens(user.id, session.id, hash);

    await this.sendEmailVerificationToken(user.id, dto.email);

    return plainToInstance(RegisterResDto, {
      userId: user.id,
      username: user?.username,
      email: user?.email,
      ...token,
    });
  }

  async logout(userToken: JwtPayloadType): Promise<void> {
    await this.cacheManager.store.set<boolean>(
      createCacheKey(CacheKey.SESSION_BLACKLIST, userToken.sessionId),
      true,
      userToken.exp * 1000 - Date.now(),
    );
    await SessionEntity.delete(userToken.sessionId);
  }

  async verifyEmailToken(token: string): Promise<boolean> {
    const payload = await this.verifyToken<JwtPayloadType>(
      token,
      this.confirmEmailSecret,
    );
    await this.validateCachedToken(
      CacheKey.EMAIL_VERIFICATION,
      payload.id,
      token,
    );
    await this.confirmUserEmail(payload.id as Uuid);

    return true;
  }

  async refreshToken(dto: RefreshReqDto): Promise<RefreshResDto> {
    const { sessionId, hash } = await this.verifyToken<JwtRefreshPayloadType>(
      dto.refreshToken,
      this.refreshSecret,
    );
    const session = await this.validateSession(sessionId, hash);
    const newHash = this.generateHash();

    await this.sessionRepository.update(session.id, { hash: newHash });
    return this.generateAuthTokens(session.userId, session.id, newHash);
  }

  async verifyAccessToken(token: string): Promise<JwtPayloadType> {
    const payload = await this.verifyToken<JwtPayloadType>(
      token,
      this.configService.getOrThrow('auth.secret', { infer: true }),
    );
    await this.checkSessionBlacklist(payload.sessionId);
    return payload;
  }

  async resendVerifyEmail(dto: EmailReqDto): Promise<EmailResDto> {
    const user = await this.userRepository.findOneBy({ email: dto.email });
    if (!user) throw new NotFoundException('User not found.');
    if (validateDate(user.emailVerifiedAt))
      return { message: 'Email already verified.' };

    const hasToken = await this.cacheManager.get<string>(
      createCacheKey(CacheKey.EMAIL_VERIFICATION, user.id),
    );
    if (hasToken)
      return {
        message:
          'There is already a recent verification email. Wait for the expiration time.',
      };

    await this.sendEmailVerificationToken(user.id, user.email);
    return { message: 'Verification email sent successfully.' };
  }

  async forgotPassword(dto: EmailReqDto): Promise<{ message: string }> {
    const user = await this.userRepository.findOneBy({ email: dto.email });
    if (!user) throw new NotFoundException('User not found.');

    const token = await this.createVerificationToken({
      id: user.id,
      secret: this.forgotSecret,
      expiresIn: this.forgotExpires,
    });

    await this.cacheManager.set(
      createCacheKey(CacheKey.PASSWORD_RESET, user.id),
      token,
      ms(this.forgotExpires),
    );

    await this.emailQueue.add(
      JobName.EMAIL_FORGOT_PASSWORD,
      { email: user.email, token } as IVerifyEmailJob,
      { attempts: 3 },
    );
    return { message: 'Recovery email sent.' };
  }

  async verifyForgotPassword(token: string): Promise<boolean> {
    const payload = await this.verifyToken<JwtPayloadType>(
      token,
      this.forgotSecret,
    );
    await this.validateCachedToken(CacheKey.PASSWORD_RESET, payload.id, token);
    return true;
  }

  async resetPassword(dto: {
    token: string;
    password: string;
  }): Promise<{ message: string }> {
    const payload = await this.verifyToken<JwtPayloadType>(
      dto.token,
      this.forgotSecret,
    );
    const cacheKey = createCacheKey(CacheKey.PASSWORD_RESET, payload.id);
    const cachedToken = await this.cacheManager.get<string>(cacheKey);

    if (!cachedToken)
      throw new UnauthorizedException('Expired or invalid token');
    if (cachedToken !== dto.token)
      throw new UnauthorizedException('Invalid token');

    const user = await this.userRepository.findOneBy({
      id: payload.id as Uuid,
    });
    if (!user) throw new NotFoundException('User not found.');
    const password = await hashPassword(dto.password);

    await this.userRepository.save({
      ...user,
      password,
    });

    await this.cacheManager.del(cacheKey);

    return { message: 'Password reset successfully.' };
  }

  private async validateCredentials(
    email: string,
    password: string,
  ): Promise<UserEntity> {
    const user = await this.userRepository.findOne({
      where: { email },
      select: ['id', 'username', 'email', 'bio', 'image', 'password'],
    });

    if (!user || !(await verifyPassword(password, user.password))) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return user;
  }

  private async checkExistingEmail(email: string): Promise<void> {
    const exists = await this.userRepository.exists({ where: { email } });
    if (exists) throw new ValidationException(ErrorCode.E003);
  }

  private async createUser(dto: RegisterReqDto): Promise<UserEntity> {
    const password = await hashPassword(dto.password);
    return this.userRepository.save({
      username: dto.username,
      email: dto.email,
      password,
      createdBy: SYSTEM_USER_ID,
      updatedBy: SYSTEM_USER_ID,
    });
  }

  private async createUserSession(
    userId: string,
  ): Promise<{ session: SessionEntity; hash: string }> {
    const hash = this.generateHash();
    const session = await this.sessionRepository.save({
      hash,
      userId,
      createdBy: SYSTEM_USER_ID,
      updatedBy: SYSTEM_USER_ID,
    });
    return { session, hash };
  }

  private generateHash(): string {
    return crypto
      .createHash('sha256')
      .update(randomStringGenerator())
      .digest('hex');
  }

  private async generateAuthTokens(
    id: string,
    sessionId: string,
    hash: string,
  ): Promise<Token> {
    const tokenExpires = Date.now() + ms(this.tokenExpiresIn);
    const [accessToken, refreshToken] = await Promise.all([
      await this.jwtService.signAsync(
        {
          id: id,
          // role: '', // TODO: add role
          sessionId: sessionId,
        },
        {
          secret: this.tokenSecret,
          expiresIn: this.tokenExpiresIn,
        },
      ),

      await this.jwtService.signAsync(
        {
          sessionId: sessionId,
          hash: hash,
        },
        {
          secret: this.refreshSecret,
          expiresIn: this.refreshExpires,
        },
      ),
    ]);
    return {
      accessToken,
      refreshToken,
      tokenExpires,
    } as Token;
  }

  private async verifyToken<T extends object>(
    token: string,
    secret: string,
  ): Promise<T> {
    try {
      return await this.jwtService.verify<T>(token, { secret });
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
  }

  private async validateCachedToken(
    cacheKeyPrefix: CacheKey,
    userId: string,
    token: string,
  ): Promise<void> {
    const cacheKey = createCacheKey(cacheKeyPrefix, userId);
    const cachedToken = await this.cacheManager.get<string>(cacheKey);

    if (!cachedToken)
      throw new UnauthorizedException('Expired or invalid token');
    if (cachedToken !== token) throw new UnauthorizedException('Invalid token');
  }

  private async confirmUserEmail(userId: Uuid): Promise<void> {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) throw new NotFoundException('User not found');
    if (validateDate(user.emailVerifiedAt)) return;

    await this.userRepository.save({ ...user, emailVerifiedAt: new Date() });

    await this.emailQueue.add(
      JobName.EMAIL_AFTER_VERIFICATION,
      { email: user.email, userName: user.username },
      { attempts: 3, backoff: { type: 'exponential', delay: 60000 } },
    );

    await this.cacheManager.del(
      createCacheKey(CacheKey.EMAIL_VERIFICATION, userId),
    );
  }

  private async validateSession(
    sessionId: Uuid,
    hash: string,
  ): Promise<SessionEntity> {
    const session = await this.sessionRepository.findOneBy({
      id: sessionId,
    });
    if (!session || session.hash !== hash)
      throw new UnauthorizedException('Invalid session');
    return session;
  }

  private async checkSessionBlacklist(sessionId: string): Promise<void> {
    const isBlacklisted = await this.cacheManager.get<boolean>(
      createCacheKey(CacheKey.SESSION_BLACKLIST, sessionId),
    );
    if (isBlacklisted) throw new UnauthorizedException('Session invalidated');
  }

  private async sendEmailVerificationToken(
    userId: string,
    email: string,
  ): Promise<void> {
    const token = await this.createVerificationToken({
      id: userId,
      secret: this.confirmEmailSecret,
      expiresIn: this.confirmEmailExpires,
    });

    const tokenExpiresIn = this.configService.getOrThrow(
      'auth.confirmEmailExpires',
      {
        infer: true,
      },
    );

    await this.cacheManager.set(
      createCacheKey(CacheKey.EMAIL_VERIFICATION, userId),
      token,
      ms(tokenExpiresIn),
    );

    await this.emailQueue.add(
      JobName.EMAIL_VERIFICATION,
      {
        email,
        token,
      } as IVerifyEmailJob,
      {
        attempts: 3,
        backoff: { type: 'exponential', delay: 60000 },
      },
    );
  }

  private async createVerificationToken(data: {
    id: string;
    secret: string;
    expiresIn: string;
  }): Promise<string> {
    return this.jwtService.signAsync(
      {
        id: data.id,
      },
      {
        secret: data.secret,
        expiresIn: data.expiresIn,
      },
    );
  }

  private buildLoginResponse(user: UserEntity, token: Token): LoginResDto {
    return plainToInstance(LoginResDto, {
      userId: user.id,
      email: user.email,
      isEmailVerified: validateDate(user.emailVerifiedAt),
      username: user?.username,
      bio: user?.bio,
      image: user?.image,
      ...token,
    });
  }
}
