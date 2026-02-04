<?php

namespace App\EventListener;

use App\Entity\User;
use Doctrine\ORM\Event\PreFlushEventArgs;
use Doctrine\ORM\Events;
use Doctrine\Bundle\DoctrineBundle\Attribute\AsDoctrineListener;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;

#[AsDoctrineListener(event: Events::preFlush)]
class UserPasswordHashListener
{
    public function __construct(
        private UserPasswordHasherInterface $passwordHasher,
    ) {}

    public function preFlush(PreFlushEventArgs $args): void
    {
        $em = $args->getObjectManager();
        $uow = $em->getUnitOfWork();

        // Get all scheduled entity updates and inserts
        foreach ($uow->getScheduledEntityInsertions() as $entity) {
            if ($entity instanceof User) {
                $this->hashPasswordIfNeeded($entity);
            }
        }

        foreach ($uow->getScheduledEntityUpdates() as $entity) {
            if ($entity instanceof User) {
                $this->hashPasswordIfNeeded($entity);
            }
        }
    }

    private function hashPasswordIfNeeded(User $user): void
    {
        $plainPassword = $user->getPassword();

        // Only hash if password is provided, not empty, and not already hashed (doesn't start with $2)
        if (!empty($plainPassword) && !str_starts_with($plainPassword, '$2')) {
            $hashedPassword = $this->passwordHasher->hashPassword($user, $plainPassword);
            $user->setPassword($hashedPassword);
        }
    }
}
