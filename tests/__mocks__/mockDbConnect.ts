// tests/__mocks__/mockDbConnect.ts

export default jest.fn(async () => {
  return Promise.resolve(true);
});
