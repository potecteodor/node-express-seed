import mdb from "../core/db";

const PersonSchema = new mdb.Schema({
  companyCode: {
    type: Number
  },
  companyName: {
    type: String
  },
  companyGroup: {
    type: String
  },
  language: {
    type: String
  },
  companyContact: {
    type: String
  },
  email: {
    type: String
  },
  phone: {
    type: String
  },
  note: {
    type: String
  }
});

export const Person = mdb.model("Company", PersonSchema);
