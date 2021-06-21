import {MigrationInterface, QueryRunner} from "typeorm";

export class addTableAlbum1624258378210 implements MigrationInterface {
    name = 'addTableAlbum1624258378210'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `album` (`id` int NOT NULL AUTO_INCREMENT, `title` varchar(100) NOT NULL, `description` varchar(255) NOT NULL, `createdAt` datetime NOT NULL, `userAccountId` varchar(36) NOT NULL, PRIMARY KEY (`id`, `userAccountId`)) ENGINE=InnoDB");
        await queryRunner.query("ALTER TABLE `album` ADD CONSTRAINT `FK_e7894a0e43911702c53c97e4da7` FOREIGN KEY (`userAccountId`) REFERENCES `user_account`(`id`) ON DELETE NO ACTION ON UPDATE NO ACTION");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("ALTER TABLE `album` DROP FOREIGN KEY `FK_e7894a0e43911702c53c97e4da7`");
        await queryRunner.query("DROP TABLE `album`");
    }

}
