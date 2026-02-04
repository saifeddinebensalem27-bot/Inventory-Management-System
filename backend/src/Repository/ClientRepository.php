<?php

namespace App\Repository;

use App\Entity\Client;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Client>
 */
class ClientRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Client::class);
    }

    //    /**
    //     * @return Client[] Returns an array of Client objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('c')
    //            ->andWhere('c.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('c.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?Client
    //    {
    //        return $this->createQueryBuilder('c')
    //            ->andWhere('c.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }

    public function findNewClientsByMonth($month, $year): array
    {
        $startDate = new \DateTime("$year-$month-01");
        $endDate = (clone $startDate)->modify('last day of this month');
        
        return $this->createQueryBuilder('c')
            ->innerJoin('c.ventes', 'v')
            ->where('v.date_vente >= :startDate')
            ->andWhere('v.date_vente <= :endDate')
            ->setParameter('startDate', $startDate->format('Y-m-d'))
            ->setParameter('endDate', $endDate->format('Y-m-d'))
            ->distinct()
            ->orderBy('v.date_vente', 'DESC')
            ->getQuery()
            ->getResult()
        ;
    }

    /**
     * Count unique clients who made purchases in a given month
     */
    public function countUniqueClientsByMonth($month, $year): int
    {
        $startDate = new \DateTime("$year-$month-01");
        $endDate = (clone $startDate)->modify('last day of this month');
        
        $result = $this->createQueryBuilder('c')
            ->select('COUNT(DISTINCT c.id_client) as clientCount')
            ->innerJoin('c.ventes', 'v')
            ->where('v.date_vente >= :startDate')
            ->andWhere('v.date_vente <= :endDate')
            ->setParameter('startDate', $startDate->format('Y-m-d'))
            ->setParameter('endDate', $endDate->format('Y-m-d'))
            ->getQuery()
            ->getOneOrNullResult()
        ;
        
        return $result ? (int)$result['clientCount'] : 0;
    }
}
