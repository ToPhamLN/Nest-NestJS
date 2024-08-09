export default () => ({
  jwt: {
    accessTokenSecret:
      process.env.JWT_ACCESS_KEY || 'defaultAccessTokenSecret',
    refreshTokenSecret:
      process.env.JWT_REFRESH_KEY || 'defaultRefreshTokenSecret',
    accessTokenExpiresIn: process.env.JWT_ACCESS_EI || '15m',
    refreshTokenExpiresIn: process.env.JWT_REFRESH_EI || '7d'
  }
})
