<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\VenteRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;

#[ApiResource]
#[ORM\Entity(repositoryClass: VenteRepository::class)]
class Vente
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    private ?int $id_vente = null;

    #[ORM\Column(type: 'date')]
    private ?\DateTimeInterface $date_vente = null;

    #[ORM\Column]
    private ?float $total_vente = null;

    #[ORM\ManyToOne(inversedBy: 'ventes')]
    #[ORM\JoinColumn(name: 'id_client', referencedColumnName: 'id_client', nullable: false)]
    private ?Client $client = null;

    #[ORM\ManyToOne(inversedBy: 'ventes')]
    #[ORM\JoinColumn(name: 'id_user', referencedColumnName: 'id_user', nullable: false)]
    private ?User $user = null;

    #[ORM\OneToMany(targetEntity: VenteLigne::class, mappedBy: 'vente', orphanRemoval: true)]
    private Collection $venteLignes;

    public function __construct()
    {
        $this->venteLignes = new ArrayCollection();
    }

    public function getIdVente(): ?int
    {
        return $this->id_vente;
    }

    public function setIdVente(int $id_vente): static
    {
        $this->id_vente = $id_vente;
        return $this;
    }

    public function getDateVente(): ?\DateTimeInterface
    {
        return $this->date_vente;
    }

    public function setDateVente(\DateTimeInterface $date_vente): static
    {
        $this->date_vente = $date_vente;
        return $this;
    }

    public function getTotalVente(): ?float
    {
        return $this->total_vente;
    }

    public function setTotalVente(float $total_vente): static
    {
        $this->total_vente = $total_vente;
        return $this;
    }

    public function getClient(): ?Client
    {
        return $this->client;
    }

    public function setClient(?Client $client): static
    {
        $this->client = $client;
        return $this;
    }

    public function getUser(): ?User
    {
        return $this->user;
    }

    public function setUser(?User $user): static
    {
        $this->user = $user;
        return $this;
    }

    public function getVenteLignes(): Collection
    {
        return $this->venteLignes;
    }

    public function addVenteLigne(VenteLigne $venteLigne): static
    {
        if (!$this->venteLignes->contains($venteLigne)) {
            $this->venteLignes->add($venteLigne);
            $venteLigne->setVente($this);
        }
        return $this;
    }

    public function removeVenteLigne(VenteLigne $venteLigne): static
    {
        if ($this->venteLignes->removeElement($venteLigne)) {
            if ($venteLigne->getVente() === $this) {
                $venteLigne->setVente(null);
            }
        }
        return $this;
    }
}