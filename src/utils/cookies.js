const isSecureCookie = () => process.env.NODE_ENV === 'production' || process.env.COOKIE_SECURE === 'true';

const getCookieOptions = () => ({
  httpOnly: true,
  sameSite: 'lax',
  secure: isSecureCookie(),
  path: '/',
});

const setAuthCookies = (res, { accessToken, refreshToken }) => {
  const cookieOptions = getCookieOptions();

  res.cookie('accessToken', accessToken, {
    ...cookieOptions,
    maxAge: 15 * 60 * 1000,
  });

  res.cookie('refreshToken', refreshToken, {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

const clearAuthCookies = (res) => {
  const cookieOptions = getCookieOptions();
  res.clearCookie('accessToken', cookieOptions);
  res.clearCookie('refreshToken', cookieOptions);
};

const getCookieValue = (req, cookieName) => {
  const cookieHeader = req.headers.cookie || '';
  const cookies = cookieHeader.split(';').map((cookie) => cookie.trim());
  const matchedCookie = cookies.find((cookie) => cookie.startsWith(`${cookieName}=`));

  if (!matchedCookie) {
    return null;
  }

  return decodeURIComponent(matchedCookie.slice(cookieName.length + 1));
};

export { setAuthCookies, clearAuthCookies, getCookieValue };
export default { setAuthCookies, clearAuthCookies, getCookieValue };
