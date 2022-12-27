import { createStore } from 'vuex';
import openWeatherApi from './openWeatherApi';

export default createStore({
  modules: {
    openWeatherApi,
  },
});
