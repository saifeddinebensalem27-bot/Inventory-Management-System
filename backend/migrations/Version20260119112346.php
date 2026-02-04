<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260119112346 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('DROP TABLE product');
        $this->addSql('DROP TABLE stock_movement');
        $this->addSql('ALTER TABLE article MODIFY id INT NOT NULL');
        $this->addSql('ALTER TABLE article DROP id, CHANGE id_article id_article INT AUTO_INCREMENT NOT NULL, DROP PRIMARY KEY, ADD PRIMARY KEY (id_article)');
        $this->addSql('ALTER TABLE article ADD CONSTRAINT FK_23A0E6612469DE2 FOREIGN KEY (category_id) REFERENCES category (id)');
        $this->addSql('DROP INDEX IDX_C757B7997294869C ON article_code');
        $this->addSql('ALTER TABLE article_code MODIFY id INT NOT NULL');
        $this->addSql('ALTER TABLE article_code DROP id, DROP article_id, CHANGE id_code id_code INT AUTO_INCREMENT NOT NULL, CHANGE cout_unitaire cout_unitaire DOUBLE PRECISION DEFAULT NULL, DROP PRIMARY KEY, ADD PRIMARY KEY (id_code)');
        $this->addSql('ALTER TABLE article_code ADD CONSTRAINT FK_C757B799DCA7A716 FOREIGN KEY (id_article) REFERENCES article (id_article)');
        $this->addSql('CREATE INDEX IDX_C757B799DCA7A716 ON article_code (id_article)');
        $this->addSql('ALTER TABLE client MODIFY id INT NOT NULL');
        $this->addSql('ALTER TABLE client DROP id, CHANGE id_client id_client INT AUTO_INCREMENT NOT NULL, DROP PRIMARY KEY, ADD PRIMARY KEY (id_client)');
        $this->addSql('DROP INDEX IDX_598377A6670C757F ON entree');
        $this->addSql('DROP INDEX IDX_598377A6A76ED395 ON entree');
        $this->addSql('ALTER TABLE entree MODIFY id INT NOT NULL');
        $this->addSql('ALTER TABLE entree DROP id, DROP fournisseur_id, DROP user_id, CHANGE id_entre id_entre INT AUTO_INCREMENT NOT NULL, CHANGE date_entre date_entre DATE NOT NULL, CHANGE date_livraison date_livraison DATE NOT NULL, DROP PRIMARY KEY, ADD PRIMARY KEY (id_entre)');
        $this->addSql('ALTER TABLE entree ADD CONSTRAINT FK_598377A6C0837C9 FOREIGN KEY (id_fr) REFERENCES fournisseur (id_fr)');
        $this->addSql('ALTER TABLE entree ADD CONSTRAINT FK_598377A66B3CA4B FOREIGN KEY (id_user) REFERENCES user (id_user)');
        $this->addSql('CREATE INDEX IDX_598377A6C0837C9 ON entree (id_fr)');
        $this->addSql('CREATE INDEX IDX_598377A66B3CA4B ON entree (id_user)');
        $this->addSql('DROP INDEX IDX_C5FEF5D9AF7BD910 ON entree_ligne');
        $this->addSql('DROP INDEX IDX_C5FEF5D9CA08BAA0 ON entree_ligne');
        $this->addSql('ALTER TABLE entree_ligne MODIFY id INT NOT NULL');
        $this->addSql('ALTER TABLE entree_ligne DROP id, DROP entree_id, DROP article_code_id, CHANGE id_entre_ligne id_entre_ligne INT AUTO_INCREMENT NOT NULL, DROP PRIMARY KEY, ADD PRIMARY KEY (id_entre_ligne)');
        $this->addSql('ALTER TABLE entree_ligne ADD CONSTRAINT FK_C5FEF5D9D1A5800F FOREIGN KEY (id_entre) REFERENCES entree (id_entre)');
        $this->addSql('ALTER TABLE entree_ligne ADD CONSTRAINT FK_C5FEF5D9FC352C9A FOREIGN KEY (id_code) REFERENCES article_code (id_code)');
        $this->addSql('CREATE INDEX IDX_C5FEF5D9D1A5800F ON entree_ligne (id_entre)');
        $this->addSql('CREATE INDEX IDX_C5FEF5D9FC352C9A ON entree_ligne (id_code)');
        $this->addSql('ALTER TABLE fournisseur MODIFY id INT NOT NULL');
        $this->addSql('ALTER TABLE fournisseur DROP id, CHANGE id_fr id_fr INT AUTO_INCREMENT NOT NULL, DROP PRIMARY KEY, ADD PRIMARY KEY (id_fr)');
        $this->addSql('ALTER TABLE user MODIFY id INT NOT NULL');
        $this->addSql('ALTER TABLE user CHANGE id id_user INT AUTO_INCREMENT NOT NULL, DROP PRIMARY KEY, ADD PRIMARY KEY (id_user)');
        $this->addSql('DROP INDEX IDX_888A2A4C19EB6921 ON vente');
        $this->addSql('DROP INDEX IDX_888A2A4CA76ED395 ON vente');
        $this->addSql('ALTER TABLE vente MODIFY id INT NOT NULL');
        $this->addSql('ALTER TABLE vente DROP id, DROP client_id, CHANGE id_vente id_vente INT AUTO_INCREMENT NOT NULL, CHANGE date_vente date_vente DATE NOT NULL, CHANGE user_id id_user INT NOT NULL, DROP PRIMARY KEY, ADD PRIMARY KEY (id_vente)');
        $this->addSql('ALTER TABLE vente ADD CONSTRAINT FK_888A2A4CE173B1B8 FOREIGN KEY (id_client) REFERENCES client (id_client)');
        $this->addSql('ALTER TABLE vente ADD CONSTRAINT FK_888A2A4C6B3CA4B FOREIGN KEY (id_user) REFERENCES user (id_user)');
        $this->addSql('CREATE INDEX IDX_888A2A4CE173B1B8 ON vente (id_client)');
        $this->addSql('CREATE INDEX IDX_888A2A4C6B3CA4B ON vente (id_user)');
        $this->addSql('DROP INDEX IDX_43E1D6CA7DC7170A ON vente_ligne');
        $this->addSql('DROP INDEX IDX_43E1D6CACA08BAA0 ON vente_ligne');
        $this->addSql('ALTER TABLE vente_ligne MODIFY id INT NOT NULL');
        $this->addSql('ALTER TABLE vente_ligne ADD id_code INT NOT NULL, DROP id, DROP article_code_id, DROP vente_id, CHANGE id_vente_ligne id_vente_ligne INT AUTO_INCREMENT NOT NULL, DROP PRIMARY KEY, ADD PRIMARY KEY (id_vente_ligne)');
        $this->addSql('ALTER TABLE vente_ligne ADD CONSTRAINT FK_43E1D6CA660F6B7C FOREIGN KEY (id_vente) REFERENCES vente (id_vente)');
        $this->addSql('ALTER TABLE vente_ligne ADD CONSTRAINT FK_43E1D6CAFC352C9A FOREIGN KEY (id_code) REFERENCES article_code (id_code)');
        $this->addSql('CREATE INDEX IDX_43E1D6CA660F6B7C ON vente_ligne (id_vente)');
        $this->addSql('CREATE INDEX IDX_43E1D6CAFC352C9A ON vente_ligne (id_code)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('CREATE TABLE product (id INT AUTO_INCREMENT NOT NULL, name VARCHAR(255) CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_0900_ai_ci`, price DOUBLE PRECISION NOT NULL, quantity INT NOT NULL, description VARCHAR(255) CHARACTER SET utf8mb4 DEFAULT NULL COLLATE `utf8mb4_0900_ai_ci`, category_id INT NOT NULL, INDEX IDX_D34A04AD12469DE2 (category_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_0900_ai_ci` ENGINE = MyISAM COMMENT = \'\' ');
        $this->addSql('CREATE TABLE stock_movement (id INT AUTO_INCREMENT NOT NULL, type VARCHAR(10) CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_0900_ai_ci`, quantity VARCHAR(255) CHARACTER SET utf8mb4 NOT NULL COLLATE `utf8mb4_0900_ai_ci`, created_at DATETIME NOT NULL, product_id INT NOT NULL, user_id INT NOT NULL, INDEX IDX_BB1BC1B54584665A (product_id), INDEX IDX_BB1BC1B5A76ED395 (user_id), PRIMARY KEY (id)) DEFAULT CHARACTER SET utf8mb4 COLLATE `utf8mb4_0900_ai_ci` ENGINE = MyISAM COMMENT = \'\' ');
        $this->addSql('ALTER TABLE article DROP FOREIGN KEY FK_23A0E6612469DE2');
        $this->addSql('ALTER TABLE article MODIFY id_article INT NOT NULL');
        $this->addSql('ALTER TABLE article ADD id INT AUTO_INCREMENT NOT NULL, CHANGE id_article id_article INT NOT NULL, DROP PRIMARY KEY, ADD PRIMARY KEY (id)');
        $this->addSql('ALTER TABLE article_code DROP FOREIGN KEY FK_C757B799DCA7A716');
        $this->addSql('DROP INDEX IDX_C757B799DCA7A716 ON article_code');
        $this->addSql('ALTER TABLE article_code MODIFY id_code INT NOT NULL');
        $this->addSql('ALTER TABLE article_code ADD id INT AUTO_INCREMENT NOT NULL, ADD article_id INT NOT NULL, CHANGE id_code id_code INT NOT NULL, CHANGE cout_unitaire cout_unitaire INT DEFAULT NULL, DROP PRIMARY KEY, ADD PRIMARY KEY (id)');
        $this->addSql('CREATE INDEX IDX_C757B7997294869C ON article_code (article_id)');
        $this->addSql('ALTER TABLE client MODIFY id_client INT NOT NULL');
        $this->addSql('ALTER TABLE client ADD id INT AUTO_INCREMENT NOT NULL, CHANGE id_client id_client INT NOT NULL, DROP PRIMARY KEY, ADD PRIMARY KEY (id)');
        $this->addSql('ALTER TABLE entree DROP FOREIGN KEY FK_598377A6C0837C9');
        $this->addSql('ALTER TABLE entree DROP FOREIGN KEY FK_598377A66B3CA4B');
        $this->addSql('DROP INDEX IDX_598377A6C0837C9 ON entree');
        $this->addSql('DROP INDEX IDX_598377A66B3CA4B ON entree');
        $this->addSql('ALTER TABLE entree MODIFY id_entre INT NOT NULL');
        $this->addSql('ALTER TABLE entree ADD id INT AUTO_INCREMENT NOT NULL, ADD fournisseur_id INT DEFAULT NULL, ADD user_id INT NOT NULL, CHANGE id_entre id_entre INT NOT NULL, CHANGE date_entre date_entre DATETIME NOT NULL, CHANGE date_livraison date_livraison DATETIME NOT NULL, DROP PRIMARY KEY, ADD PRIMARY KEY (id)');
        $this->addSql('CREATE INDEX IDX_598377A6670C757F ON entree (fournisseur_id)');
        $this->addSql('CREATE INDEX IDX_598377A6A76ED395 ON entree (user_id)');
        $this->addSql('ALTER TABLE entree_ligne DROP FOREIGN KEY FK_C5FEF5D9D1A5800F');
        $this->addSql('ALTER TABLE entree_ligne DROP FOREIGN KEY FK_C5FEF5D9FC352C9A');
        $this->addSql('DROP INDEX IDX_C5FEF5D9D1A5800F ON entree_ligne');
        $this->addSql('DROP INDEX IDX_C5FEF5D9FC352C9A ON entree_ligne');
        $this->addSql('ALTER TABLE entree_ligne MODIFY id_entre_ligne INT NOT NULL');
        $this->addSql('ALTER TABLE entree_ligne ADD id INT AUTO_INCREMENT NOT NULL, ADD entree_id INT NOT NULL, ADD article_code_id INT NOT NULL, CHANGE id_entre_ligne id_entre_ligne INT NOT NULL, DROP PRIMARY KEY, ADD PRIMARY KEY (id)');
        $this->addSql('CREATE INDEX IDX_C5FEF5D9AF7BD910 ON entree_ligne (entree_id)');
        $this->addSql('CREATE INDEX IDX_C5FEF5D9CA08BAA0 ON entree_ligne (article_code_id)');
        $this->addSql('ALTER TABLE fournisseur MODIFY id_fr INT NOT NULL');
        $this->addSql('ALTER TABLE fournisseur ADD id INT AUTO_INCREMENT NOT NULL, CHANGE id_fr id_fr INT NOT NULL, DROP PRIMARY KEY, ADD PRIMARY KEY (id)');
        $this->addSql('ALTER TABLE user MODIFY id_user INT NOT NULL');
        $this->addSql('ALTER TABLE user CHANGE id_user id INT AUTO_INCREMENT NOT NULL, DROP PRIMARY KEY, ADD PRIMARY KEY (id)');
        $this->addSql('ALTER TABLE vente DROP FOREIGN KEY FK_888A2A4CE173B1B8');
        $this->addSql('ALTER TABLE vente DROP FOREIGN KEY FK_888A2A4C6B3CA4B');
        $this->addSql('DROP INDEX IDX_888A2A4CE173B1B8 ON vente');
        $this->addSql('DROP INDEX IDX_888A2A4C6B3CA4B ON vente');
        $this->addSql('ALTER TABLE vente MODIFY id_vente INT NOT NULL');
        $this->addSql('ALTER TABLE vente ADD id INT AUTO_INCREMENT NOT NULL, ADD client_id INT DEFAULT NULL, CHANGE id_vente id_vente INT NOT NULL, CHANGE date_vente date_vente DATETIME NOT NULL, CHANGE id_user user_id INT NOT NULL, DROP PRIMARY KEY, ADD PRIMARY KEY (id)');
        $this->addSql('CREATE INDEX IDX_888A2A4C19EB6921 ON vente (client_id)');
        $this->addSql('CREATE INDEX IDX_888A2A4CA76ED395 ON vente (user_id)');
        $this->addSql('ALTER TABLE vente_ligne DROP FOREIGN KEY FK_43E1D6CA660F6B7C');
        $this->addSql('ALTER TABLE vente_ligne DROP FOREIGN KEY FK_43E1D6CAFC352C9A');
        $this->addSql('DROP INDEX IDX_43E1D6CA660F6B7C ON vente_ligne');
        $this->addSql('DROP INDEX IDX_43E1D6CAFC352C9A ON vente_ligne');
        $this->addSql('ALTER TABLE vente_ligne MODIFY id_vente_ligne INT NOT NULL');
        $this->addSql('ALTER TABLE vente_ligne ADD id INT AUTO_INCREMENT NOT NULL, ADD vente_id INT NOT NULL, CHANGE id_vente_ligne id_vente_ligne INT NOT NULL, CHANGE id_code article_code_id INT NOT NULL, DROP PRIMARY KEY, ADD PRIMARY KEY (id)');
        $this->addSql('CREATE INDEX IDX_43E1D6CA7DC7170A ON vente_ligne (vente_id)');
        $this->addSql('CREATE INDEX IDX_43E1D6CACA08BAA0 ON vente_ligne (article_code_id)');
    }
}
