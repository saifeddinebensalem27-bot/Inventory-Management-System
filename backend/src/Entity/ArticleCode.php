<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Doctrine\Orm\Filter\SearchFilter;
use ApiPlatform\Metadata\ApiFilter;
use App\Repository\ArticleCodeRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ApiResource]
#[ORM\Entity(repositoryClass: ArticleCodeRepository::class)]
#[ApiFilter(SearchFilter::class, properties: ['article' => 'exact'])]
class ArticleCode
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[Groups(['article:read', 'entree:read', 'entree:write'])]
    #[ORM\Column(name: 'id_code')]
    private ?int $id_code = null;

    #[ORM\Column(length: 255)]
    #[Groups(['article:read', 'entree:read', 'entree:write'])]
    private ?string $code_article = null;

    #[ORM\Column(length: 255)]
    #[Groups(['article:read', 'entree:read', 'entree:write'])]
    private ?string $marque = null;

    #[ORM\Column]
    #[Groups(['article:read', 'entree:read', 'entree:write'])]
    private int $quantite = 0;

    #[ORM\Column(nullable: true)]
    #[Groups(['article:read', 'entree:read', 'entree:write'])]
    private ?float $cout_unitaire = null;

    #[ORM\ManyToOne(inversedBy: 'articleCodes')]
    #[ORM\JoinColumn(name: 'id_article', referencedColumnName: 'id_article', nullable: false)]
    #[Groups(['article:read', 'entree:read', 'entree:write'])]
    private ?Article $article = null;

    #[ORM\OneToMany(targetEntity: EntreeLigne::class, mappedBy: 'articleCode')]
    private Collection $entreeLignes;

    #[ORM\OneToMany(targetEntity: VenteLigne::class, mappedBy: 'articleCode')]
    private Collection $venteLignes;

    public function __construct()
    {
        $this->entreeLignes = new ArrayCollection();
        $this->venteLignes = new ArrayCollection();
    }

    public function getIdCode(): ?int
    {
        return $this->id_code;
    }

    public function getCodeArticle(): ?string
    {
        return $this->code_article;
    }

    public function setCodeArticle(string $code_article): self
    {
        $this->code_article = $code_article;
        return $this;
    }

    public function getMarque(): ?string
    {
        return $this->marque;
    }

    public function setMarque(string $marque): self
    {
        $this->marque = $marque;
        return $this;
    }

    public function getQuantite(): int
    {
        return $this->quantite;
    }

    public function setQuantite(int $quantite): self
    {
        $this->quantite = $quantite;
        return $this;
    }

    public function getCoutUnitaire(): ?float
    {
        return $this->cout_unitaire;
    }

    public function setCoutUnitaire(?float $cout_unitaire): self
    {
        $this->cout_unitaire = $cout_unitaire;
        return $this;
    }

    public function getArticle(): ?Article
    {
        return $this->article;
    }

    public function setArticle(Article $article): self
    {
        $this->article = $article;
        return $this;
    }

    public function getEntreeLignes(): Collection
    {
        return $this->entreeLignes;
    }

    public function getVenteLignes(): Collection
    {
        return $this->venteLignes;
    }
}