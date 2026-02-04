<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260116194511 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE fournisseur (id INT AUTO_INCREMENT NOT NULL, id_fr INT NOT NULL, nom_fr VARCHAR(255) NOT NULL, telephone INT NOT NULL, email VARCHAR(255) NOT NULL, adresse VARCHAR(255) NOT NULL, PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('ALTER TABLE article_code ADD CONSTRAINT FK_C757B7997294869C FOREIGN KEY (article_id) REFERENCES article (id)');
        $this->addSql('ALTER TABLE entree ADD fournisseur_id INT DEFAULT NULL');
        $this->addSql('ALTER TABLE entree ADD CONSTRAINT FK_598377A6670C757F FOREIGN KEY (fournisseur_id) REFERENCES fournisseur (id)');
        $this->addSql('CREATE INDEX IDX_598377A6670C757F ON entree (fournisseur_id)');
        $this->addSql('ALTER TABLE entree_ligne ADD CONSTRAINT FK_C5FEF5D9AF7BD910 FOREIGN KEY (entree_id) REFERENCES entree (id)');
        $this->addSql('ALTER TABLE entree_ligne ADD CONSTRAINT FK_C5FEF5D9CA08BAA0 FOREIGN KEY (article_code_id) REFERENCES article_code (id)');
        $this->addSql('ALTER TABLE product ADD CONSTRAINT FK_D34A04AD12469DE2 FOREIGN KEY (category_id) REFERENCES category (id)');
        $this->addSql('ALTER TABLE stock_movement ADD CONSTRAINT FK_BB1BC1B54584665A FOREIGN KEY (product_id) REFERENCES product (id)');
        $this->addSql('ALTER TABLE stock_movement ADD CONSTRAINT FK_BB1BC1B5A76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('DROP TABLE fournisseur');
        $this->addSql('ALTER TABLE article_code DROP FOREIGN KEY FK_C757B7997294869C');
        $this->addSql('ALTER TABLE entree DROP FOREIGN KEY FK_598377A6670C757F');
        $this->addSql('DROP INDEX IDX_598377A6670C757F ON entree');
        $this->addSql('ALTER TABLE entree DROP fournisseur_id');
        $this->addSql('ALTER TABLE entree_ligne DROP FOREIGN KEY FK_C5FEF5D9AF7BD910');
        $this->addSql('ALTER TABLE entree_ligne DROP FOREIGN KEY FK_C5FEF5D9CA08BAA0');
        $this->addSql('ALTER TABLE product DROP FOREIGN KEY FK_D34A04AD12469DE2');
        $this->addSql('ALTER TABLE stock_movement DROP FOREIGN KEY FK_BB1BC1B54584665A');
        $this->addSql('ALTER TABLE stock_movement DROP FOREIGN KEY FK_BB1BC1B5A76ED395');
    }
}
