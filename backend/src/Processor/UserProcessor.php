<?php

namespace App\Processor;

use ApiPlatform\Metadata\Operation;
use ApiPlatform\State\ProcessorInterface;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

class UserProcessor implements ProcessorInterface
{
    public function __construct(
        private EntityManagerInterface $entityManager,
        private UserPasswordHasherInterface $passwordHasher,
    ) {}

    public function process(mixed $data, Operation $operation, array $uriVariables = [], array $context = []): mixed
    {
        if ($data instanceof User) {
            $plainPassword = $data->getPassword();

            // Only hash if password is provided, not empty, and not already hashed
            if (!empty($plainPassword) && !str_starts_with($plainPassword, '$2')) {
                $hashedPassword = $this->passwordHasher->hashPassword($data, $plainPassword);
                $data->setPassword($hashedPassword);
            }
        }

        // Persist and flush the entity
        $this->entityManager->persist($data);
        $this->entityManager->flush();

        return $data;
    }
}
