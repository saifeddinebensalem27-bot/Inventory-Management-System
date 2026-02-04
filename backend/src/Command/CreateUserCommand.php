<?php

namespace App\Command;

use App\Entity\User;
use App\Entity\Role;
use Doctrine\ORM\EntityManagerInterface;   // responsible for handling the database ( CRUD operations , insert , update , delete , select ).
use Symfony\Component\Console\Attribute\AsCommand;     // Attribute to define this class as a Console Command in Symfony.
use Symfony\Component\Console\Command\Command;         // Base class for all console commands in Symfony.
use Symfony\Component\Console\Input\InputInterface;    // It represents inputs coming from the command line.
use Symfony\Component\Console\Output\OutputInterface;  // This represents the output that will be displayed in the command line.
use Symfony\Component\Console\Style\SymfonyStyle;      // A tool for beautifully formatting questions and messages in the CLI.
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;  // Secure password encryption service.

#[AsCommand(
    name: 'app:create-user',
    description: 'Creates a new user and assigns a role from the database.',
)]
class CreateUserCommand extends Command
{
    private $entityManager;
    private $passwordHasher;

    public function __construct(EntityManagerInterface $entityManager, UserPasswordHasherInterface $passwordHasher)
    {
        parent::__construct();
        $this->entityManager = $entityManager;
        $this->passwordHasher = $passwordHasher;
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);

        // 1. Ask for Email
        $email = $io->ask('Enter the user email');
        
        // 2. Ask for Username (nom_user)
        $nomUser = $io->ask('Enter the user name (nom_user)');
        
        // 3. Ask for Password (input will be hidden)
        $password = $io->askHidden('Enter the user password');

        if (!$email || !$nomUser || !$password) {
            $io->error('Email, Username, and Password cannot be empty!');   // Displaying an error message in the CLI.
            return Command::FAILURE;                                      // Stop execution of the command , Indicating that the command failed.
        }

        // 3. Fetch available Roles from your Role Entity
        $roleRepo = $this->entityManager->getRepository(Role::class);       // n3ayet lil Repository mas2ol 3ala entity Role
        $rolesFromDb = $roleRepo->findAll();                                           // jebli kol el roles eli mawjouda fel database

        if (empty($rolesFromDb)) {
            $io->error('No roles found in the database. Please insert roles (Admin, Vendeur, Magasinier) into the role table first.');
            return Command::FAILURE;
        }

        // Create a list of role names for the selection menu
        $roleNames = [];
        foreach ($rolesFromDb as $role) {
            $roleNames[] = $role->getNameRole();
        }

        // 4. Let the Admin choose a role
        $chosenRoleName = $io->choice('Select a Role for this user', $roleNames);
        $selectedRoleEntity = $roleRepo->findOneBy(['name_role' => $chosenRoleName]);     // jebli el role entity eli esmo howa el role eli ekhtarha el admin

        // 5. Create User object
        $user = new User();
        $user->setEmail($email);
        $user->setNomUser($nomUser);
        
        // Hash the password (Crucial for your LoginController to work)
        $hashedPassword = $this->passwordHasher->hashPassword($user, $password);
        $user->setPassword($hashedPassword);

        

        $symfonyRole = 'ROLE_' . strtoupper($chosenRoleName); // e.g., 'Admin' becomes 'ROLE_ADMIN' , strtoupper make the string UPPERCASE
        $user->setRoles([$symfonyRole]);

        // Add the Role entity to the user (ManyToMany relationship)
        $user->addUserRole($selectedRoleEntity);

        // 6. Save to Database
        $this->entityManager->persist($user);       // lina Doctrine te3raf ennou 7ab tinserti user jdid
        $this->entityManager->flush();                      // hna bta3mel execute lel SQL Insert fel database

        
        $io->success("User $email was successfully created with the role: $chosenRoleName");
        return Command::SUCCESS;
    }
}