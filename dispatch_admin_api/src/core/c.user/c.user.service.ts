import { Injectable } from '@nestjs/common';
import { CreateCUserDto } from './dto/create-c.user.dto';
import { UpdateCUserDto } from './dto/update-c.user.dto';
import { CUserEntity } from './entities/c.user.entity';
import { PrismaService } from 'src/config/core/prisma/prisma.service';
import { CustomException } from 'src/config/core/exceptions/custom.exception';
import { ExceptionCodeList } from 'src/config/core/exceptions/exception.code';
import { EmailLoginDto } from '../c.auth/dto/email.login.dto';
import { Role } from '@prisma/client';
import { FindUserDto } from './dto/find.user.dto';

interface FindResposeDto<T> {
  count: number;
  size: number;
  page: number;
  data: T;
}

@Injectable()
export class CUserService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * 사용자 생성
   * @param createCUserDto
   * @returns
   */
  async create(createCUserDto: CreateCUserDto): Promise<CUserEntity> {
    // 사용자 존재 하는지 이메일로 확인
    const users: CUserEntity[] = await this.prisma.user.findMany({
      where: { email: createCUserDto.email },
    });

    if (users.length > 0) {
      throw new CustomException(ExceptionCodeList.USER.ALREADY_EXIST_USER);
    } else {
      return await this.prisma.user.create({ data: createCUserDto });
    }
  }

  async findAll(
    findUserDto: FindUserDto,
  ): Promise<FindResposeDto<CUserEntity[]>> {
    let count;
    const size = +findUserDto.size;
    const page = +findUserDto.page;
    let users;
    await this.prisma.$transaction(async (tx) => {
      count = await tx.user.count();
      users = await tx.user.findMany({
        skip: page,
        take: size,
        orderBy: {
          id: 'desc',
        },
      });
    });
    return {
      count,
      page,
      size,
      data: users,
    };
  }

  async findOne(id: number): Promise<CUserEntity> {
    return await this.prisma.user.findUnique({ where: { id } });
  }

  async update(
    id: number,
    updateCUserDto: UpdateCUserDto,
  ): Promise<CUserEntity> {
    if (
      updateCUserDto.password === undefined ||
      updateCUserDto.password.trim() === ''
    ) {
      return await this.prisma.user.update({
        where: { id },
        data: {
          email: updateCUserDto.email,
          company: updateCUserDto.company,
          phone: updateCUserDto.phone,
        },
      });
    }
    return await this.prisma.user.update({
      where: { id },
      data: updateCUserDto,
    });
  }

  async updateAcive(id: number, active: boolean): Promise<CUserEntity> {
    console.log(id, active);
    return await this.prisma.user.update({
      where: { id },
      data: { isActive: active },
    });
  }

  async remove(id: number): Promise<CUserEntity> {
    return await this.prisma.user.delete({ where: { id } });
  }

  /**
   * 이메일 사용자 조회 -> 권한 확인
   * @param emailLoginDto
   * @param roles
   * @returns
   */
  async findOneByEmailAndRole(
    emailLoginDto: EmailLoginDto,
    roles: Role[] = [Role.USER],
  ): Promise<CUserEntity | undefined> {
    try {
      const dbUser: CUserEntity = await this.prisma.user.findUnique({
        where: { email: emailLoginDto.email },
      });

      if (dbUser === null) {
        // 권한 오류
        throw new CustomException(ExceptionCodeList.AUTH.WRONG_ROLE);
      } else {
        for (let index = 0; index < roles.length; index++) {
          if (dbUser.role === roles[index]) {
            return dbUser;
          }
        }
      }
    } catch {
      throw new CustomException(ExceptionCodeList.COMMON.WRONG_REQUEST);
    }
  }
}
