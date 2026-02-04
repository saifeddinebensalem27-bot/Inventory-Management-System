<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\VenteLigneRepository;
use Doctrine\ORM\Mapping as ORM;

#[ApiResource]
#[ORM\Entity(repositoryClass: VenteLigneRepository::class)]
class VenteLigne
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id_vente_ligne = null;

    #[ORM\Column]
    private ?int $quantite = null;

    #[ORM\Column]
    private ?float $prix_vente_unitaire = null;

    #[ORM\Column(nullable: true)]
    private ?float $marge = null;

    #[ORM\ManyToOne(inversedBy: 'venteLignes')]
    #[ORM\JoinColumn(name: 'id_vente', referencedColumnName: 'id_vente', nullable: false)]
    private ?Vente $vente = null;

    // Relies on ArticleCode (implicit in diagram via "Article_code" connection)
    #[ORM\ManyToOne(inversedBy: 'venteLignes')]
    #[ORM\JoinColumn(name: 'id_code', referencedColumnName: 'id_code', nullable: false)]
    private ?ArticleCode $articleCode = null;

    public function getIdVenteLigne(): ?int
    {
        return $this->id_vente_ligne;
    }

    public function setIdVenteLigne(int $id_vente_ligne): static
    {
        $this->id_vente_ligne = $id_vente_ligne;
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

    public function getPrixVenteUnitaire(): ?float
    {
        return $this->prix_vente_unitaire;
    }

    public function setPrixVenteUnitaire(float $prix_vente_unitaire): static
    {
        $this->prix_vente_unitaire = $prix_vente_unitaire;
        return $this;
    }

    public function getMarge(): ?float
    {
        return $this->marge;
    }

    public function setMarge(?float $marge): static
    {
        $this->marge = $marge;
        return $this;
    }

    public function getVente(): ?Vente
    {
        return $this->vente;
    }

    public function setVente(?Vente $vente): static
    {
        $this->vente = $vente;
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