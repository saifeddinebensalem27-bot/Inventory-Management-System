<?php
namespace App\Controller\Api;

use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;

class MeController extends AbstractController
{
    #[Route('/api/me', name: 'api_me', methods: ['GET'])]
    public function __invoke(): JsonResponse
    {
        $user = $this->getUser();

        if (!$user) {
            return new JsonResponse(['error' => 'Not authenticated'], 401);
        }

        // Fix: user getIdUser() instead of getId()
        return $this->json([
            'id' => method_exists($user, 'getIdUser') ? $user->getIdUser() : null, 
            'email' => method_exists($user, 'getEmail') ? $user->getEmail() : null,
            'username' => method_exists($user, 'getUserIdentifier') ? $user->getUserIdentifier() : null,
        ]);
    }
}