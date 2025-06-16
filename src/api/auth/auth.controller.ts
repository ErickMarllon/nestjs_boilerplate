import { AllConfigType } from '@/config/config.type';
import { CurrentUser } from '@/decorators/current-user.decorator';
import { ApiAuth, ApiPublic } from '@/decorators/http.decorators';
import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { EmailReqDto } from './dto/email.req.dto';
import { EmailResDto } from './dto/email.res.dto';
import { ForgotResetReqDto, ForgotTokenReqDto } from './dto/forgot.req.dto';
import { LoginReqDto } from './dto/login.req.dto';
import { LoginResDto } from './dto/login.res.dto';
import { RefreshReqDto } from './dto/refresh.req.dto';
import { RefreshResDto } from './dto/refresh.res.dto';
import { RegisterReqDto } from './dto/register.req.dto';
import { RegisterResDto } from './dto/register.res.dto';
import { JwtPayloadType } from './types/jwt-payload.type';

@ApiTags('auth')
@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly configService: ConfigService<AllConfigType>,
  ) {}

  @ApiPublic({
    type: LoginResDto,
    summary: 'Sign in',
  })
  @Post('email/login')
  async signIn(@Body() userLogin: LoginReqDto): Promise<LoginResDto> {
    return await this.authService.signIn(userLogin);
  }

  @ApiPublic()
  @Post('email/register')
  async register(@Body() dto: RegisterReqDto): Promise<RegisterResDto> {
    return await this.authService.register(dto);
  }

  @ApiPublic()
  @Post('refresh')
  async refresh(@Body() dto: RefreshReqDto): Promise<RefreshResDto> {
    return await this.authService.refreshToken(dto);
  }

  @ApiAuth({
    summary: 'Logout',
    errorResponses: [400, 401, 403, 500],
  })
  @Post('logout')
  async logout(@CurrentUser() token: JwtPayloadType): Promise<void> {
    await this.authService.logout(token);
  }

  @ApiPublic({
    type: RefreshResDto,
    summary: 'Refresh token',
  })
  @Get('verify/email')
  async verifyEmail(@Query('token') token: string): Promise<EmailResDto> {
    await this.authService.verifyEmailToken(token);

    // const baseUrl = `${this.configService.get('web.url', { infer: true })}`;
    // let redirectUrl = `${baseUrl}/erro`;
    // try {
    // const isValid = await this.authService.verifyEmailToken(token);
    // redirectUrl = isValid ? `${baseUrl}/sucesso` : `${baseUrl}/erro`;
    // } catch (error) {
    // console.error('Erro ao verificar token de e-mail:', error);
    // }

    return { message: 'Email verification successful. You can now log in.' };
  }

  @ApiPublic()
  @Post('verify/email/resend')
  async resendVerifyEmail(@Body() input: EmailReqDto): Promise<EmailResDto> {
    return await this.authService.resendVerifyEmail(input);
  }

  @ApiPublic()
  @Post('forgot-password')
  async forgotPassword(@Body() dto: EmailReqDto): Promise<EmailResDto> {
    return await this.authService.forgotPassword(dto);
  }

  @ApiPublic()
  @Post('verify/forgot-password')
  async verifyForgotPassword(@Body() dto: ForgotTokenReqDto): Promise<boolean> {
    return await this.authService.verifyForgotPassword(dto.token);
  }

  @ApiPublic()
  @Post('reset-password')
  async resetPassword(@Body() dto: ForgotResetReqDto): Promise<EmailResDto> {
    return await this.authService.resetPassword(dto);
  }
}
