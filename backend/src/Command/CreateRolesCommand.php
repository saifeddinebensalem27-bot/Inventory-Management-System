<?php

namespace App\Command;

use App\Entity\Role;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

#[AsCommand(
    name: 'app:create-roles',
    description: 'Creates the default roles (Admin, Vendeur, Magasinier)',
)]
class CreateRolesCommand extends Command
{
    private $entityManager;

    public function __construct(EntityManagerInterface $entityManager)
    {
        parent::__construct();
        $this->entityManager = $entityManager;
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);

        $roleNames = ['Admin', 'Vendeur', 'Magasinier'];

        foreach ($roleNames as $roleName) {
            // Check if role already exists
            $existingRole = $this->entityManager->getRepository(Role::class)->findOneBy(['name_role' => $roleName]);
            
            if ($existingRole) {
                $io->info("Role '$roleName' already exists");
                continue;
            }

            // Create new role
            $role = new Role();
            $role->setNameRole($roleName);
            
            $this->entityManager->persist($role);
            $io->success("Created role: $roleName");
        }

        $this->entityManager->flush();
        $io->success('All roles have been created successfully!');

        return Command::SUCCESS;
    }
}
