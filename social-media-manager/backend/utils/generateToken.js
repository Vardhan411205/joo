const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
  try {
    console.log('Generating token for user ID:', userId);
    const token = jwt.sign(
      { id: userId },
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );
    console.log('Token generated successfully');
    return token;
  } catch (error) {
    console.error('Error generating token:', error);
    throw error;
  }
};

module.exports = generateToken; 