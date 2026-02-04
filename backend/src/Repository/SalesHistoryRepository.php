<?php

namespace App\Repository;

use App\Entity\SalesHistory;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<SalesHistory>
 *
 * @method SalesHistory|null find($id, $lockMode = null, $lockVersion = null)
 * @method SalesHistory|null findOneBy(array $criteria, array $orderBy = null)
 * @method SalesHistory[]    findAll()
 * @method SalesHistory[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class SalesHistoryRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, SalesHistory::class);
    }
}
