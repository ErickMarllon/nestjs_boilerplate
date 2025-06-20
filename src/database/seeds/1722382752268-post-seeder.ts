import { PostEntity } from '@/api/post/entities/post.entity';
import { UserEntity } from '@/api/user/entities/user.entity';
import { DataSource } from 'typeorm';
import { Seeder, SeederFactoryManager } from 'typeorm-extension';

export class PostSeeder1722382752268 implements Seeder {
  track = false;

  public async run(
    dataSource: DataSource,
    factoryManager: SeederFactoryManager,
  ): Promise<any> {
    const userRepository = dataSource.getRepository(UserEntity);

    const users = await userRepository.find();
    const postFactory = factoryManager.get(PostEntity);

    for (const user of users) {
      await postFactory.saveMany(20, { userId: user.id });
    }
  }
}
