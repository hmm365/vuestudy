import axios from 'axios';

export default {
  //namespaced 하나의 store에서 모듈화하여 사용될 수 있음을 명시
  namespaced: true,
  //state: 실제로 취급하는 데이터
  state: {
    position: {
      lat: 37.5683,
      lon: 126.9778,
    },
    cityName: 'Seoul',
    currentWeather: {
      //Main
      currentTemp: 0,
      currentHumidity: 0,
      currentWindSpeed: 0,
      currentFeelsLike: 0,
      //Sub
      currentSunrise: 0,
      currentSunset: 0,
      currentVisibility: 0,
      currentTempMax: 0,
      currentTempMin: 0,
    },
    hourlyWeather: [],
    images: [],
  },
  //getters: 계산된 상태의 데이터를 만들어냄
  getters: {},
  //mutations: state 를 변경할수있다
  mutations: {
    SET_LATLON(state, payload) {
      state.position.lat = payload.Ma;
      state.position.lon = payload.La;
    },
    SET_CITYNAME(state, payload) {
      state.cityName = payload;
    },
    SET_CURRENT_WEATHER(state, payload) {
      state.currentWeather.currentTemp = Math.round(payload.main.temp); // 현재온도
      state.currentWeather.currentHumidity = payload.main.humidity; // 습도
      state.currentWeather.currentWindSpeed = payload.wind.speed; // 풍속
      state.currentWeather.currentFeelsLike = Math.round(payload.main.feels_like); // 체감온도
      state.currentWeather.currentSunrise = payload.sys.sunrise; // 일출시간
      state.currentWeather.currentSunset = payload.sys.sunset; // 일몰시간
      state.currentWeather.currentVisibility = payload.visibility; // 가시거리
      state.currentWeather.currentTempMax = payload.main.temp_max; // 최대온도
      state.currentWeather.currentTempMin = payload.main.temp_min; // 최저온도
    },
    SET_TIMELY_WEATHER(state, payload) {
      state.hourlyWeather = payload;
    },
    SET_IMAGEPATH(state, payload) {
      state.images = payload;
    },
  },

  //action: context라는 객체데이터를 호출하여 context 참조하여 불러옴
  actions: {
    async FETCH_OPENWEATHER_API(context) {
      //초기데이터 선언을 위한 코드
      //https://api.openweathermap.org/data/3.0/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}
      const API_KEY = '2f766e232c8fe128ddd840ee1315cf1a';
      let initialLat = context.state.position.lat;
      let initialLon = context.state.position.lon;
      //get()메서드를 통해서 API 데이터 호출
      try {
        const res = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${initialLat}&lon=${initialLon}&appid=${API_KEY}&units=metric`);
        const res2 = await axios.get(`https://api.openweathermap.org/data/2.5/forecast?lat=${initialLat}&lon=${initialLon}&appid=${API_KEY}&units=metric`);
        // console.log(res2.data);
        const images = new Array();
        for (let i = 0; i < 40; i++) {
          const weatherIcon = res2.data.list[i].weather[0].icon;
          //   images[i] = `src/assets/images/${weatherIcon}.png`;
          images[i] = `https://github.com/hmm365/vuestudy/blob/master/src/assets/images/${weatherIcon}.png?raw=true`;
        }
        console.log(res.data);
        context.commit('SET_IMAGEPATH', images);
        context.commit('SET_CURRENT_WEATHER', res.data); // 조회하는 현재시간에 대한 날씨데이터
        context.commit('SET_TIMELY_WEATHER', res2.data.list); // 시간대별 날씨데이터
      } catch (error) {
        console.log(error);
      }
    },
  },
};

//https://github.com/hmm365/vuestudy/blob/master/src/assets/images/01d.png?raw=true
