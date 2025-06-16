import { UserEntity } from '@/api/user/entities/user.entity';
import { SYSTEM_USER_ID } from '@/constants/app.constant';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

export class UserSeeder1722335726360 implements Seeder {
  track = false;

  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const repository = dataSource.getRepository(UserEntity);
    const userFactory = factoryManager.get(UserEntity);

    const adminUser = await repository.findOneBy({ username: 'teste' });
    if (!adminUser) {
      await repository.insert(
        repository.create({
          username: 'teste teste',
          email: 'teste@example.com',
          password: '12345678',
          bio: "hello, i'm a backend developer",
          image: 'https://example.com/avatar.png',
          createdBy: SYSTEM_USER_ID,
          updatedBy: SYSTEM_USER_ID,
          emailVerifiedAt: new Date(),
        }),
      );
    }

    await userFactory.saveMany(20);
  }
}
