const TX_HASH_REGEX = /^0x[a-fA-F0-9]{64}$/;

/**
 * Validates if a string is a valid Ethereum transaction hash
 * @param txHash - The transaction hash to validate
 * @returns true if valid, false otherwise
 */
export function isValidTransactionHash(txHash: string): boolean {
  return TX_HASH_REGEX.test(txHash);
}

/**
 * Formats a transaction hash for display (truncated)
 * @param txHash - The full transaction hash
 * @param startLength - Number of characters to show at start (default: 6)
 * @param endLength - Number of characters to show at end (default: 4)
 * @returns Formatted transaction hash
 */
export function formatTransactionHash(
  txHash: string,
  startLength = 6,
  endLength = 4
): string {
  if (!isValidTransactionHash(txHash)) {
    return txHash;
  }

  if (txHash.length <= startLength + endLength) {
    return txHash;
  }

  return `${txHash.slice(0, startLength)}...${txHash.slice(-endLength)}`;
}
