const axios = require("axios");
const cheerio = require("cheerio");
const config = require("config");
const moment = require("moment-timezone");
const CrawlUtils = require("../utils");

let baseUrl = "https://api.qfxcinemas.com/api/public";

class QFX {
  constructor() {}

  async getCurrent({ withDetails = false, withShows = false }) {
    let { data } = await axios.get(baseUrl + "/NowShowing");
    console.log(data);
    let movies = data.data.map(d => {
      return {
        name: d.name,
        summary: d.annotation,
        trailer: d.mediaLink,
        status: "current",
        release_data: d.releaseDate,
        is_3D: d.is3DMovie,
        thumbnail_url: `${baseUrl}/OneSheetPoster?eventId=${d.eventID}`,
        banner_url: `${baseUrl}/ThumbnailImage?eventId=${d.eventID}`,
        qfx: {
          event_id: d.eventID
        }
      };
    });

    for (let movie of movies) {
      if (withDetails) await this.getMovieDetail(movie);
      if (withShows) await this.getShows(movie);
    }
    return movies;
  }

  async getUpcoming() {
    let { data } = await axios.get(baseUrl + "/ComingSoon");
    let movies = data.data.map(d => {
      return {
        name: d.name,
        summary: d.annotation,
        trailer: d.mediaPlayerTrailerURL,
        status: "upcoming",
        release_data: d.dtLocalRelease,
        thumbnail_url: `${baseUrl}/OneSheetPoster?eventId=${d.id}`,
        banner_url: `${baseUrl}/ThumbnailImage?eventId=${d.id}`,
        qfx: {
          event_id: d.id
        }
      };
    });
    for (let movie of movies) {
      await this.getMovieDetail(movie);
    }
    return movies;
  }

  async getShows(movie) {
    let curDate = moment()
      .tz("Asia/Kathmandu")
      .format("YYYY-MM-DD");

    console.log("Movie shows: " + movie.name);

    let res = await axios.get(`${baseUrl}/ShowInformation?eventId=${movie.qfx.event_id}`);
    let data = res.data.data;
    if (!data.showTheatres) return [];
    movie.shows = [];
    data.showTheatres.forEach(d => {
      d.shows.forEach(s => {
        movie.shows.push({
          theatre: d.theatreName,
          city: d.city,
          auditorium: s.auditoriumName,
          showId: s.showId,
          soldout: s.isSoldOut,
          available: s.isAvailable,
          fastfilling: s.isFastFilling
        });
      });
    });
  }

  async getMovieDetail(movie) {
    console.log("Movie details: " + movie.name);
    try {
      let details = await axios.get(`${baseUrl}/event?eventId=${movie.qfx.event_id}`);
      movie.rating = details.data.data.eventRating;
      movie.length = details.data.data.lengthInMinutes;
      movie.genre = details.data.data.genre;
      movie.director = details.data.data.directorName;
      movie.cast = details.data.data.cast;
    } catch (e) {}
  }

  async getMovies() {
    let current = await this.getCurrent({ withDetails: true });
    let upcoming = await this.getUpcoming();
    let movies = current.concat(upcoming);
    return movies;
  }

  async process() {
    let movies = await this.getMovies();

    let movieList = await CrawlUtils.uploadData({
      path: "/movies",
      data: movies
    });
    return movieList.length;
  }
}
module.exports = new QFX();
