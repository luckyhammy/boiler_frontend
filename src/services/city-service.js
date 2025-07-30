import HttpService from "./htttp.service";

class CityService {
  getAllCities = async () => {
    const endpoint = '/api/v1/city';
    return await HttpService.get(endpoint);
  };

  addCity = async (cityName) => {
    const endpoint = '/api/v1/city';
    const cityData = { name: cityName };
    return await HttpService.post(endpoint, cityData);
  };

  updateCity = async (cityId, cityName) => {
    const endpoint = `/api/v1/city/${cityId}`;
    const cityData = { name: cityName };
    return await HttpService.patch(endpoint, cityData);
  };

  deleteCity = async (cityId) => {
    const endpoint = `/api/v1/city/${cityId}`;
    return await HttpService.delete(endpoint);
  };
}

export default new CityService(); 