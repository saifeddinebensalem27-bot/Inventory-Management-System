<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\UnitRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ApiResource(
    normalizationContext: ['groups' => ['article:read']]
)]
#[ORM\Entity(repositoryClass: UnitRepository::class)]
class Unit
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column(name: 'id_unit')]
    #[Groups(['article:read'])]
    private ?int $id_unit = null;

    #[ORM\Column(length: 255)]
    #[Groups(['article:read'])]
    private ?string $name_unit = null;

    #[ORM\OneToMany(mappedBy: 'unit', targetEntity: Article::class)]
    private Collection $articles;

    public function __construct()
    {
        $this->articles = new ArrayCollection();
    }

    public function getIdUnit(): ?int
    {
        return $this->id_unit;
    }

    public function getNameUnit(): ?string
    {
        return $this->name_unit;
    }

    public function setNameUnit(string $name_unit): self
    {
        $this->name_unit = $name_unit;
        return $this;
    }
}
