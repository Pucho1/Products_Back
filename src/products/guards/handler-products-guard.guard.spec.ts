import { HandlerProductsGuard } from './handler-products-guard.guard';

describe('HandlerProductsGuard', () => {
  it('should be defined', () => {
    expect(new HandlerProductsGuard(undefined as any)).toBeDefined();
  });
});
