<?php

namespace App\State;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProviderInterface;
use App\Entity\Entree;
use Doctrine\ORM\EntityManagerInterface;

class EntreeProvider implements ProviderInterface
{
    public function __construct(
        private EntityManagerInterface $entityManager
    ) {}

    public function provide(Operation $operation, array $uriVariables = [], array $context = []): object|array|null
    {
        // For collection requests (no uriVariables or uriVariables is empty)
        if (!isset($uriVariables['id'])) {
            return $this->entityManager->getRepository(Entree::class)->findAll();
        }

        // For single item GET
        return $this->entityManager->getRepository(Entree::class)->find($uriVariables['id']);
    }
}
