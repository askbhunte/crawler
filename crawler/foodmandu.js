const axios = require("axios");
const config = require("config");
const fs = require("fs");
const CrawlUtils = require("./utils");

const foodmandu_url = "https://foodmandu.com/webapi/api";

class Foodmandu {
  async scrapRestaurants(upload = true) {
    let { data } = await axios.get(`${foodmandu_url}/Vendor/GetVendors1?PageSize=1000`);
    data = data.map(d => {
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
        cover_image: d.VendorListingWebImageName
      };
    });

    if (upload)
      data = await CrawlUtils.uploadData({
        path: "/restaurants",
        data
      });
    return data;
  }

  async scrapMenu(restaurantList) {
    if (!restaurantList) {
      restaurantList = await this.scrapRestaurants();
    }

    let counter = 1;
    for (let i of restaurantList) {
      let { data } = await axios.get(
        `${foodmandu_url}/Product/getproducts?Keyword=&vendorid=${i.vendorId}`
      );
      data.forEach(e => {
        e.restaurant = i._id;
      });
      data = await CrawlUtils.uploadData({
        path: "/foods",
        data
      });

      console.log(counter);
      counter++;
    }
    return restaurantList.length;
  }

  async processRestaurants() {
    let data = await this.scrapRestaurants();
    return data.length;
  }

  async process() {
    let data = await this.scrapMenu();
    return data;
  }
}

let foodmandu = new Foodmandu();
module.exports = foodmandu;
