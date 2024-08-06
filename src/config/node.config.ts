export default () => ({
  port: process.env.PORT || 8000,
  nodeEnv: process.env.NODE_ENV || 'development',
  monogUrl: process.env.MONGOOSE_URL || 'd'
})
