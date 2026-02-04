<?php

namespace App\Repository;

use App\Entity\IncomingHistory;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<IncomingHistory>
 *
 * @method IncomingHistory|null find($id, $lockMode = null, $lockVersion = null)
 * @method IncomingHistory|null findOneBy(array $criteria, array $orderBy = null)
 * @method IncomingHistory[]    findAll()
 * @method IncomingHistory[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class IncomingHistoryRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, IncomingHistory::class);
    }
}
