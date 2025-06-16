import { ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RegisterReqDto } from './dto/register.req.dto';
import { RegisterResDto } from './dto/register.res.dto';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;
  let authServiceValue: Partial<Record<keyof AuthService, jest.Mock>>;

  beforeAll(async () => {
    authServiceValue = {
      signIn: jest.fn(),
      register: jest.fn(),
      logout: jest.fn(),
      refreshToken: jest.fn(),
      resendVerifyEmail: jest.fn(),
      forgotPassword: jest.fn(),
      resetPassword: jest.fn(),
      verifyAccessToken: jest.fn(),
      verifyEmailToken: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: authServiceValue,
        },
        ConfigService,
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
    expect(service).toBeDefined();
  });

  describe('POST /auth/email/register', () => {
    const mockRegisterReqDto: RegisterReqDto = {
      email: 'test@example.com',
      password: 'Password123!',
      username: 'test user',
    };

    const mockRegisterResDto = plainToInstance(RegisterResDto, {
      userId: 'uuid-12345',
      username: 'testuser',
      email: 'test@example.com',
      accessToken: 'access_token',
      refreshToken: 'refresh_token',
      tokenExpires: Date.now() + 10 * 60 * 1000,
    });

    describe('Successful Behavior', () => {
      beforeEach(() => {
        authServiceValue.register.mockResolvedValue(mockRegisterResDto);
      });

      it('should register a new user successfully', async () => {
        const result = await controller.register(mockRegisterReqDto);
        expect(result).toEqual(mockRegisterResDto);
        expect(authServiceValue.register).toHaveBeenCalledWith(
          mockRegisterReqDto,
        );
      });

      it('should return response in correct format', async () => {
        const result = await controller.register(mockRegisterReqDto);
        const expectedKeys = [
          'userId',
          'username',
          'email',
          'accessToken',
          'refreshToken',
          'tokenExpires',
        ];

        expectedKeys.forEach((key) => {
          expect(result).toHaveProperty(key);
        });
      });

      it('should return a RegisterResDto', async () => {
        const result = await controller.register(mockRegisterReqDto);
        expect(result).toBeInstanceOf(RegisterResDto);
      });

      it('should call register method once', async () => {
        await controller.register(mockRegisterReqDto);
        expect(authServiceValue.register).toHaveBeenCalledTimes(1);
      });

      it('should match the DTO structure strictly', async () => {
        const result = await controller.register(mockRegisterReqDto);

        expect(result).toEqual(
          expect.objectContaining({
            userId: expect.any(String),
            username: expect.any(String),
            email: expect.any(String),
            accessToken: expect.any(String),
            refreshToken: expect.any(String),
            tokenExpires: expect.any(Number),
          }),
        );
      });

      it('should return a tokenExpires in the expected future window', async () => {
        const result = await controller.register(mockRegisterReqDto);
        const now = Date.now();
        const tenMinutes = 10 * 60 * 1000;
        const nineMinutes = 9 * 60 * 1000;

        expect(result.tokenExpires).toBeGreaterThanOrEqual(now + nineMinutes);
        expect(result.tokenExpires).toBeLessThanOrEqual(now + tenMinutes + 500);
      });
    });

    describe('Expected Service Errors', () => {
      it('should propagate duplicate email error', async () => {
        const error = new Error('Email already registered');
        authServiceValue.register.mockRejectedValue(error);

        await expect(controller.register(mockRegisterReqDto)).rejects.toThrow(
          'Email already registered',
        );
      });

      it('should reject DTO with invalid structure', async () => {
        const invalidDto = {
          ...mockRegisterReqDto,
          password: undefined,
        } as any;
        const error = new Error('Invalid data');
        authServiceValue.register.mockRejectedValue(error);

        await expect(controller.register(invalidDto)).rejects.toThrow();
        expect(service.register).toHaveBeenCalledWith(invalidDto);
      });
    });

    describe('Unhandled Exceptions', () => {
      it('should propagate unexpected errors from AuthService.register', async () => {
        const errorMessage = 'Unexpected failure';
        authServiceValue.register.mockRejectedValue(new Error(errorMessage));

        await expect(controller.register(mockRegisterReqDto)).rejects.toThrow(
          errorMessage,
        );
      });
    });
  });

  describe('RegisterReqDto validation', () => {
    let dto: RegisterReqDto;

    beforeEach(() => {
      dto = {
        email: 'test@example.com',
        password: 'Password123!',
        username: 'test user',
      };
    });

    it('should fail with empty email', async () => {
      dto.email = '';
      const errors: ValidationError[] = await validate(
        plainToInstance(RegisterReqDto, dto),
      );
      expect(errors.length).toEqual(1);
      expect(errors[0].property).toBe('email');
    });

    it('should fail with invalid email format', async () => {
      dto.email = 'invalid-email';
      const errors: ValidationError[] = await validate(
        plainToInstance(RegisterReqDto, dto),
      );
      expect(errors.length).toEqual(1);
      expect(errors[0].constraints).toEqual({
        isEmail: 'email must be an email',
      });
    });

    it('should fail with empty password', async () => {
      dto.password = '';
      const errors: ValidationError[] = await validate(
        plainToInstance(RegisterReqDto, dto),
      );
      expect(errors.length).toEqual(1);
      expect(errors[0].constraints?.minLength).toBe(
        'password must be longer than or equal to 6 characters',
      );
    });

    it('should fail with empty username', async () => {
      dto.username = '';
      const errors: ValidationError[] = await validate(
        plainToInstance(RegisterReqDto, dto),
      );
      expect(errors.length).toBeGreaterThan(0);
      expect(errors[0].property).toBe('username');
    });
  });
});
