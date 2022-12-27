<template>
  <div class="rightContainer">
    <div id="cityNameBox">
      <div class="cityName">
        <p>{{ cityName }}</p>
        <p>{{ currentTime }}</p>
      </div>
    </div>
    <div id="contentsBox">
      <div class="buttonBox">
        <div class="buttonBackground">
          <button class="forecast">forecast</button>
          <button class="airquality">airquality</button>
        </div>
      </div>
      <div class="weatherBox">
        <div class="airCondition">
          <p>{{ feeling }}</p>
        </div>
        <div class="detail">
          <div class="title">
            <p>🌈상세한 날씨 데이터🌞</p>
          </div>
          <div class="data" v-for="(detailData, index) in subWeatherData" :key="index">
            <div class="dataName">
              <p></p>
              <p>{{ detailData.name }}</p>
            </div>
            <div class="dataValue">
              <p>{{ detailData.value }}<span></span></p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <Map />
    <nav>
      <i class="fas fa-home"></i>
      <i class="fas fa-search-location"></i>
      <i class="fas fa-chart-line"></i>
      <i class="fas fa-cog"></i>
    </nav>
  </div>
</template>

<script>
import Map from '~/components/Map.vue';
import { computed, onMounted, ref, watchEffect } from 'vue';
import dayjs from 'dayjs';
import 'dayjs/locale/ko';
import { useStore } from 'vuex';
dayjs.locale('ko');

export default {
  components: {
    Map,
  },
  setup() {
    let currentTime = dayjs().format('YYYY. MM .DD. ddd'); //현재시간
    let cityName = ref(''); //도시이름
    let feeling = ref(''); //체감온도
    let subWeatherData = ref([]); // 상세 날씨 데이터

    // 타임스탬프로 변환
    const Unix_timestamp = (dt) => {
      let date = new Date(dt * 1000);
      // padStart() 메서드는 현재 문자열의 시작을 다른 문자열로 채워, 주어진 길이를 만족하는 새로운 문자열을 반환합니다.
      // 채워넣기는 대상 문자열의 시작(좌측)부터 적용됩니다.
      let hour = date.getHours().toString().padStart(2, '0');
      return hour.substring(-2) + '시';
    };

    //API호출
    const store = useStore();
    const fetchOpenWeatherApi = async () => {
      //API호출 필수 데이터

      try {
        await store.dispatch('openWeatherApi/FETCH_OPENWEATHER_API');
        const { currentTemp, currentSunrise, currentSunset, currentVisibility, currentFeelsLike } = store.state.openWeatherApi.currentWeather;

        let isInitialCityName = store.state.openWeatherApi.cityName; // 초기 도시이름 데이터
        let isCurrentTemp = computed(() => {
          return currentTemp;
        }); // 초기 현제온도 데이터
        let isTimeOfSunrise = computed(() => {
          return currentSunrise;
        }); // 일출시간 데이터

        let isTimeOfSunSet = computed(() => {
          return currentSunset;
        }); // 일몰시간 데이터

        let isLineOfSight = computed(() => {
          return currentVisibility;
        }); // 가시거리 데이터

        let isFeelsLike = computed(() => {
          return currentFeelsLike;
        }); // 체감온도

        const pivots = [0, 10, 15, 20, 25, 30];
        const labels = ['매우 추움', '추움', '쌀쌀함', '선선함', '보통', '더움', '매우 더움'];
        let index = 0;
        for (const p of pivots) {
          if (isCurrentTemp.value <= p) break;
          index++;
        }
        feeling.value = labels[index];

        let isProcessedData = [
          { name: '일출시간', value: Unix_timestamp(isTimeOfSunrise.value) },
          { name: '일몰시간', value: Unix_timestamp(isTimeOfSunSet.value) },
          { name: '가시거리', value: isLineOfSight.value + 'M' },
          { name: '현제온도', value: Math.round(isCurrentTemp.value) + '도' },
          { name: '체감온도', value: Math.round(isFeelsLike.value) + '도' },
        ];

        cityName.value = isInitialCityName;
        subWeatherData.value = isProcessedData;
      } catch (error) {
        console.log(error);
      }
    };

    watchEffect(async () => {
      await fetchOpenWeatherApi();
    });
    onMounted(() => {
      fetchOpenWeatherApi();
    });
    return {
      currentTime,
      cityName,
      subWeatherData,
      feeling,
    };
  },
};
</script>

<style lang="scss" scoped>
@import '~/scss/main.scss';
@import '~/scss/subview.scss';
</style>
