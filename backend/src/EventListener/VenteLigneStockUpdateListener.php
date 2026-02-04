<?php

namespace App\EventListener;

use App\Entity\VenteLigne;
use Doctrine\Bundle\DoctrineBundle\Attribute\AsDoctrineListener;
use Doctrine\ORM\Event\PostPersistEventArgs;
use Doctrine\ORM\Events;

#[AsDoctrineListener(event: Events::postPersist)]
class VenteLigneStockUpdateListener
{
    /**
     * Decrease article stock when a VenteLigne is created (sale line item)
     */
    public function postPersist(PostPersistEventArgs $args): void
    {
        $entity = $args->getObject();

        if (!$entity instanceof VenteLigne) {
            return;
        }

        $articleCode = $entity->getArticleCode();
        if (!$articleCode) {
            error_log('VenteLigneStockUpdateListener: No article code found');
            return;
        }

        error_log('VenteLigneStockUpdateListener: Processing sale of ' . $entity->getQuantite() . ' units for article code ' . $articleCode->getCodeArticle());

        // Decrease stock
        $currentQuantity = $articleCode->getQuantite();
        $saleQuantity = $entity->getQuantite();
        $newQuantity = $currentQuantity - $saleQuantity;

        if ($newQuantity < 0) {
            error_log('VenteLigneStockUpdateListener: Insufficient stock! Current: ' . $currentQuantity . ', Sale: ' . $saleQuantity);
            throw new \InvalidArgumentException('Insufficient stock for article code: ' . $articleCode->getCodeArticle());
        }

        error_log('VenteLigneStockUpdateListener: Updating stock from ' . $currentQuantity . ' to ' . $newQuantity);
        $articleCode->setQuantite($newQuantity);

        $em = $args->getObjectManager();
        $em->persist($articleCode);
        $em->flush();
        
        error_log('VenteLigneStockUpdateListener: Stock updated successfully');
    }
}
