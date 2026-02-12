import { logger } from '@/lib/logger';

describe('Logger', () => {
  let consoleSpy: {
    debug: jest.SpyInstance;
    info: jest.SpyInstance;
    warn: jest.SpyInstance;
    error: jest.SpyInstance;
  };

  beforeEach(() => {
    consoleSpy = {
      debug: jest.spyOn(console, 'debug').mockImplementation(),
      info: jest.spyOn(console, 'info').mockImplementation(),
      warn: jest.spyOn(console, 'warn').mockImplementation(),
      error: jest.spyOn(console, 'error').mockImplementation(),
    };
  });

  afterEach(() => {
    Object.values(consoleSpy).forEach(spy => spy.mockRestore());
  });

  test('deve logar mensagem de debug em desenvolvimento', () => {
    const originalEnv = process.env.NODE_ENV;
    
    // Mock do ambiente de desenvolvimento
    const originalEnvDescriptor = Object.getOwnPropertyDescriptor(process, 'env');
    Object.defineProperty(process, 'env', {
      value: { ...process.env, NODE_ENV: 'development' },
      writable: true,
      configurable: true
    });
    
    // Recriar logger para pegar novo ambiente
    jest.resetModules();
    const { logger: freshLogger } = require('@/lib/logger');
    
    freshLogger.debug('Test debug message');
    
    expect(consoleSpy.debug).toHaveBeenCalledWith(
      expect.stringContaining('DEBUG: Test debug message')
    );
    
    // Restaurar ambiente original
    Object.defineProperty(process, 'env', originalEnvDescriptor!);
  });

  test('deve logar mensagem de info', () => {
    logger.info('Test info message');
    
    expect(consoleSpy.info).toHaveBeenCalledWith(
      expect.stringContaining('INFO: Test info message')
    );
  });

  test('deve logar mensagem de erro com contexto', () => {
    const error = new Error('Test error');
    logger.error('Test error message', error, { userId: '123' });
    
    expect(consoleSpy.error).toHaveBeenCalledWith(
      expect.stringContaining('ERROR: Test error message')
    );
    expect(consoleSpy.error).toHaveBeenCalledWith(
      expect.stringContaining('Context: {"userId":"123"}')
    );
  });
});
