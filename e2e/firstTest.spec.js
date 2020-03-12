describe('Example', () => {
  beforeEach(async () => {
    await device.reloadReactNative();
  });

  it('should have menu screen', async () => {
    await expect(element(by.id('menu'))).toBeVisible();
  });
});
