export function getNaturalNumbers(count, start = 1) {
  const nums = [];

  for (let i = 0, value = start; i < count; i++, value++) {
    nums.push(value);
  }

  return nums;
}

export function isPrime(num) {
  if (num === 1) return false;
  if (num > 2 && num % 2 === 0) return false;

  let limit = Math.floor(num / 2);

  for (let i = 3; i < limit; i += 2) {
    if (num % i === 0) return false;
  }

  return true;
}
