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
            <p>πμμΈν λ μ¨ λ°μ΄ν°π</p>
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
    let currentTime = dayjs().format('YYYY. MM .DD. ddd'); //νμ¬μκ°
    let cityName = ref(''); //λμμ΄λ¦
    let feeling = ref(''); //μ²΄κ°μ¨λ
    let subWeatherData = ref([]); // μμΈ λ μ¨ λ°μ΄ν°

    // νμμ€ν¬νλ‘ λ³ν
    const Unix_timestamp = (dt) => {
      let date = new Date(dt * 1000);
      // padStart() λ©μλλ νμ¬ λ¬Έμμ΄μ μμμ λ€λ₯Έ λ¬Έμμ΄λ‘ μ±μ, μ£Όμ΄μ§ κΈΈμ΄λ₯Ό λ§μ‘±νλ μλ‘μ΄ λ¬Έμμ΄μ λ°νν©λλ€.
      // μ±μλ£κΈ°λ λμ λ¬Έμμ΄μ μμ(μ’μΈ‘)λΆν° μ μ©λ©λλ€.
      let hour = date.getHours().toString().padStart(2, '0');
      return hour.substring(-2) + 'μ';
    };

    //APIνΈμΆ
    const store = useStore();
    const fetchOpenWeatherApi = async () => {
      //APIνΈμΆ νμ λ°μ΄ν°

      try {
        await store.dispatch('openWeatherApi/FETCH_OPENWEATHER_API');
        const { currentTemp, currentSunrise, currentSunset, currentVisibility, currentFeelsLike } = store.state.openWeatherApi.currentWeather;

        let isInitialCityName = store.state.openWeatherApi.cityName; // μ΄κΈ° λμμ΄λ¦ λ°μ΄ν°
        let isCurrentTemp = computed(() => {
          return currentTemp;
        }); // μ΄κΈ° νμ μ¨λ λ°μ΄ν°
        let isTimeOfSunrise = computed(() => {
          return currentSunrise;
        }); // μΌμΆμκ° λ°μ΄ν°

        let isTimeOfSunSet = computed(() => {
          return currentSunset;
        }); // μΌλͺ°μκ° λ°μ΄ν°

        let isLineOfSight = computed(() => {
          return currentVisibility;
        }); // κ°μκ±°λ¦¬ λ°μ΄ν°

        let isFeelsLike = computed(() => {
          return currentFeelsLike;
        }); // μ²΄κ°μ¨λ

        const pivots = [0, 10, 15, 20, 25, 30];
        const labels = ['λ§€μ° μΆμ', 'μΆμ', 'μμν¨', 'μ μ ν¨', 'λ³΄ν΅', 'λμ', 'λ§€μ° λμ'];
        let index = 0;
        for (const p of pivots) {
          if (isCurrentTemp.value <= p) break;
          index++;
        }
        feeling.value = labels[index];

        let isProcessedData = [
          { name: 'μΌμΆμκ°', value: Unix_timestamp(isTimeOfSunrise.value) },
          { name: 'μΌλͺ°μκ°', value: Unix_timestamp(isTimeOfSunSet.value) },
          { name: 'κ°μκ±°λ¦¬', value: isLineOfSight.value + 'M' },
          { name: 'νμ μ¨λ', value: Math.round(isCurrentTemp.value) + 'λ' },
          { name: 'μ²΄κ°μ¨λ', value: Math.round(isFeelsLike.value) + 'λ' },
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
