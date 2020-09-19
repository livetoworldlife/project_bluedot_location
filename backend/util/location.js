//102 convert an address into coordinate
const axios = require('axios');

const HttpError = require('../models/http-error');

const API_KEY = process.env.OPENCAGE_API_KEY;

async function getCoordsForAddress(address) {
  // return {
  //   lat: 40.7484474,
  //   lng: -73.9871516
  // };
  // const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${API_KEY}`);
  const response = await axios.get(`https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(address)}&key=${API_KEY}`);

  const data = await response.data;

  if (!data || data.status === 'ZERO_RESULTS') {
    throw new HttpError('Could not find location for the specified address.', 422);
  }
  const coordinates = data.results[0].geometry;
  return coordinates;
}

module.exports = getCoordsForAddress;
