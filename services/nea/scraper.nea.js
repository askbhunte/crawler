const axios = require("axios");
const qs = require("querystring");
axios
  .post(
    "https://neabilling.com/viewonline/viewonlineresult/",
    qs.stringify({
      NEA_location: 219,
      sc_no: "100.02.049",
      consumer_id: 17792,
      Fromdatepicker: "03/01/2019",
      Todatepicker: "03/29/2019"
    })
  )
  .then(response => console.log(response.data))
  .catch(e => console.log(e));
