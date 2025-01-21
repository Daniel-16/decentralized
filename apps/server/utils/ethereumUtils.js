export const checkTransactionConfirmation = async (web3, txHash) => {
  let transactionReceipt = null;
  while (transactionReceipt == null) {
    transactionReceipt = await web3.eth.getTransactionReceipt(txHash);
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for 1 second before checking again
  }
  return transactionReceipt.status;
};
