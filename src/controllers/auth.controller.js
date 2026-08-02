import asyncHandler from '../middlewares/asyncHandler.js';
import authService from '../services/auth.service.js';
import { setAuthCookies, clearAuthCookies, getCookieValue } from '../utils/cookies.js';

const register = asyncHandler(async (req, res) => {
  const result = await authService.register(req.body);
  res.status(201).json(result);
});

const login = asyncHandler(async (req, res) => {
  const result = await authService.login(req.body);
  setAuthCookies(res, result);
  res.status(200).json({ user: result.user });
});

const refresh = asyncHandler(async (req, res) => {
  const refreshToken = req.body.refreshToken || getCookieValue(req, 'refreshToken');
  const result = await authService.refresh({ refreshToken });
  setAuthCookies(res, { accessToken: result.accessToken, refreshToken: result.refreshToken });
  res.status(200).json({ message: 'Token refreshed successfully' });
});

const logout = asyncHandler(async (req, res) => {
  const refreshToken = req.body.refreshToken || getCookieValue(req, 'refreshToken');
  await authService.logout({ refreshToken });
  clearAuthCookies(res);
  res.status(200).json({ message: 'Logged out successfully' });
});

export {
  register,
  login,
  refresh,
  logout,
};
