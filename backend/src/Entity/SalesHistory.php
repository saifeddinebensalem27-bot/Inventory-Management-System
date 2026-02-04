<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\SalesHistoryRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ApiResource(
    normalizationContext: ['groups' => ['sales_history:read']],
    denormalizationContext: ['groups' => ['sales_history:write']],
)]
#[ORM\Entity(repositoryClass: SalesHistoryRepository::class)]
class SalesHistory
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['sales_history:read', 'sales_history:write'])]
    private ?int $id_history_sel = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(name: 'id_vente', referencedColumnName: 'id_vente', nullable: false)]
    #[Groups(['sales_history:read', 'sales_history:write'])]
    private ?Vente $vente = null;

    public function getIdHistorySel(): ?int
    {
        return $this->id_history_sel;
    }

    public function setIdHistorySel(int $id_history_sel): static
    {
        $this->id_history_sel = $id_history_sel;
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
}
