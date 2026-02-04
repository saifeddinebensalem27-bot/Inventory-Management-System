<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\FournisseurRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ApiResource]
#[ORM\Entity(repositoryClass: FournisseurRepository::class)]
class Fournisseur
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['fournisseur:read', 'fournisseur:write', 'entree:read', 'entree:write', 'incoming_history:read', 'incoming_history:write'])]
    private ?int $id_fr = null;

    #[ORM\Column(length: 255)]
    #[Groups(['fournisseur:read', 'fournisseur:write', 'entree:read', 'entree:write', 'incoming_history:read', 'incoming_history:write'])]
    private ?string $nom_fr = null;

    #[ORM\Column]
    #[Groups(['fournisseur:read', 'fournisseur:write'])]
    private ?string $telephone = null;

    #[ORM\Column(length: 255)]
    #[Groups(['fournisseur:read', 'fournisseur:write'])]
    private ?string $email = null;

    #[ORM\Column(length: 255)]
    #[Groups(['fournisseur:read', 'fournisseur:write'])]
    private ?string $adresse = null;

    #[ORM\OneToMany(targetEntity: Entree::class, mappedBy: 'fournisseur')]
    private Collection $entrees;

    public function __construct()
    {
        $this->entrees = new ArrayCollection();
    }

    public function getIdFr(): ?int
    {
        return $this->id_fr;
    }

    public function setIdFr(int $id_fr): static
    {
        $this->id_fr = $id_fr;
        return $this;
    }

    public function getNomFr(): ?string
    {
        return $this->nom_fr;
    }

    public function setNomFr(string $nom_fr): static
    {
        $this->nom_fr = $nom_fr;
        return $this;
    }

    public function getTelephone(): ?string
    {
        return $this->telephone;
    }

    public function setTelephone(string $telephone): static
    {
        $this->telephone = $telephone;
        return $this;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): static
    {
        $this->email = $email;
        return $this;
    }

    public function getAdresse(): ?string
    {
        return $this->adresse;
    }

    public function setAdresse(string $adresse): static
    {
        $this->adresse = $adresse;
        return $this;
    }

    public function getEntrees(): Collection
    {
        return $this->entrees;
    }

    public function addEntree(Entree $entree): static
    {
        if (!$this->entrees->contains($entree)) {
            $this->entrees->add($entree);
            $entree->setFournisseur($this);
        }
        return $this;
    }

    public function removeEntree(Entree $entree): static
    {
        if ($this->entrees->removeElement($entree)) {
            if ($entree->getFournisseur() === $this) {
                $entree->setFournisseur(null);
            }
        }
        return $this;
    }
}