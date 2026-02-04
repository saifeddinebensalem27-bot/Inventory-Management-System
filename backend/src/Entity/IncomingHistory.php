<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use App\Repository\IncomingHistoryRepository;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;

#[ApiResource(
    normalizationContext: ['groups' => ['incoming_history:read']],
    denormalizationContext: ['groups' => ['incoming_history:write']],
)]
#[ORM\Entity(repositoryClass: IncomingHistoryRepository::class)]
class IncomingHistory
{
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['incoming_history:read', 'incoming_history:write'])]
    private ?int $id_history_in = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(name: 'id_entre', referencedColumnName: 'id_entre', nullable: false)]
    #[Groups(['incoming_history:read', 'incoming_history:write'])]
    private ?Entree $entree = null;

    public function getIdHistoryIn(): ?int
    {
        return $this->id_history_in;
    }

    public function setIdHistoryIn(int $id_history_in): static
    {
        $this->id_history_in = $id_history_in;
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
}
