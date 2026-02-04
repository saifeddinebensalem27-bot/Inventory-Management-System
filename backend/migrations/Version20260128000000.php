<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260128000000 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Create incoming_history table';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        if (!$schema->hasTable('incoming_history')) {
            $this->addSql('CREATE TABLE incoming_history (id_history_in INT AUTO_INCREMENT NOT NULL, id_entre INT NOT NULL, created_at DATETIME NOT NULL, PRIMARY KEY(id_history_in)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_unicode_ci` ENGINE = InnoDB');
            $this->addSql('ALTER TABLE incoming_history ADD CONSTRAINT FK_INCOMING_HISTORY_ENTREE FOREIGN KEY (id_entre) REFERENCES entree (id_entre)');
        }
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('DROP TABLE incoming_history');
    }
}
