import { HelloGuard } from './hello.guard';

describe('HelloGuard', () => {
  it('should be defined', () => {
    expect(new HelloGuard()).toBeDefined();
  });
});
