const civil = require("./civilATM");
const everest = require("./everest");
const globalAtm = require("./global");
const kumari = require("./kumariATM");
const ncc = require("./nccATM");
const nibl = require("./niblATM");
const prabhu = require("./prabhuATM");
const prime = require("./primeAtm");
const sanima = require("./sanimaAtm");
const CrawlUtils = require("../../utils");

exports.process = async () => {
  let data = await [].concat.apply(
    [],
    await Promise.all([
      civil.process(),
      everest.process(),
      globalAtm.process(),
      kumari.process(),
      ncc.process(),
      nibl.process(),
      prabhu.process(),
      prime.process(),
      sanima.process()
    ])
  );
  await CrawlUtils.uploadData({
    path: "/banks/atm",
    data
  });
  return data.length;
};

// init()
//   .then(console.log)
//   .catch(console.error);
