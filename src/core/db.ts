const mdb = require("mongoose");

mdb.connect(
  "mongodb://localhost:27017/dev-seed",
  { useNewUrlParser: true }
);

export default mdb;
