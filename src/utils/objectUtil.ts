/**
 * 创建客户端临时ID
 */
export function createClientId(): string {
  const timestamp = Date.now().toString(16);
  const random2 = Math.floor(Math.random() * 100);
  const random4 = Math.floor(Math.random() * 10000);
  const random2Hex = random2.toString(16);
  const random4Hex = random4.toString(16);
  return random2Hex + timestamp + random4Hex;
}
