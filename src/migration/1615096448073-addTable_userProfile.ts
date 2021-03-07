import {MigrationInterface, QueryRunner} from "typeorm";

export class addTableUserProfile1615096448073 implements MigrationInterface {
    name = 'addTableUserProfile1615096448073'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `user_profile` (`id` int NOT NULL AUTO_INCREMENT, `firstName` varchar(255) NOT NULL, `lastName` varchar(255) NOT NULL, `gender` enum ('MALE', 'FEMALE', 'OTHER', 'NA') NOT NULL DEFAULT 'NA', PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("CREATE TABLE `user_account` (`id` varchar(36) NOT NULL, `email` varchar(255) NOT NULL, `password` varchar(100) NOT NULL, `confirmed` tinyint NOT NULL DEFAULT 0, `forgotPasswordLocked` tinyint NOT NULL DEFAULT 0, `profileId` int NULL, UNIQUE INDEX `REL_fd25d74f39306aae2b90a1ec17` (`profileId`), PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `user_account` ADD CONSTRAINT `FK_fd25d74f39306aae2b90a1ec17b` FOREIGN KEY (`profileId`) REFERENCES `user_profile`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `user_account` DROP FOREIGN KEY `FK_fd25d74f39306aae2b90a1ec17b`");
        await queryRunner.query("DROP INDEX `REL_fd25d74f39306aae2b90a1ec17` ON `user_account`");
        await queryRunner.query("DROP TABLE `user_account`");
        await queryRunner.query("DROP TABLE `user_profile`");
    }

}
