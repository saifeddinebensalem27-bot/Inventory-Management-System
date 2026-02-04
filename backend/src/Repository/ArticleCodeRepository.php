<?php

namespace App\Repository;

use App\Entity\ArticleCode;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<ArticleCode>
 */
class ArticleCodeRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, ArticleCode::class);
    }

    //    /**
    //     * @return ArticleCode[] Returns an array of ArticleCode objects
    //     */
    //    public function findByExampleField($value): array
    //    {
    //        return $this->createQueryBuilder('a')
    //            ->andWhere('a.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->orderBy('a.id', 'ASC')
    //            ->setMaxResults(10)
    //            ->getQuery()
    //            ->getResult()
    //        ;
    //    }

    //    public function findOneBySomeField($value): ?ArticleCode
    //    {
    //        return $this->createQueryBuilder('a')
    //            ->andWhere('a.exampleField = :val')
    //            ->setParameter('val', $value)
    //            ->getQuery()
    //            ->getOneOrNullResult()
    //        ;
    //    }

    public function findLowStockArticles($threshold): array
    {
        return $this->createQueryBuilder('a')
            ->leftJoin('a.article', 'art')
            ->addSelect('art')
            ->where('a.quantite < :threshold')
            ->setParameter('threshold', $threshold)
            ->orderBy('a.quantite', 'ASC')
            ->getQuery()
            ->getResult()
        ;
    }
}
