// import AdminWalletModel from "../models/AdminWallet.js";

// export const createAdminWallet = async (req, res) => {
//   const { walletAddress } = req.body;

//   try {
//     // Deactivate any existing active wallets
//     await AdminWalletModel.updateMany({ isActive: true }, { isActive: false });

//     const adminWallet = await AdminWalletModel.create({
//       walletAddress,
//       isActive: true,
//     });

//     res.status(201).json({
//       success: true,
//       adminWallet
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       error: error.message,
//     });
//   }
// };

// export const getAdminWallet = async (req, res) => {
//   try {
//     const adminWallet = await AdminWalletModel.findOne({ isActive: true });
//     res.status(200).json({
//       success: true,
//       adminWallet,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       error: error.message,
//     });
//   }
// };

// export const updateAdminWallet = async (req, res) => {
//   const { walletAddress } = req.body;

//   try {
//     const adminWallet = await AdminWalletModel.findOneAndUpdate(
//       { isActive: true },
//       { walletAddress },
//       { new: true }
//     );

//     res.status(200).json({
//       success: true,
//       adminWallet,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       error: error.message,
//     });
//   }
// };
