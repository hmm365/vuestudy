<template>
  <div id="mapContainer">
    <div id="map"></div>
  </div>
</template>

<script>
import MapPositions from '~/assets/map-positions.json';
export default {
  data() {
    return {};
  },
  mounted() {
    if (window.kakao && window.kakao.maps) {
      this.initMap();
    } else {
      const script = document.createElement('script');
      /* global kakao */
      script.onload = () => kakao.maps.load(this.initMap);
      script.src = 'http://dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=d0ea649f169275d9adcdc4bbce692a98';
      document.head.appendChild(script);
    }
  },

  methods: {
    initMap() {
      let mapContainer = document.getElementById('map'); // 지도를 표시할 div
      let mapOption = {
        center: new kakao.maps.LatLng(37.5683, 126.9778), // 지도의 중심좌표(중앙역)
        level: 5, // 지도의 확대 레벨
      };
      let map = new kakao.maps.Map(mapContainer, mapOption);
      const positions = MapPositions.map((pos) => ({
        latlng: new kakao.maps.LatLng(...pos.latlng),
        cityName: pos.cityName,
      }));

      //마커를 생성합니다.
      positions.forEach((pos) => {
        let marker = new kakao.maps.Marker({
          //마커 위치
          position: pos.latlng,
        });
        //마커가 지도 위에 표시
        marker.setMap(map);
        kakao.maps.event.addListener(marker, 'click', () => {
          // 클릭한 위도, 경도 정보를 가져옵니다
          // watch로 따로 빼지 않고, 직접 할당
          this.$store.commit('openWeatherApi/SET_CITYNAME', pos.cityName);
          this.$store.commit('openWeatherApi/SET_LATLON', marker.getPosition());
          this.$store.dispatch('openWeatherApi/FETCH_OPENWEATHER_API');
        });
      });
    },
  },
};
</script>

<style lang="scss" scoped>
@import '~/scss/main.scss';
#mapContainer {
  @include center;
  width: 100%;
  height: 35%;
  #map {
    width: 80%;
    height: 90%;
    border-radius: 10px;
  }
}
</style>
