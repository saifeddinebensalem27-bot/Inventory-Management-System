<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260116192854 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE entree (id INT AUTO_INCREMENT NOT NULL, id_entre INT NOT NULL, id_fr INT NOT NULL, date_entre DATETIME NOT NULL, date_livraison DATETIME NOT NULL, num_facture INT NOT NULL, num_bdl INT NOT NULL, frais_global DOUBLE PRECISION NOT NULL, PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('CREATE TABLE entree_ligne (id INT AUTO_INCREMENT NOT NULL, id_entre_ligne INT NOT NULL, id_entre INT NOT NULL, id_code INT NOT NULL, quantite INT NOT NULL, prix_achat_unitaire DOUBLE PRECISION NOT NULL, cout_unitaire DOUBLE PRECISION NOT NULL, entree_id INT NOT NULL, INDEX IDX_C5FEF5D9AF7BD910 (entree_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4');
        $this->addSql('ALTER TABLE entree_ligne ADD CONSTRAINT FK_C5FEF5D9AF7BD910 FOREIGN KEY (entree_id) REFERENCES entree (id)');
        $this->addSql('ALTER TABLE article_code ADD CONSTRAINT FK_C757B7997294869C FOREIGN KEY (article_id) REFERENCES article (id)');
        $this->addSql('ALTER TABLE product ADD CONSTRAINT FK_D34A04AD12469DE2 FOREIGN KEY (category_id) REFERENCES category (id)');
        $this->addSql('ALTER TABLE stock_movement ADD CONSTRAINT FK_BB1BC1B54584665A FOREIGN KEY (product_id) REFERENCES product (id)');
        $this->addSql('ALTER TABLE stock_movement ADD CONSTRAINT FK_BB1BC1B5A76ED395 FOREIGN KEY (user_id) REFERENCES user (id)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE entree_ligne DROP FOREIGN KEY FK_C5FEF5D9AF7BD910');
        $this->addSql('DROP TABLE entree');
        $this->addSql('DROP TABLE entree_ligne');
        $this->addSql('ALTER TABLE article_code DROP FOREIGN KEY FK_C757B7997294869C');
        $this->addSql('ALTER TABLE product DROP FOREIGN KEY FK_D34A04AD12469DE2');
        $this->addSql('ALTER TABLE stock_movement DROP FOREIGN KEY FK_BB1BC1B54584665A');
        $this->addSql('ALTER TABLE stock_movement DROP FOREIGN KEY FK_BB1BC1B5A76ED395');
    }
}
