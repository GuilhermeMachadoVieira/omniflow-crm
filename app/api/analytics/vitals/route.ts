import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';

export async function POST(request: NextRequest) {
  try {
    const vital = await request.json();
    
    // Log da métrica
    logger.info('Web Vitals metric received', {
      name: vital.name,
      value: vital.value,
      id: vital.id,
      rating: vital.rating,
      delta: vital.delta,
    });

    // Em um ambiente real, você poderia:
    // 1. Salvar em um banco de dados
    // 2. Enviar para um serviço como Google Analytics, Plausible, etc.
    // 3. Armazenar em um sistema de time-series como InfluxDB
    
    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error('Failed to process web vitals', error as Error);
    return NextResponse.json(
      { error: 'Failed to process web vitals' },
      { status: 500 }
    );
  }
}
