<?php


namespace App\EventListener;

use App\Entity\EntreeLigne;
use Doctrine\Persistence\Event\LifecycleEventArgs;

class EntreeLigneListener
{
    public function postPersist(EntreeLigne $ligne, LifecycleEventArgs $event): void
    {
        $articleCode = $ligne->getArticleCode();
        if ($articleCode) {
            // 1. Update Quantity: Old + New
            $newQty = $articleCode->getQuantite() + $ligne->getQuantite();
            $articleCode->setQuantite($newQty);
            
            // 2. Update Cost: Set the latest Real Cost
            $articleCode->setCoutUnitaire($ligne->getCoutUnitaire());

            $entityManager = $event->getObjectManager();
            $entityManager->flush();
        }
    }
}