module.exports = {
  mongodb: {
    url: process.env.DATABASE_URL || "mongodb://admin:password@localhost:27017/chainbet?authSource=admin",
    databaseName: "chainbet",
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true
    }
  },
  migrationsDir: "migrations",
  changelogCollectionName: "changelog",
  migrationFileExtension: ".js",
  useFileHash: false,
  moduleSystem: "commonjs"
};
