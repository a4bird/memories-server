import {MigrationInterface, QueryRunner} from "typeorm";

export class addTableUserProfile1603066528917 implements MigrationInterface {
    name = 'addTableUserProfile1603066528917'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `user_account` ADD CONSTRAINT `FK_fd25d74f39306aae2b90a1ec17b` FOREIGN KEY (`profileId`) REFERENCES `user_profile`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `user_account` DROP FOREIGN KEY `FK_fd25d74f39306aae2b90a1ec17b`");
    }

}
