import { Test, TestingModule } from "@nestjs/testing";
import { AuthService } from "./auth.service";
import { JwtService } from "@nestjs/jwt";
import { getRepositoryToken } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import * as bcrypt from "bcryptjs";
import { User } from "./auth.entity";
import { NotFoundException, UnauthorizedException } from "@nestjs/common";

const mockUser: User = {
  id: 1,
  email: "test@example.com",
  password: "hashedPassword",
  nickname: "TestUser",
  deletedAt: null,
} as User;

describe("AuthService", () => {
  let authService: AuthService;
  let userRepository: Repository<User>;
  let jwtService: JwtService;

  beforeEach(async () => {
    const mockUserRepository = {
      findOne: jest.fn(),
      create: jest.fn(),
      save: jest.fn(),
      softRemove: jest.fn(),
      restore: jest.fn(),
      createQueryBuilder: jest.fn(() => ({
        where: jest.fn().mockReturnThis(),
        withDeleted: jest.fn().mockReturnThis(),
        getOne: jest.fn(),
      })),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        {
          provide: JwtService,
          useValue: {
            sign: jest.fn(() => "mockAccessToken"),
            verify: jest.fn(),
            decode: jest.fn(),
          },
        },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    jwtService = module.get<JwtService>(JwtService);
  });

  /** =======================
   *  1️⃣ 회원가입 테스트 (register)
   *  ======================= */
  describe("register", () => {
    it("새로운 유저를 등록하고 토큰을 반환해야 함", async () => {
      jest.spyOn(userRepository, "findOne").mockResolvedValue(null);
      jest.spyOn(userRepository, "create").mockReturnValue(mockUser);
      jest.spyOn(userRepository, "save").mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, "hash").mockResolvedValue("hashedPassword");

      const result = await authService.register(
        "test@example.com",
        "password",
        "TestUser"
      );

      expect(result).toHaveProperty("access_token");
      expect(result).toHaveProperty("user");
      expect(result.user.email).toBe("test@example.com");
    });

    it("이미 가입된 유저일 경우 예외 발생", async () => {
      jest.spyOn(userRepository, "createQueryBuilder").mockReturnValue({
        where: jest.fn().mockReturnThis(),
        withDeleted: jest.fn().mockReturnThis(),
        getOne: jest.fn().mockResolvedValue(mockUser),
      } as any);

      await expect(
        authService.register("test@example.com", "password", "TestUser")
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  /** =======================
   *  2️⃣ 사용자 검증 테스트 (validateUser)
   *  ======================= */
  describe("validateUser", () => {
    it("올바른 이메일과 비밀번호를 입력하면 유저 정보를 반환해야 함", async () => {
      jest.spyOn(userRepository, "findOne").mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, "compare").mockResolvedValue(true);

      const result = await authService.validateUser(
        "test@example.com",
        "password"
      );
      expect(result).toEqual(mockUser);
    });

    it("이메일이 존재하지 않으면 예외 발생", async () => {
      jest.spyOn(userRepository, "findOne").mockResolvedValue(null);

      await expect(
        authService.validateUser("wrong@example.com", "password")
      ).rejects.toThrow(NotFoundException);
    });

    it("비밀번호가 일치하지 않으면 null 반환", async () => {
      jest.spyOn(userRepository, "findOne").mockResolvedValue(mockUser);
      jest.spyOn(bcrypt, "compare").mockResolvedValue(false);

      const result = await authService.validateUser(
        "test@example.com",
        "wrongPassword"
      );
      expect(result).toBeNull();
    });
  });

  /** =======================
   *  4️⃣ 로그인 테스트 (login)
   *  ======================= */
  describe("login", () => {
    it("이메일과 비밀번호가 일치하면 토큰을 반환해야 함", async () => {
      jest.spyOn(authService, "findByEmail").mockResolvedValue(mockUser);
      jest.spyOn(authService, "validateUser").mockResolvedValue(mockUser);

      const result = await authService.login("test@example.com", "password");
      expect(result).toHaveProperty("access_token");
      expect(result.user.email).toBe("test@example.com");
    });

    it("유효하지 않은 사용자면 예외 발생", async () => {
      jest.spyOn(userRepository, "findOne").mockResolvedValue(null);

      await expect(
        authService.login("test@example.com", "wrongPassword")
      ).rejects.toThrow(NotFoundException);
    });
  });

  /** =======================
   *  5️⃣ 닉네임 변경 테스트 (updateNickname)
   *  ======================= */
  describe("updateNickname", () => {
    it("유저의 닉네임을 변경해야 함", async () => {
      jest.spyOn(userRepository, "findOne").mockResolvedValue(mockUser);
      jest
        .spyOn(userRepository, "save")
        .mockResolvedValue({ ...mockUser, nickname: "NewNickname" });

      const result = await authService.updateNickname(1, "NewNickname");
      expect(result.nickname).toBe("NewNickname");
    });

    it("존재하지 않는 유저는 예외 발생", async () => {
      jest.spyOn(userRepository, "findOne").mockResolvedValue(null);

      await expect(
        authService.updateNickname(999, "NewNickname")
      ).rejects.toThrow(NotFoundException);
    });
  });

  /** =======================
   *  6️⃣ 계정 삭제 테스트 (deleteProfile)
   *  ======================= */
  describe("deleteProfile", () => {
    it("유저 계정을 soft-delete 해야 함", async () => {
      jest.spyOn(userRepository, "findOne").mockResolvedValue(mockUser);
      jest.spyOn(userRepository, "softRemove").mockResolvedValue(mockUser);

      const result = await authService.deleteProfile(1);
      expect(result).toEqual(mockUser);
    });

    it("존재하지 않는 유저는 예외 발생", async () => {
      jest.spyOn(userRepository, "findOne").mockResolvedValue(null);

      await expect(authService.deleteProfile(999)).rejects.toThrow(
        NotFoundException
      );
    });
  });
});
