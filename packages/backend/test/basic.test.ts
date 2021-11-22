function sum(a: number, b: number) {
  return a + b;
}

test('adds 1 + 2 = 3', () => {
  expect(sum(1, 2)).toBe(3);
});
