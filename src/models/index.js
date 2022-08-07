import { url } from "../config/";

import mongoose from "mongoose";
mongoose.Promise = global.Promise;

const db = {};
db.mongoose = mongoose;
db.url = url;
db.customers = require("./customer.model.js")(mongoose);

export default db;
