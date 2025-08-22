const Tesseract = require("tesseract.js");
const User = require('../models/user');

exports.verifyNid = async (req, res) => {
  try {
    const { name, nidNumber } = req.body;
    const photoPath = req.file?.path;

    if (!name || !nidNumber || !photoPath) {
      return res.status(400).json({ message: "Name, NID number, and photo are required" });
    }

    // Validate NID number format
    const nidRegex = /^\d{10,17}$/; // allow 10-17 digits
    if (!nidRegex.test(nidNumber)) {
      return res.status(400).json({ message: "Invalid NID number format" });
    }



    let extractedText;
    try {
      // Use the correct Tesseract.js v6 API
      const { data: { text } } = await Tesseract.recognize(photoPath, 'eng', {
        logger: m => console.log(m)
      });
      extractedText = text;
      console.log("Extracted text:", text);
    } catch (err) {
      console.error("OCR extraction failed:", err);
      return res.status(400).json({ message: "Failed to extract text from NID photo" });
    }

    // Use regex patterns to find name and number
    const namePattern = new RegExp(name.replace(/ /g, '\\s*'), 'i');
    const numberPattern = new RegExp(`\\b${nidNumber}\\b`);

    const nameMatch = extractedText.match(namePattern);
    const numberMatch = extractedText.match(numberPattern);

    const isVerified = Boolean(nameMatch && numberMatch);

    return res.json({ isVerified, extractedText });
  } catch (err) {
    console.error("NID verification error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.verifyAndUpdateUserNid = async (req, res) => {
  try {
    const { name, nidNumber } = req.body;
    const photoPath = req.file?.path;
    if (!name || !nidNumber || !photoPath) {
      return res.status(400).json({ message: "Name, NID number, and photo are required" });
    }

    // Reuse verify logic with correct Tesseract.js v6 API
    const { data: { text } } = await Tesseract.recognize(photoPath, 'eng', {
      logger: m => console.log(m)
    });
    const namePattern = new RegExp(name.replace(/ /g, '\\s*'), 'i');
    const numberPattern = new RegExp(`\\b${nidNumber}\\b`);

    const isVerified = Boolean(text.match(namePattern) && text.match(numberPattern));

    const updated = await User.findByIdAndUpdate(
      req.user.id,
      { isNidVerified: isVerified, nidNumber, nidName: name },
      { new: true }
    ).select('-password');

    return res.json({ isVerified, user: updated });
  } catch (err) {
    console.error('verifyAndUpdateUserNid error:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
