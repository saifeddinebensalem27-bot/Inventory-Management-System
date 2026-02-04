<?php

declare(strict_types=1);

namespace DoctrineMigrations;

use Doctrine\DBAL\Schema\Schema;
use Doctrine\Migrations\AbstractMigration;

/**
 * Auto-generated Migration: Please modify to your needs!
 */
final class Version20260120153731 extends AbstractMigration
{
    public function getDescription(): string
    {
        return '';
    }

    public function up(Schema $schema): void
    {
        // this up() migration is auto-generated, please modify it to your needs
        $this->addSql('DROP INDEX IDX_23A0E6612469DE2 ON article');
        $this->addSql('DROP INDEX IDX_23A0E66F8BD700D ON article');
        $this->addSql('ALTER TABLE article ADD id_category INT NOT NULL, ADD id_unit INT NOT NULL, DROP category_id, DROP unit_id');
        $this->addSql('ALTER TABLE article ADD CONSTRAINT FK_23A0E665697F554 FOREIGN KEY (id_category) REFERENCES category (id_category)');
        $this->addSql('ALTER TABLE article ADD CONSTRAINT FK_23A0E66579B1051 FOREIGN KEY (id_unit) REFERENCES unit (id_unit)');
        $this->addSql('CREATE INDEX IDX_23A0E665697F554 ON article (id_category)');
        $this->addSql('CREATE INDEX IDX_23A0E66579B1051 ON article (id_unit)');
        $this->addSql('ALTER TABLE article_code ADD CONSTRAINT FK_C757B799DCA7A716 FOREIGN KEY (id_article) REFERENCES article (id_article)');
        $this->addSql('ALTER TABLE category MODIFY id INT NOT NULL');
        $this->addSql('ALTER TABLE category CHANGE id id_category INT AUTO_INCREMENT NOT NULL, CHANGE name name_category VARCHAR(255) NOT NULL, DROP PRIMARY KEY, ADD PRIMARY KEY (id_category)');
        $this->addSql('ALTER TABLE entree ADD CONSTRAINT FK_598377A6C0837C9 FOREIGN KEY (id_fr) REFERENCES fournisseur (id_fr)');
        $this->addSql('ALTER TABLE entree ADD CONSTRAINT FK_598377A66B3CA4B FOREIGN KEY (id_user) REFERENCES user (id_user)');
        $this->addSql('ALTER TABLE entree_ligne ADD CONSTRAINT FK_C5FEF5D9D1A5800F FOREIGN KEY (id_entre) REFERENCES entree (id_entre)');
        $this->addSql('ALTER TABLE entree_ligne ADD CONSTRAINT FK_C5FEF5D9FC352C9A FOREIGN KEY (id_code) REFERENCES article_code (id_code)');
        $this->addSql('ALTER TABLE unit MODIFY id INT NOT NULL');
        $this->addSql('ALTER TABLE unit DROP id, CHANGE id_unit id_unit INT AUTO_INCREMENT NOT NULL, DROP PRIMARY KEY, ADD PRIMARY KEY (id_unit)');
        $this->addSql('ALTER TABLE user_roles_relation ADD CONSTRAINT FK_2359EDF2A76ED395 FOREIGN KEY (user_id) REFERENCES user (id_user)');
        $this->addSql('ALTER TABLE user_roles_relation ADD CONSTRAINT FK_2359EDF2D60322AC FOREIGN KEY (role_id) REFERENCES role (id_role)');
        $this->addSql('ALTER TABLE vente ADD CONSTRAINT FK_888A2A4CE173B1B8 FOREIGN KEY (id_client) REFERENCES client (id_client)');
        $this->addSql('ALTER TABLE vente ADD CONSTRAINT FK_888A2A4C6B3CA4B FOREIGN KEY (id_user) REFERENCES user (id_user)');
        $this->addSql('ALTER TABLE vente_ligne ADD CONSTRAINT FK_43E1D6CA660F6B7C FOREIGN KEY (id_vente) REFERENCES vente (id_vente)');
        $this->addSql('ALTER TABLE vente_ligne ADD CONSTRAINT FK_43E1D6CAFC352C9A FOREIGN KEY (id_code) REFERENCES article_code (id_code)');
    }

    public function down(Schema $schema): void
    {
        // this down() migration is auto-generated, please modify it to your needs
        $this->addSql('ALTER TABLE article DROP FOREIGN KEY FK_23A0E665697F554');
        $this->addSql('ALTER TABLE article DROP FOREIGN KEY FK_23A0E66579B1051');
        $this->addSql('DROP INDEX IDX_23A0E665697F554 ON article');
        $this->addSql('DROP INDEX IDX_23A0E66579B1051 ON article');
        $this->addSql('ALTER TABLE article ADD category_id INT NOT NULL, ADD unit_id INT NOT NULL, DROP id_category, DROP id_unit');
        $this->addSql('CREATE INDEX IDX_23A0E6612469DE2 ON article (category_id)');
        $this->addSql('CREATE INDEX IDX_23A0E66F8BD700D ON article (unit_id)');
        $this->addSql('ALTER TABLE article_code DROP FOREIGN KEY FK_C757B799DCA7A716');
        $this->addSql('ALTER TABLE category MODIFY id_category INT NOT NULL');
        $this->addSql('ALTER TABLE category CHANGE id_category id INT AUTO_INCREMENT NOT NULL, CHANGE name_category name VARCHAR(255) NOT NULL, DROP PRIMARY KEY, ADD PRIMARY KEY (id)');
        $this->addSql('ALTER TABLE entree DROP FOREIGN KEY FK_598377A6C0837C9');
        $this->addSql('ALTER TABLE entree DROP FOREIGN KEY FK_598377A66B3CA4B');
        $this->addSql('ALTER TABLE entree_ligne DROP FOREIGN KEY FK_C5FEF5D9D1A5800F');
        $this->addSql('ALTER TABLE entree_ligne DROP FOREIGN KEY FK_C5FEF5D9FC352C9A');
        $this->addSql('ALTER TABLE unit MODIFY id_unit INT NOT NULL');
        $this->addSql('ALTER TABLE unit ADD id INT AUTO_INCREMENT NOT NULL, CHANGE id_unit id_unit INT NOT NULL, DROP PRIMARY KEY, ADD PRIMARY KEY (id)');
        $this->addSql('ALTER TABLE user_roles_relation DROP FOREIGN KEY FK_2359EDF2A76ED395');
        $this->addSql('ALTER TABLE user_roles_relation DROP FOREIGN KEY FK_2359EDF2D60322AC');
        $this->addSql('ALTER TABLE vente DROP FOREIGN KEY FK_888A2A4CE173B1B8');
        $this->addSql('ALTER TABLE vente DROP FOREIGN KEY FK_888A2A4C6B3CA4B');
        $this->addSql('ALTER TABLE vente_ligne DROP FOREIGN KEY FK_43E1D6CA660F6B7C');
        $this->addSql('ALTER TABLE vente_ligne DROP FOREIGN KEY FK_43E1D6CAFC352C9A');
    }
}
