import jwt from 'jsonwebtoken';

const getJwtSecret = () => process.env.JWT_SECRET || 'dev-secret';

const generateToken = (payload, expiresIn) => {
  return jwt.sign(payload, getJwtSecret(), {
    expiresIn,
  });
};

export { getJwtSecret };
export default generateToken;
