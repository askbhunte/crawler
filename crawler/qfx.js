const axios = require("axios");
const cheerio = require("cheerio");
const config = require("config");
const moment = require("moment");

let botUrl = config.get("services.nepalbot.url") + "/movies";
let baseUrl = "https://www.qfxcinemas.com";

function getParameterByName(name, url) {
  if (!url) url = window.location.href;
  name = name.replace(/[\[\]]/g, "\\$&");
  var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
    results = regex.exec(url);
  if (!results) return null;
  if (!results[2]) return "";
  return decodeURIComponent(results[2].replace(/\+/g, " "));
}

class QFX {
  constructor() {}
  async scrapMovieList() {
    let { data } = await axios.get(baseUrl);
    const $ = cheerio.load(data);
    data = [];
    $(".movie").each(function(i, elem) {
      data[i] = {
        title: $(this)
          .find(".movie-title")
          .text(),
        url:
          baseUrl +
          $(this)
            .find(".movie-poster")
            .find("a")
            .attr("href"),
        image_url:
          baseUrl +
            $(this)
              .find(".movie-poster")
              .find(".img-b")
              .attr("src") ||
          baseUrl +
            $(this)
              .find(".movie-poster")
              .find(".img-a")
              .attr("src"),
        released_date: $(this)
          .find(".movie-date")
          .text()
          .replace(/[\n]/g, "")
          .trim()
      };
    });

    data.forEach(d => {
      d.vendor = { name: "qfx" };
      try {
        d.status = d.released_date ? "upcoming" : "current";
        d.vendor.id = d.url.substring(d.url.lastIndexOf("=") + 1, d.url.length);
      } catch (e) {}
    });
    return data;
  }
  async scrapMovie(movie) {
    if (!movie.vendor.id) return movie;
    let url = baseUrl + "/Home/GetMovieDetails?EventID=" + movie.vendor.id;
    let { data } = await axios.get(url);
    const $ = cheerio.load(data);
    let md = $(".movie-details");
    movie.url = url;
    movie.youtube_id = $("#videoId").val();
    movie.title = md.find(".movie-title").text();
    movie.released_date = md.find(".movie-info > p:nth-child(1) > span:nth-child(2)").text();
    movie.run_time = md.find(".movie-info >  p:nth-child(2) > span:nth-child(2)").text();
    movie.director = md.find(".movie-info > p:nth-child(3) > span:nth-child(2)").text();
    movie.genre = md.find(".movie-info > p:nth-child(4) > span:nth-child(2)").text();
    movie.cast = md.find(".movie-info > p:nth-child(5) > span:nth-child(2)").text();
    movie.summary = md.find(".mar-t-15 > p").text();

    try {
      movie.released_date = movie.released_date
        ? moment(movie.released_date, "MMM D, YYYY").format("YYYY-MM-DD")
        : null;
    } catch (e) {}
    return movie;
  }
  async scrapShowList(movie) {
    let showStatus = obj => {
      if (obj.hasClass("time-mark-available")) return "available";
      if (obj.hasClass("time-mark-filling-fast")) return "filling-fast";
      return "sold-out";
    };

    let url = `${baseUrl}/Home/GetShowTimeAndTheatreByEventId?EventId=${
      movie.vendor.id
    }&oldIndex=1&index=-1`;
    let { data } = await axios.get(url);
    const $ = cheerio.load(data);
    let shows = [];
    $(".time-mark").each(function(i, elem) {
      let a = $(this);
      let show = {};
      show.movie = movie._id;
      show.status = showStatus($(this));
      show.url = a.attr("href");
      show.theatre = getParameterByName("TheatreName", show.url);
      show.show_id = getParameterByName("ShowID", show.url);
      show.time = getParameterByName("ShowDate", show.url);
      shows.push(show);
    });
    return shows;
  }

  async exec() {
    //return this.scrapShowList("7448");
    let movieList = [];
    let movies = await this.scrapMovieList();
    for (let m of movies) {
      let movie = await this.scrapMovie(m);
      movieList.push(movie);
    }
    let { data } = await axios({
      url: botUrl,
      method: "POST",
      data: movieList
    });
    let showList = [];
    data = data.filter(d => d.status == "current");
    for (let movie of data) {
      let shows = await this.scrapShowList(movie);
      showList = [...showList, ...shows];
    }

    await axios({
      url: botUrl + "/shows",
      method: "POST",
      data: showList
    });
    return movieList;
  }
}

let qfx = new QFX();
qfx.exec().then(d => console.log(d));
