import asyncHandler from '../middlewares/asyncHandler.js';
import authService from '../services/auth.service.js';

const register = asyncHandler(async (req, res) => {
  const result = await authService.register(req.body);
  res.status(201).json(result);
});

const login = asyncHandler(async (req, res) => {
  const result = await authService.login(req.body);
  res.status(200).json(result);
});

const refresh = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  const result = await authService.refresh({ refreshToken });
  res.status(200).json(result);
});

const logout = asyncHandler(async (req, res) => {
  const { refreshToken } = req.body;
  const result = await authService.logout({ refreshToken });
  res.status(200).json(result);
});

export {
  register,
  login,
  refresh,
  logout,
};
