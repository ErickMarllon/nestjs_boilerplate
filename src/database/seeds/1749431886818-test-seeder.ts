import { SessionEntity } from '@/api/user/entities/session.entity';
import { UserEntity } from '@/api/user/entities/user.entity';
import { SYSTEM_USER_ID } from '@/constants/app.constant';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import crypto from 'crypto';
import { DataSource } from 'typeorm';
import { Seeder } from 'typeorm-extension';

export class TestSeeder1749431886818 implements Seeder {
  track = false;

  public async run(dataSource: DataSource): Promise<any> {
    const sessionRepository = dataSource.getRepository(SessionEntity);
    const userRepository = dataSource.getRepository(UserEntity);

    const users = await userRepository.find();

    for (const user of users) {
      const hash = crypto
        .createHash('sha256')
        .update(randomStringGenerator())
        .digest('hex');

      const session = sessionRepository.create({
        hash,
        userId: user.id,
        createdBy: SYSTEM_USER_ID,
        updatedBy: SYSTEM_USER_ID,
      });

      await sessionRepository.save(session);
    }
  }
}
