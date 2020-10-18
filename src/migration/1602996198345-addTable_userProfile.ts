import {MigrationInterface, QueryRunner} from "typeorm";

export class addTableUserProfile1602996198345 implements MigrationInterface {
    name = 'addTableUserProfile1602996198345'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `user_profile` (`id` int NOT NULL AUTO_INCREMENT, `firstName` varchar(255) NOT NULL, `lastName` varchar(255) NOT NULL, `gender` enum ('MALE', 'FEMALE', 'OTHER', 'NA') NOT NULL DEFAULT 'NA', PRIMARY KEY (`id`)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `user_account` ADD `profileId` int NULL");
        await queryRunner.query("ALTER TABLE `user_account` ADD UNIQUE INDEX `IDX_fd25d74f39306aae2b90a1ec17` (`profileId`)");
        await queryRunner.query("CREATE UNIQUE INDEX `REL_fd25d74f39306aae2b90a1ec17` ON `user_account` (`profileId`)");
        await queryRunner.query("ALTER TABLE `user_account` ADD CONSTRAINT `FK_fd25d74f39306aae2b90a1ec17b` FOREIGN KEY (`profileId`) REFERENCES `user_profile`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `user_account` DROP FOREIGN KEY `FK_fd25d74f39306aae2b90a1ec17b`");
        await queryRunner.query("DROP INDEX `REL_fd25d74f39306aae2b90a1ec17` ON `user_account`");
        await queryRunner.query("ALTER TABLE `user_account` DROP INDEX `IDX_fd25d74f39306aae2b90a1ec17`");
        await queryRunner.query("ALTER TABLE `user_account` DROP COLUMN `profileId`");
        await queryRunner.query("DROP TABLE `user_profile`");
    }

}
