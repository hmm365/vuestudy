// data() {
//     return {
//       //현재 시각 dayjs 플러그인
//       currentTime: dayjs().format('YYYY. MM .DD. ddd'),
//       //현재 시간에 따른 현재 온도 데이터
//       currentTemp: '',
//       //상세 날씨 데이터 받아주는 데이터 할당
//       temps: [],
//       icons: [],
//       arrayTemps: [],

//       cityName: '',
//       //임시 데이터 리턴
//       temporayData: [
//         {
//           title: '습도',
//           value: '',
//         },
//         {
//           title: '풍속',
//           value: '',
//         },
//         {
//           title: '체감온도',
//           value: '',
//         },
//       ],
//     };
//   },

// //초기데이터 선언을 위한 코드
// //https://api.openweathermap.org/data/3.0/onecall?lat={lat}&lon={lon}&exclude={part}&appid={API key}
// const API_KEY = '2f766e232c8fe128ddd840ee1315cf1a';
// const initialLat = 37.5683;
// const initialLon = 126.9778;
// //get()메서드를 통해서 API 데이터 호출
// axios
//   .get(`https://api.openweathermap.org/data/2.5/weather?lat=${initialLat}&lon=${initialLon}&appid=${API_KEY}&units=metric`)
//   .then((response) => {
//     // console.log(response.data);
//     let initialCurrentWeatherData = response.data;
//     this.cityName = initialCurrentWeatherData.name;
//     this.currentTemp = initialCurrentWeatherData.main.temp;
//     this.temporayData[0].value = initialCurrentWeatherData.main.humidity + '%';
//     this.temporayData[1].value = initialCurrentWeatherData.wind.speed + 'm/s';
//     this.temporayData[2].value = Math.round(initialCurrentWeatherData.main.feels_like) + '도';
//   })
//   .catch((error) => {
//     console.log(error);
//   });
// //시간대별 닐씨 데이터
// axios
//   .get(`https://api.openweathermap.org/data/2.5/forecast?lat=${initialLat}&lon=${initialLon}&appid=${API_KEY}&units=metric`)
//   .then((response) => {
//     for (let i = 0; i < 8; i++) {
//       this.arrayTemps[i] = response.data.list[i];
//     }
//     // console.log(this.arrayTemps);
//   })
//   .catch((error) => {
//     console.log(error);
//   });

// const fetchOpenWeatherApi = async () => {
//     //API호출 필수 데이터
//     const API_KEY = '2f766e232c8fe128ddd840ee1315cf1a';
//     const initialLat = 37.5683;
//     const initialLon = 126.9778;

//     try {
//       const res = await axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${initialLat}&lon=${initialLon}&appid=${API_KEY}&units=metric`);
//       // console.log(res.data);
//       let isInitialData = res.data.main; // 온도데이터
//       let isInitialCityName = res.data.name; //도시이름
//       let isInitialSunrise = res.data.sys.sunrise; //일출시간
//       let isInitialSunset = res.data.sys.sunset; //일몰시간
//       let isInitialVisibility = res.data.visibility; //가시거리
//       let isFeelsLike = isInitialData.feels_like; //체감온도
//       let isTempMax = isInitialData.temp_max; //최고온도
//       let isTempMin = isInitialData.temp_min; //최저온도

//       // if (isFeelsLike > 30) feeling.value = '매우더움';
//       // if (isFeelsLike <= 30) feeling.value = '더움';
//       // if (isFeelsLike <= 25) feeling.value = '보통';
//       // if (isFeelsLike <= 20) feeling.value = '신선함';
//       // if (isFeelsLike <= 15) feeling.value = '쌀쌀함';
//       // if (isFeelsLike <= 10) feeling.value = '추움';
//       // if (isFeelsLike <= 0) feeling.value = '매우추움';

//       const pivots = [0, 10, 15, 20, 25, 30];
//       const labels = ['매우 추움', '추움', '쌀쌀함', '선선함', '보통', '더움', '매우 더움'];
//       let index = 0;
//       for (const p of pivots) {
//         if (isFeelsLike <= p) break;
//         index++;
//       }
//       feeling.value = labels[index];

//       let isProcessedData = [
//         { name: '일출시간', value: Unix_timestamp(isInitialSunrise) },
//         { name: '일몰시간', value: Unix_timestamp(isInitialSunset) },
//         { name: '가시거리', value: isInitialVisibility + 'M' },
//         { name: '최고온도', value: Math.round(isTempMax) + '도' },
//         { name: '최저온도', value: Math.round(isTempMin) + '도' },
//       ];

//       cityName.value = isInitialCityName;
//       subWeatherData.value = isProcessedData;
//     } catch (error) {
//       console.log(error);
//     }
//   };
