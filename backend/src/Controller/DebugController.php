<?php

namespace App\Controller;

use App\Entity\Entree;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\SerializerInterface;

class DebugController extends AbstractController
{
    #[Route('/debug/entrees', name: 'debug_entrees')]
    public function debugEntrees(EntityManagerInterface $em, SerializerInterface $serializer): Response
    {
        $count = $em->getRepository(Entree::class)->count([]);
        $entrees = $em->getRepository(Entree::class)->findAll();
        
        // Try serializing as JSON with API Platform groups
        $json = $serializer->serialize($entrees, 'json', [
            'groups' => ['entree:read']
        ]);
        
        return $this->json([
            'total_count' => $count,
            'entrees_count' => count($entrees),
            'first_raw' => array_map(fn($e) => [
                'id' => $e->getIdEntre(),
                'date_entre' => $e->getDateEntre(),
                'num_facture' => $e->getNumFacture(),
            ], $entrees),
            'serialized' => json_decode($json, true),
        ]);
    }
}
