export default () => ({
  jwt: {
    accessTokenSecret:
      process.env.JWT_ACCESS_KEY || 'defaultAccessTokenSecret',
    refreshTokenSecret:
      process.env.JWT_REFRESH_KEY || 'defaultRefreshTokenSecret',
    accessTokenExpiresIn: process.env.JWT_ACCESS_EI || '60s',
    refreshTokenExpiresIn: process.env.JWT_ACCESS_EI || '7d'
  }
})
