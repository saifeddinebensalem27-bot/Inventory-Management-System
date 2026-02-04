<?php

namespace App\Controller;

use App\Repository\EntreeRepository;
use App\Repository\IncomingHistoryRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Serializer\SerializerInterface;

class IncomingHistoryController extends AbstractController
{
    private EntreeRepository $entreeRepository;
    private IncomingHistoryRepository $incomingHistoryRepository;
    private SerializerInterface $serializer;

    public function __construct(
        EntreeRepository $entreeRepository,
        IncomingHistoryRepository $incomingHistoryRepository,
        SerializerInterface $serializer
    ) {
        $this->entreeRepository = $entreeRepository;
        $this->incomingHistoryRepository = $incomingHistoryRepository;
        $this->serializer = $serializer;
    }

    #[Route('/api/entree/{id_entre}', name: 'get_entree_with_details', methods: ['GET'])]
    public function getEntreeWithDetails(int $id_entre): JsonResponse
    {
        $entree = $this->entreeRepository->find($id_entre);

        if (!$entree) {
            return new JsonResponse(
                ['error' => 'Entree not found'],
                JsonResponse::HTTP_NOT_FOUND
            );
        }

        // Serialize to include Fournisseur, EntreeLignes, and ArticleCode
        $data = $this->serializer->serialize($entree, 'json', [
            'circular_reference_handler' => function ($object) {
                return $object->getId();
            }
        ]);

        return JsonResponse::fromJsonString($data);
    }

    #[Route('/api/incoming-history', name: 'get_incoming_history', methods: ['GET'])]
    public function getIncomingHistory(): JsonResponse
    {
        $history = $this->incomingHistoryRepository->findAll();

        // Serialize with nested Entree, Fournisseur, and EntreeLignes
        $data = $this->serializer->serialize($history, 'json', [
            'circular_reference_handler' => function ($object) {
                return $object->getId();
            }
        ]);

        return JsonResponse::fromJsonString($data);
    }

    #[Route('/api/incoming-history/{id_entre}', name: 'get_incoming_by_entree', methods: ['GET'])]
    public function getIncomingByEntree(int $id_entre): JsonResponse
    {
        $entree = $this->entreeRepository->find($id_entre);

        if (!$entree) {
            return new JsonResponse(
                ['error' => 'Entree not found'],
                JsonResponse::HTTP_NOT_FOUND
            );
        }

        // Get incoming history for this entree
        $history = $this->incomingHistoryRepository->findBy(['entree' => $entree]);

        $data = $this->serializer->serialize([
            'entree' => $entree,
            'fournisseur' => $entree->getFournisseur(),
            'entreeLignes' => $entree->getEntreeLignes(),
            'history' => $history
        ], 'json', [
            'circular_reference_handler' => function ($object) {
                return $object->getId();
            }
        ]);

        return JsonResponse::fromJsonString($data);
    }
}
