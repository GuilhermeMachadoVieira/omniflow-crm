import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';

export async function POST(request: NextRequest) {
  try {
    const event = await request.json();
    
    // Log do evento
    logger.info('Analytics event received', {
      eventName: event.name,
      properties: event.properties,
      timestamp: event.timestamp,
    });

    // Em um ambiente real, você poderia:
    // 1. Salvar em um banco de dados
    // 2. Enviar para um serviço como Google Analytics, Plausible, PostHog
    // 3. Processar em tempo real para dashboards
    
    return NextResponse.json({ success: true });
  } catch (error) {
    logger.error('Failed to process analytics event', error as Error);
    return NextResponse.json(
      { error: 'Failed to process analytics event' },
      { status: 500 }
    );
  }
}
