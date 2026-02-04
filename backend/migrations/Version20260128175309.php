<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260128175309 extends AbstractMigration
{
    public function getDescription(): string
    {
        return 'Remove created_at column from IncomingHistory table';
    }

    public function up(Schema $schema): void
    {
        $this->addSql('ALTER TABLE incoming_history DROP COLUMN created_at');
    }

    public function down(Schema $schema): void
    {
        $this->addSql('ALTER TABLE incoming_history ADD COLUMN created_at DATETIME NOT NULL');
    }
}
