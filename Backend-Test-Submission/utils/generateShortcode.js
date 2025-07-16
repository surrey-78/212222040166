function generateCode(length = 6) {
  const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';

  while (result.length < length) {
    const char = chars.charAt(Math.floor(Math.random() * chars.length));
    result += char;
  }

  return result;
}

module.exports = generateCode;
