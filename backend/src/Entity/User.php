<?php

namespace App\Entity;

use ApiPlatform\Metadata\ApiResource;
use ApiPlatform\Metadata\Get;
use ApiPlatform\Metadata\GetCollection;
use ApiPlatform\Metadata\Post;
use ApiPlatform\Metadata\Put;
use ApiPlatform\Metadata\Delete;
use App\Repository\UserRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Doctrine\ORM\Mapping\PrePersist;
use Doctrine\ORM\Mapping\PreUpdate;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Serializer\Attribute\Groups;
use Symfony\Component\Serializer\Attribute\SerializedName;

#[ApiResource(
    operations: [
        new GetCollection(),
        new Get(),
        new Post(),
        new Put(),
        new Delete(),
    ],
    normalizationContext: ['groups' => ['user:read']], 
    denormalizationContext: ['groups' => ['user:write']]
)]
#[ORM\Entity(repositoryClass: UserRepository::class)]
#[ORM\UniqueConstraint(name: 'UNIQ_IDENTIFIER_EMAIL', fields: ['email'])]
class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    #[ORM\Id]
    #[ORM\GeneratedValue(strategy: "IDENTITY")]
    #[ORM\Column(name: "id_user")]
    #[Groups(['user:read'])]
    #[SerializedName('id')]
    private ?int $id_user = null;

    #[ORM\Column(length: 180)]
    #[Groups(['user:read', 'user:write'])]
    private ?string $email = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['user:read', 'user:write'])]
    private ?string $nom_user = null;

    #[ORM\Column]
    #[Groups(['user:read', 'user:write'])]
    private array $roles = [];

    #[ORM\Column]
    #[Groups(['user:read', 'user:write'])]
    private ?string $password = null;

    #[ORM\OneToMany(targetEntity: Vente::class, mappedBy: 'user')]
    private Collection $ventes;

    #[ORM\OneToMany(targetEntity: Entree::class, mappedBy: 'user')]
    private Collection $entrees;

#[ORM\ManyToMany(targetEntity: Role::class, inversedBy: 'users')]
    #[ORM\JoinTable(name: 'user_roles_relation')] // اسم جدول الربط في القاعدة
    #[ORM\JoinColumn(name: 'user_id', referencedColumnName: 'id_user')] // يربط user_id بـ id_user
    #[ORM\InverseJoinColumn(name: 'role_id', referencedColumnName: 'id_role')] // يربط role_id بـ id_role
    private Collection $userRoles;

    public function __construct()
    {
        $this->ventes = new ArrayCollection();
        $this->entrees = new ArrayCollection();
        $this->userRoles = new ArrayCollection();
    }

    public function getIdUser(): ?int
    {
        return $this->id_user;
    }
    
    public function setIdUser(int $id_user): static
    {
        $this->id_user = $id_user;
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

    public function getNomUser(): ?string
    {
        return $this->nom_user;
    }

    public function setNomUser(?string $nom_user): static
    {
        $this->nom_user = $nom_user;
        return $this;
    }

    public function getUserIdentifier(): string
    {
        return (string) $this->email;
    }

    public function getRoles(): array
    {
        $roles = $this->roles;
        // Ensure at least one role is always present for Symfony security
        if (empty($roles)) {
            $roles[] = 'ROLE_USER';
        }
        return array_unique($roles);
    }

    public function setRoles(array $roles): static
    {
        $this->roles = $roles;
        return $this;
    }

    public function getPassword(): ?string
    {
        return $this->password;
    }

    public function setPassword(string|null $password): static
    {
        // During updates, if password is empty/null, don't overwrite existing password
        if (($password === '' || $password === null) && !empty($this->password)) {
            return $this;
        }
        $this->password = $password;
        return $this;
    }
    public function eraseCredentials(): void
    {
    }

    public function getVentes(): Collection
    {
        return $this->ventes;
    }

    public function getEntrees(): Collection
    {
        return $this->entrees;
    }

    /**
     * @return Collection<int, Role>
     */
    public function getUserRoles(): Collection
    {
        return $this->userRoles;
    }

    public function addUserRole(Role $role): static
    {
        if (!$this->userRoles->contains($role)) {
            $this->userRoles->add($role);
        }
        return $this;
    }

    public function removeUserRole(Role $role): static
    {
        $this->userRoles->removeElement($role);
        return $this;
    }
}