<?php

namespace App\EventSubscriber;

use App\Entity\EntreeLigne;
use Doctrine\Common\EventSubscriber;
use Doctrine\ORM\Events;
use Doctrine\Persistence\Event\LifecycleEventArgs;

class StockUpdateSubscriber implements EventSubscriber
{
    public function getSubscribedEvents(): array
    {
        return [
            Events::postPersist,
        ];
    }

    public function postPersist(LifecycleEventArgs $args): void
    {
        $entity = $args->getObject();

        // نتحقق أن الكيان هو سطر دخول منتج
        if (!$entity instanceof EntreeLigne) {
            return;
        }

        $entityManager = $args->getObjectManager();
        $articleCode = $entity->getArticleCode();

        if ($articleCode) {
            // المنطق الذي طلبته: الكمية القديمة + الكمية الجديدة
            $oldQuantity = $articleCode->getQuantite() ?? 0;
            $newQuantity = $oldQuantity + $entity->getQuantite();

            $articleCode->setQuantite($newQuantity);
            
            // تحديث السعر أيضاً في قاعدة البيانات إذا أردت
            $articleCode->setCoutUnitaire($entity->getCoutUnitaire());

            $entityManager->flush();
        }
    }
}