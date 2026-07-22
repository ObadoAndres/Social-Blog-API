import jwt from 'jsonwebtoken';

const generateToken = (payload, expiresIn) => {
  return jwt.sign(payload, process.env.JWT_SECRET || 'dev-secret', {
    expiresIn,
  });
};

export default generateToken;
