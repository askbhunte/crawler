const axios = require("axios");
const config = require("config");
const fs = require("fs");
let setup = {
  init: async () => {
    let botUrl = config.get("services.nepalbot.url");
    let { data } = await axios.get(
      `https://foodmandu.com/webapi/api/Vendor/GetVendors1?PageSize=1000`
    );
    let payload = data.map(d => {
      return {
        vendorId: d.Id,
        name: d.Name,
        address: d.Address1,
        location: {
          type: "Point",
          coordinates: [d.LocationLat, d.LocationLng]
        },
        opening_hours: d.OpeningHours,
        is_Closed: d.IsVendorClosed,
        cuisine: d.CuisineTags,
        logo_image: d.VendorCoverImageName,
        rating: d.VendorRating,
        cover_image: d.VendorLogoImageName
      };
    });
    let a = await axios({ method: "POST", url: botUrl + "/restaurant/feed", data: payload });
    let vendor = [];
    for (let i of a.data) {
      let info = {
        vendorId: i.vendorId,
        _id: i._id
      };
      vendor.push(info);
    }
    for (let i of vendor) {
      let { data } = await axios.get(
        `https://foodmandu.com/webapi/api/Product/getproducts?Keyword=&vendorid=${i.vendorId}`
      );
      data.forEach(e => {
        e.restaurant = i._id;
      });
      await axios({ method: "POST", url: botUrl + "/food/feed", data: data });
    }
    console.log("All Restaurant and Menu added");
    process.exit();
  }
};

setup.init();
