import {MigrationInterface, QueryRunner} from "typeorm";

export class addTableAlbum1623063203803 implements MigrationInterface {
    name = 'addTableAlbum1623063203803'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("CREATE TABLE `album` (`id` int NOT NULL AUTO_INCREMENT, `title` varchar(100) NOT NULL, `description` varchar(255) NOT NULL, `createdAt` datetime NOT NULL, PRIMARY KEY (`id`)) ENGINE=InnoDB");
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query("DROP TABLE `album`");
    }

}
