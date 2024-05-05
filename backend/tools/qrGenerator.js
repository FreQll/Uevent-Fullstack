import qrcode from "qrcode";

export const generateQR = async (url, scale = 8) => {
  try {
    const qrCode = await qrcode.toDataURL(url, { scale });
    return qrCode;
  } catch (error) {
    console.error(error);
  }
};
