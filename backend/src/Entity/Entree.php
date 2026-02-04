<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use ApiPlatform\Metadata\Delete;
use App\Repository\EntreeRepository;
use App\State\EntreeProvider;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ApiResource(
    operations: [
        new GetCollection(provider: EntreeProvider::class),
        new Get(provider: EntreeProvider::class),
        new Post(),
        new Put(),
        new Delete(),
    ],
    normalizationContext: ['groups' => ['entree:read']],
    denormalizationContext: ['groups' => ['entree:write']],
)]
#[ORM\Entity(repositoryClass: EntreeRepository::class)]
class Entree
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['entree:read', 'entree:write', 'incoming_history:read', 'incoming_history:write'])]
    private ?int $id_entre = null;

    #[ORM\Column(type: 'date')]
    #[Groups(['entree:read', 'entree:write', 'incoming_history:read', 'incoming_history:write'])]
    private ?\DateTimeInterface $date_entre = null;

    #[ORM\Column(type: 'date')]
    #[Groups(['entree:read', 'entree:write', 'incoming_history:read', 'incoming_history:write'])]
    private ?\DateTimeInterface $date_livraison = null;

    #[ORM\Column]
    #[Groups(['entree:read', 'entree:write', 'incoming_history:read', 'incoming_history:write'])]
    private ?int $num_facture = null;

    #[ORM\Column]
    #[Groups(['entree:read', 'entree:write', 'incoming_history:read', 'incoming_history:write'])]
    private ?int $num_bdl = null;

    #[ORM\Column]
    #[Groups(['entree:read', 'entree:write', 'incoming_history:read', 'incoming_history:write'])]
    private ?float $frais_global = null;

    #[ORM\Column(type: 'float', nullable: true)]
    #[Groups(['entree:read', 'entree:write', 'incoming_history:read', 'incoming_history:write'])]
    private ?float $achat_total = null;

    // Relations
    
    #[ORM\ManyToOne(inversedBy: 'entrees')]
    #[ORM\JoinColumn(name: 'id_fr', referencedColumnName: 'id_fr', nullable: false)]
    #[Groups(['entree:read', 'entree:write', 'incoming_history:read', 'incoming_history:write'])]
    private ?Fournisseur $fournisseur = null;

    #[ORM\ManyToOne(inversedBy: 'entrees')]
    #[ORM\JoinColumn(name: 'id_user', referencedColumnName: 'id_user', nullable: false)]
    #[Groups(['entree:read', 'entree:write', 'incoming_history:read', 'incoming_history:write'])]
    private ?User $user = null;

    #[ORM\OneToMany(targetEntity: EntreeLigne::class, mappedBy: 'entree', orphanRemoval: true, cascade: ['persist'])]
    #[Groups(['entree:write'])]
    private Collection $entreeLignes;

    public function __construct()
    {
        $this->entreeLignes = new ArrayCollection();
        $this->date_livraison = new \DateTime();
    }

    public function getIdEntre(): ?int
    {
        return $this->id_entre;
    }

    public function setIdEntre(int $id_entre): static
    {
        $this->id_entre = $id_entre;
        return $this;
    }

    public function getDateEntre(): ?\DateTimeInterface
    {
        return $this->date_entre;
    }

    public function setDateEntre(\DateTimeInterface $date_entre): static
    {
        $this->date_entre = $date_entre;
        return $this;
    }

    public function getDateLivraison(): ?\DateTimeInterface
    {
        return $this->date_livraison;
    }

    public function setDateLivraison(\DateTimeInterface $date_livraison): static
    {
        $this->date_livraison = $date_livraison;
        return $this;
    }

    public function getNumFacture(): ?int
    {
        return $this->num_facture;
    }

    public function setNumFacture(int $num_facture): static
    {
        $this->num_facture = $num_facture;
        return $this;
    }

    public function getNumBdl(): ?int
    {
        return $this->num_bdl;
    }

    public function setNumBdl(int $num_bdl): static
    {
        $this->num_bdl = $num_bdl;
        return $this;
    }

    public function getFraisGlobal(): ?float
    {
        return $this->frais_global;
    }

    public function setFraisGlobal(float $frais_global): static
    {
        $this->frais_global = $frais_global;
        return $this;
    }

    public function getFournisseur(): ?Fournisseur
    {
        return $this->fournisseur;
    }

    public function setFournisseur(?Fournisseur $fournisseur): static
    {
        $this->fournisseur = $fournisseur;
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

    public function getEntreeLignes(): Collection
    {
        return $this->entreeLignes;
    }

    public function addEntreeLigne(EntreeLigne $entreeLigne): self
    {
        if (!$this->entreeLignes->contains($entreeLigne)) {
            $this->entreeLignes[] = $entreeLigne;
            $entreeLigne->setEntree($this);
        }
        return $this;
    }

    public function removeEntreeLigne(EntreeLigne $entreeLigne): static
    {
        if ($this->entreeLignes->removeElement($entreeLigne)) {
            if ($entreeLigne->getEntree() === $this) {
                $entreeLigne->setEntree(null);
            }
        }
        return $this;
    }

    public function getAchatTotal(): ?float
    {
        return $this->achat_total;
    }

    public function setAchatTotal(?float $achat_total): static
    {
        $this->achat_total = $achat_total;
        return $this;
    }
}