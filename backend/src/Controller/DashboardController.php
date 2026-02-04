<?php

namespace App\Controller;

use App\Repository\VenteRepository;
use App\Repository\ClientRepository;
use App\Repository\ArticleCodeRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Routing\Attribute\Route;

class DashboardController extends AbstractController
{
    #[Route('/api/dashboard/stats', name: 'dashboard_stats', methods: ['GET'])]
    public function getDashboardStats(
        VenteRepository $venteRepository,
        ClientRepository $clientRepository,
        ArticleCodeRepository $articleCodeRepository
    ): JsonResponse {
        $currentDate = new \DateTime();
        $currentMonth = (int)$currentDate->format('m');
        $currentYear = (int)$currentDate->format('Y');
        
        // Calculate last month
        $lastMonthDate = clone $currentDate;
        $lastMonthDate->modify('-1 month');
        $lastMonthNum = (int)$lastMonthDate->format('m');
        $lastMonthYear = (int)$lastMonthDate->format('Y');

        // Current month total revenue
        $currentMonthVentes = $venteRepository->findVentesByMonth($currentMonth, $currentYear);
        $currentTotalRevenue = array_reduce($currentMonthVentes, function($carry, $vente) {
            return $carry + ($vente->getTotalVente() ?? 0);
        }, 0);

        // Last month total revenue
        $lastMonthVentes = $venteRepository->findVentesByMonth($lastMonthNum, $lastMonthYear);
        $lastTotalRevenue = array_reduce($lastMonthVentes, function($carry, $vente) {
            return $carry + ($vente->getTotalVente() ?? 0);
        }, 0);

        // Calculate revenue growth percentage
        $revenueGrowth = $lastTotalRevenue > 0 ? (($currentTotalRevenue - $lastTotalRevenue) / $lastTotalRevenue) * 100 : 0;

        // Net Profit (calculate from VenteLigne marge field)
        $currentNetProfit = $this->calculateNetProfit($currentMonthVentes);
        $lastNetProfit = $this->calculateNetProfit($lastMonthVentes);
        $profitGrowth = $lastNetProfit > 0 ? (($currentNetProfit - $lastNetProfit) / $lastNetProfit) * 100 : 0;

        // Total Sales (count of ventes in current month)
        $totalSales = count($currentMonthVentes);
        $lastTotalSales = count($lastMonthVentes);
        $salesGrowth = $lastTotalSales > 0 ? (($totalSales - $lastTotalSales) / $lastTotalSales) * 100 : 0;

        // New Clients in current month (COUNT DISTINCT)
        $newClientsCount = $clientRepository->countUniqueClientsByMonth($currentMonth, $currentYear);
        $lastNewClientsCount = $clientRepository->countUniqueClientsByMonth($lastMonthNum, $lastMonthYear);
        $clientsGrowth = $lastNewClientsCount > 0 ? (($newClientsCount - $lastNewClientsCount) / $lastNewClientsCount) * 100 : 0;

        // Critical Stock Alerts (articles with quantity < 20)
        $lowStockArticles = $articleCodeRepository->findLowStockArticles(20);
        
        // Format alert data
        $alertsData = [];
        foreach ($lowStockArticles as $alert) {
            $alertsData[] = [
                'id_code' => $alert->getIdCode(),
                'marque' => $alert->getMarque(),
                'quantite' => $alert->getQuantite(),
                'article' => [
                    'id_article' => $alert->getArticle()?->getIdArticle(),
                    'nom_article' => $alert->getArticle()?->getNomArticle()
                ]
            ];
        }

        return new JsonResponse([
            'totalRevenue' => round($currentTotalRevenue, 2),
            'revenueGrowth' => round($revenueGrowth, 2),
            'netProfit' => round($currentNetProfit, 2),
            'profitGrowth' => round($profitGrowth, 2),
            'totalSales' => $totalSales,
            'salesGrowth' => round($salesGrowth, 2),
            'newClients' => $newClientsCount,
            'clientsGrowth' => round($clientsGrowth, 2),
            'lowStockAlerts' => $alertsData
        ]);
    }

    private function calculateNetProfit($ventes): float
    {
        $netProfit = 0;
        foreach ($ventes as $vente) {
            foreach ($vente->getVenteLignes() as $ligne) {
                $marge = $ligne->getMarge() ?? 0;
                $quantite = $ligne->getQuantite() ?? 0;
                $netProfit += ($marge * $quantite);
            }
        }
        return $netProfit;
    }
}
