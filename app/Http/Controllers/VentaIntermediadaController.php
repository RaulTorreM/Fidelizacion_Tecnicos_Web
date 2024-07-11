<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use function Psy\debug;
use App\Models\VentaIntermediada;
use App\Models\Canje;

class VentaIntermediadaController extends Controller
{
    public function limpiarIDs($id)
    {
        // Dividir la cadena usando el guion '-' como delimitador
        $partes = explode('-', $id);

        // Obtener el último elemento del array $partes, que sería '00xx'
        $numero = end($partes);

        // Eliminar los ceros delante del número
        $numeroLimpio = ltrim($numero, '0');

        // Construir el nuevo ID con los ceros eliminados
        $idLimpio = $partes[0] . '-'  . $numeroLimpio; // F001-72

        $tipoComprobante = $this->detectarTipoComprobante($id);
        
        // Concatenar tipoComprobante e idLimpio
        $numComprobante = $tipoComprobante . "\n". $idLimpio;
        return $numComprobante;
    }

    public function detectarTipoComprobante($id) 
    {
        if (strpos($id, 'F') !== false) {
            $tipoComprobante = 'FACTURA ELECTRÓNICA';
        } elseif (strpos($id, 'B') !== false) {
            $tipoComprobante = 'BOLETA DE VENTA ELECTRÓNICA';
        }
        return $tipoComprobante;
    }
    
    public function create()
    {
        // Obtener todas las ventas intermediadas con sus canjes y cargar los modelos relacionados
        $ventasIntermediadas = VentaIntermediada::with('canjes')->get();

        $ventas = $ventasIntermediadas->map(function ($venta) {
            // Limpiar id
            $id = $this->limpiarIDs($venta->idVentaIntermediada);

            // Obtener todas las fechas de canje
            $fechasCanjes = $venta->canjes->pluck('fechaHora_Canje')->toArray();
        
            // Obtener la fecha más reciente de todas las fechas de canje
            $fechaMasReciente = !empty($fechasCanjes) ? max($fechasCanjes) : 'Sin fecha';
        
            // Sumar 'totalPuntosCanjeados_Canje' para cada venta intermediada
            $totalPuntosCanjeados = $venta->canjes->sum('totalPuntosCanjeados_Canje');
        
            // Calcular puntos restantes
            $puntosRestantes = $venta->puntosGanados_VentaIntermediada - $totalPuntosCanjeados;
        
            // Crear un objeto para retorno
            $ventaObj = new \stdClass();
            $ventaObj->idVentaIntermediada = $id;
            $ventaObj->idTecnico = $venta->idTecnico;
            $ventaObj->nombreTecnico = $venta->nombreTecnico;
            $ventaObj->tipoCodigoCliente_VentaIntermediada = $venta->tipoCodigoCliente_VentaIntermediada;
            $ventaObj->codigoCliente_VentaIntermediada = $venta->codigoCliente_VentaIntermediada;
            $ventaObj->nombreCliente_VentaIntermediada = $venta->nombreCliente_VentaIntermediada;
            $ventaObj->fechaHoraEmision_VentaIntermediada = $venta->fechaHoraEmision_VentaIntermediada;
            $ventaObj->fechaHoraCargada_VentaIntermediada = $venta->fechaHoraCargada_VentaIntermediada;
            $ventaObj->montoTotal_VentaIntermediada = $venta->montoTotal_VentaIntermediada;
            $ventaObj->puntosGanados_VentaIntermediada = $venta->puntosGanados_VentaIntermediada;
            $ventaObj->estadoVentaIntermediada = $venta->estadoVentaIntermediada;
            $ventaObj->totalPuntosCanjeados = $totalPuntosCanjeados;
            $ventaObj->puntosRestantes = $puntosRestantes;
            $ventaObj->fechaHoraCanje = $fechaMasReciente;
        
            return $ventaObj;
        });
        
        return view('dashboard.ventasIntermediadas', compact('ventas'));
        
    }

    
}
