const everest = require("./everestBranch");
const globalBranch = require("./globalBranch");
const kumari = require("./kumariBranch");
const nibl = require("./niblBranch");
const prabhu = require("./prabhu");
const prime = require("./primeBranch");
const sanima = require("./sanimaBranch");
const himalayan = require("./himalayanBranch");
const sc = require("./scBranch");
const sbi = require("./sbiBranch");
const janata = require("./janataBranch");
const CrawlUtils = require("../../utils");

let init = async () => {
  let data = await [].concat.apply(
    [],
    await Promise.all([
      // everest.process(),
      // globalBranch.process(),
      kumari.process(),
      nibl.process(),
      prabhu.process(),
      // prime.process(),
      sanima.process(),
      // himalayan.process(),
      sc.process(),
      sbi.process(),
      janata.process()
    ])
  );

  await CrawlUtils.uploadData({
    path: "/banks/branch",
    data
  });
  return data.length;
};

init()
  .then(console.log)
  .catch(console.error);
