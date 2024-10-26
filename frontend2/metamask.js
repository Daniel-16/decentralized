const detectEthereumProvider = async () => {
  if (typeof window.ethereum !== "undefined") {
    return window.ethereum;
  }
  return null;
};

const connectMetaMask = async () => {
  try {
    const provider = await detectEthereumProvider();
    if (provider) {
      await provider.request({ method: "eth_requestAccounts" });
      const accounts = await provider.request({ method: "eth_accounts" });
      return accounts[0];
    } else {
      throw new Error("Please install MetaMask!");
    }
  } catch (error) {
    console.error("Error connecting to MetaMask", error);
    throw error;
  }
};
