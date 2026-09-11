const newman = require("newman");

newman.run(
  {
    collection: require("../postman/library-api.postman_collection.json"),
    environment: require("../postman/local.postman_environment.json"),
    reporters: ["cli"]
  },
  (err, summary) => {
    if (err) {
      console.error(err);
      process.exit(1);
    }

    const failures = summary.run.failures || [];

    console.log(`Requests: ${summary.run.stats.requests.total}`);
    console.log(`Assertions: ${summary.run.stats.assertions.total}`);
    console.log(`Failed assertions: ${summary.run.stats.assertions.failed}`);

    if (failures.length > 0) {
      console.error(`Test run failed with ${failures.length} failure(s).`);
      process.exit(1);
    }

    console.log("Newman test run passed.");
  }
);
