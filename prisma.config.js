module.exports = {
  migrate: {
    db: {
      adapter: 'postgresql',
      url: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/neuroscan',
    },
  },
};