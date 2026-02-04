<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\EventListener\EntreeLigneListener;
use App\Repository\EntreeLigneRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;



#[ApiResource]
#[ORM\Entity(repositoryClass: EntreeLigneRepository::class)]
#[ORM\EntityListeners([EntreeLigneListener::class])]
class EntreeLigne
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['entree:read', 'entree:write'])]
    private ?int $id_entre_ligne = null;

    #[ORM\Column]
    #[Groups(['entree:read', 'entree:write'])]
    private ?int $quantite = null;

    #[ORM\Column]
    #[Groups(['entree:read', 'entree:write'])]
    private ?float $prix_achat_unitaire = null;

    #[ORM\Column]
    #[Groups(['entree:read', 'entree:write'])]
    private ?float $cout_unitaire = null;

    // Relies on Entree (id_entre)
    #[ORM\ManyToOne(inversedBy: 'entreeLignes')]
    #[ORM\JoinColumn(name: 'id_entre', referencedColumnName: 'id_entre', nullable: false)]
    #[Groups(['entree:read', 'entree:write'])]
    private ?Entree $entree = null;

    // Relies on ArticleCode (id_code)
    #[ORM\ManyToOne(inversedBy: 'entreeLignes')]
    #[ORM\JoinColumn(name: 'id_code', referencedColumnName: 'id_code', nullable: false)]
    #[Groups(['entree:read', 'entree:write'])]
    private ?ArticleCode $articleCode = null;

    public function getIdEntreLigne(): ?int
    {
        return $this->id_entre_ligne;
    }

    public function setIdEntreLigne(int $id_entre_ligne): static
    {
        $this->id_entre_ligne = $id_entre_ligne;
        return $this;
    }

    public function getQuantite(): ?int
    {
        return $this->quantite;
    }

    public function setQuantite(int $quantite): static
    {
        $this->quantite = $quantite;
        return $this;
    }

    public function getPrixAchatUnitaire(): ?float
    {
        return $this->prix_achat_unitaire;
    }

    public function setPrixAchatUnitaire(float $prix_achat_unitaire): static
    {
        $this->prix_achat_unitaire = $prix_achat_unitaire;
        return $this;
    }

    public function getCoutUnitaire(): ?float
    {
        return $this->cout_unitaire;
    }

    public function setCoutUnitaire(float $cout_unitaire): static
    {
        $this->cout_unitaire = $cout_unitaire;
        return $this;
    }

    public function getEntree(): ?Entree
    {
        return $this->entree;
    }

    public function setEntree(?Entree $entree): static
    {
        $this->entree = $entree;
        return $this;
    }

    public function getArticleCode(): ?ArticleCode
    {
        return $this->articleCode;
    }

    public function setArticleCode(?ArticleCode $articleCode): static
    {
        $this->articleCode = $articleCode;
        return $this;
    }
}