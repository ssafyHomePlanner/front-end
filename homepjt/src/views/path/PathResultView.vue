<template>
  <v-container fill-height fluid class="ma-8">
    <v-row>
      <v-col cols="auto">
        <v-container>
          <v-row justify="space-between">
            <v-col>
              <v-btn-toggle
                v-model="pathResultType"
                tile
                color="deep-purple accent-3"
                group
              >
                <v-btn value="time" @click="changeCandidateTimePath">
                  시간순
                </v-btn>
                <v-btn value="distance" @click="changeCandidateDistancePath">
                  거리순
                </v-btn>
              </v-btn-toggle>
            </v-col>
            <v-col cols="auto">
              <v-btn @click="savePath" class="mt-4" color="primary"
                ><v-icon>mdi-content-save</v-icon>경로 저장</v-btn
              >
            </v-col>
          </v-row>
        </v-container>
        <v-container id="map" style="width: 925px; height: 625px">
        </v-container>
      </v-col>
      <v-col cols="auto" class="mr-5 mt-12">
        <v-container class="ml-0 mr-5 pr-1" style="width: 450px; height: 500px">
          <v-virtual-scroll
            bench="5"
            :items="timeList"
            height="400"
            item-height="80"
            class="pa-1 mt-3"
          >
            <template v-slot:default="{ item }">
              <v-list-item :key="item.index">
                <v-list-item-content>
                  <v-list-item-title
                    v-text="item.startName"
                  ></v-list-item-title>
                </v-list-item-content>
                <v-list-item-content>
                  <v-container style="width: 100px; height: 50px">
                    <v-row justify="center">
                      <v-icon large>mdi-forward</v-icon>
                      예상 시간:
                      {{ timeArr[item.startIndex][item.endIndex] }}초
                    </v-row>
                  </v-container>
                </v-list-item-content>
                <v-list-item-content>
                  <v-list-item-title v-text="item.endName"></v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-divider></v-divider>
            </template>
          </v-virtual-scroll>
        </v-container>
        <v-container style="width: 100%; height: 100px">
          <h2>
            거리: {{ this.currentPath.dist }}미터 | 예상 시간:
            {{ this.currentPath.time }}초
          </h2>
        </v-container>
      </v-col>
    </v-row>
    <v-container class="mt-7 mb-12 ml-1" style="width: 100%">
      <v-row>
        <v-col class="ma-5">
          <v-stepper
            alt-labels
            v-for="(data, index) in currentCandidatePathList"
            :key="index"
            value="0"
          >
            <v-row>
              <v-col class="pr-0">
                <v-stepper-header>
                  <template v-for="(element, i) in data.pathList">
                    <v-stepper-step :step="i + 1" :key="element.aptName">
                      {{ element.aptName }}
                    </v-stepper-step>
                    <v-divider :key="i"></v-divider>
                  </template>
                </v-stepper-header>
              </v-col>
              <v-col cols="auto" align-self="center" class="pl-0">
                <v-btn
                  color="primary"
                  style="height: 60px"
                  x-large
                  @click="changePath(data)"
                  >선택</v-btn
                >
              </v-col>
            </v-row>
          </v-stepper>
        </v-col>
      </v-row>
    </v-container>
  </v-container>
</template>

<script>
import { mapState, mapActions } from "vuex";

const bookmarkStore = "bookmarkStore";

export default {
  computed: {
    ...mapState(bookmarkStore, [
      "timePathList",
      "distPathList",
      "timeArr",
      "distArr",
      "requestList",
    ]),
  },

  data() {
    return {
      // polyline null이어야 함!!!!!!!!!!
      polyline: null,
      startMarker: null,
      endMarker: null,
      // distanceOverlay: {},
      pathResultType: "time",
      dots: [],
      currentCandidatePathList: [],
      currentPath: [],
      timeList: [],
      firstLoading: true,
    };
  },
  methods: {
    ...mapActions(bookmarkStore, ["insertPathList"]),
    changePath(element) {
      console.log("element", element);
      this.currentPath = element;
      this.eachPathTimeList();
      this.makeLine();
    },
    eachPathTimeList() {
      console.log("this.currentPath.pathList", this.currentPath.pathList);
      this.timeList = [];

      for (let i = 0; i < this.currentPath.pathList.length - 1; i++) {
        let startIndex = -1;
        let endIndex = -1;

        // 거리 계산을 위해 요청리스트의 순서 찾기
        for (let j = 0; j < this.requestList.length; j++) {
          if (
            this.requestList[j].aptName == this.currentPath.pathList[i].aptName
          ) {
            startIndex = j;
          }

          if (
            this.requestList[j].aptName ==
            this.currentPath.pathList[i + 1].aptName
          ) {
            endIndex = j;
          }
        }

        let temp = {
          startName: this.currentPath.pathList[i].aptName,
          endName: this.currentPath.pathList[i + 1].aptName,
          startIndex: startIndex,
          endIndex: endIndex,
        };

        this.timeList.push(temp);
      }

      console.log("timeList", this.timeList);
    },
    changeCandidateTimePath() {
      //현재 후보리스트 TimePathList로 초기화
      this.currentCandidatePathList =
        this.$store.state.bookmarkStore.timePathList;
      this.currentPath = this.$store.state.bookmarkStore.timePathList[0];
      console.log("currentCandidatePathList", this.currentCandidatePathList);
      console.log("currentPath", this.currentPath);
      console.log("현재 타임경로");
      this.eachPathTimeList();
      if (!this.firstLoading) {
        this.makeLine();
      }
    },
    changeCandidateDistancePath() {
      //현재 후보리스트 DistPathList 초기화
      this.currentCandidatePathList =
        this.$store.state.bookmarkStore.distPathList;
      this.currentPath = this.$store.state.bookmarkStore.distPathList[0];
      console.log("currentCandidatePathList", this.currentCandidatePathList);
      console.log("currentPath", this.currentPath);
      console.log("현재 거리경로");
      this.eachPathTimeList();
      this.makeLine();
    },
    savePath() {
      let name = prompt("저장될 경로의 이름을 입력해주세요");
      if (name != "" && name != null) {
        alert("해당 경로가 저장되었습니다!!");
        let tempObject = {
          memberId: this.$store.state.memberStore.userInfo.id,
          pathName: name,
        };

        console.log("tempObject", tempObject);

        this.insertPathList(tempObject);
      } else if (name == "") {
        alert("경로 이름을 넣어주세요!!");
      }
      // console.log("timePathList", this.timePathList);
      // console.log("distPathList", this.distPathList);
      // console.log("timeArr", this.timeArr);
      // console.log("distArr", this.distArr);
      // console.log("requestList", this.requestList);
    },

    // 선이 그려지고 있는 상태일 때 지도를 클릭하면 호출하여
    // 클릭 지점에 대한 정보 (동그라미와 클릭 지점까지의 총거리)를 표출하는 함수입니다
    displayCircleDot(position) {
      // 클릭 지점을 표시할 빨간 동그라미 커스텀오버레이를 생성합니다
      let circleOverlay = new kakao.maps.CustomOverlay({
        content: '<span class="dot"></span>',
        position: position,
        zIndex: 1,
      });

      // 지도에 표시합니다
      circleOverlay.setMap(this.map);
      // 배열에 추가합니다
      this.dots.push({ circle: circleOverlay });
    },
    makeLine() {
      let firstIconSrc = require("@/assets/number-one.png"),
        firstSize = new kakao.maps.Size(50, 45),
        firstOption = {
          offset: new kakao.maps.Point(15, 43),
        };
      let firstIconImage = new kakao.maps.MarkerImage(
        firstIconSrc,
        firstSize,
        firstOption
      );
      let secondIconSrc = require("@/assets/number-two.png"),
        secondSize = new kakao.maps.Size(50, 45),
        secondOption = {
          offset: new kakao.maps.Point(15, 43),
        };
      let secondIconImage = new kakao.maps.MarkerImage(
        secondIconSrc,
        secondSize,
        secondOption
      );
      let thirdIconSrc = require("@/assets/number-three.png"),
        thirdSize = new kakao.maps.Size(50, 45),
        thirdOption = {
          offset: new kakao.maps.Point(15, 43),
        };
      let thirdIconImage = new kakao.maps.MarkerImage(
        thirdIconSrc,
        thirdSize,
        thirdOption
      );
      let fourIconSrc = require("@/assets/number-four.png"),
        fourSize = new kakao.maps.Size(50, 45),
        fourOption = {
          offset: new kakao.maps.Point(15, 43),
        };
      let fourIconImage = new kakao.maps.MarkerImage(
        fourIconSrc,
        fourSize,
        fourOption
      );
      let fiveIconSrc = require("@/assets/number-five.png"),
        fiveSize = new kakao.maps.Size(50, 45),
        fiveOption = {
          offset: new kakao.maps.Point(15, 43),
        };
      let fiveIconImage = new kakao.maps.MarkerImage(
        fiveIconSrc,
        fiveSize,
        fiveOption
      );

      let linePath = [];
      // 만들어질 경로의 위도/경도를 넣는다.
      this.currentPath.pathList.forEach((element) => {
        linePath.push(new kakao.maps.LatLng(element.lat, element.lon));
      });

      console.log("linePath", linePath);

      let startSrc =
          "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/red_b.png", // 출발 마커이미지의 주소입니다
        startSize = new kakao.maps.Size(50, 45), // 출발 마커이미지의 크기입니다
        startOption = {
          offset: new kakao.maps.Point(15, 43), // 출발 마커이미지에서 마커의 좌표에 일치시킬 좌표를 설정합니다 (기본값은 이미지의 가운데 아래입니다)
        };

      // 출발 마커 이미지를 생성합니다
      let startImage = new kakao.maps.MarkerImage(
        startSrc,
        startSize,
        startOption
      );

      let arriveSrc =
          "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/blue_b.png", // 도착 마커이미지 주소입니다
        arriveSize = new kakao.maps.Size(50, 45), // 도착 마커이미지의 크기입니다
        arriveOption = {
          offset: new kakao.maps.Point(15, 43), // 도착 마커이미지에서 마커의 좌표에 일치시킬 좌표를 설정합니다 (기본값은 이미지의 가운데 아래입니다)
        };

      // 도착 마커 이미지를 생성합니다
      let arriveImage = new kakao.maps.MarkerImage(
        arriveSrc,
        arriveSize,
        arriveOption
      );

      for (let i = 0; i < linePath.length; i++) {
        //출발 좌표 표시
        if (i == 0) {
          if (this.startMarker) {
            this.startMarker.setMap(null);
            this.startMarker = null;
          }

          // 출발 마커를 생성합니다
          // 결과값으로 받은 위치를 마커로 표시합니다
          this.startMarker = new kakao.maps.Marker({
            map: this.map, // 출발 마커가 지도 위에 표시되도록 설정합니다
            position: linePath[i],
            image: startImage, // 출발 마커이미지를 설정합니다
          });
        }

        if (i == 1 && 1 != linePath.length - 1) {
          new kakao.maps.Marker({
            map: this.map,
            position: linePath[i],
            image: firstIconImage,
          });
        }
        if (i == 2 && 2 != linePath.length - 1) {
          new kakao.maps.Marker({
            map: this.map,
            position: linePath[i],
            image: secondIconImage,
          });
        }
        if (i == 3 && 3 != linePath.length - 1) {
          new kakao.maps.Marker({
            map: this.map,
            position: linePath[i],
            image: thirdIconImage,
          });
        }
        if (i == 4 && 4 != linePath.length - 1) {
          new kakao.maps.Marker({
            map: this.map,
            position: linePath[i],
            image: fourIconImage,
          });
        }
        if (i == 5 && 5 != linePath.length - 1) {
          new kakao.maps.Marker({
            map: this.map,
            position: linePath[i],
            image: fiveIconImage,
          });
        }

        if (i == linePath.length - 1) {
          if (this.endMarker) {
            this.endMarker.setMap(null);
            this.endMarker = null;
          }

          // 도착 마커를 생성합니다
          // 결과값으로 받은 위치를 마커로 표시합니다
          this.endMarker = new kakao.maps.Marker({
            map: this.map, // 도착 마커가 지도 위에 표시되도록 설정합니다
            position: linePath[i],
            image: arriveImage, // 도착 마커이미지를 설정합니다
          });
        }

        this.displayCircleDot(linePath[i]);
      }

      if (this.polyline) {
        this.polyline.setMap(null);
        this.polyline = null;
      }

      this.polyline = new kakao.maps.Polyline({
        path: linePath, // 선을 구성하는 좌표 배열입니다 클릭한 위치를 넣어줍니다
        strokeWeight: 3, // 선의 두께입니다
        strokeColor: "#db4040", // 선의 색깔입니다
        strokeOpacity: 1, // 선의 불투명도입니다 0에서 1 사이값이며 0에 가까울수록 투명합니다
        strokeStyle: "solid", // 선의 스타일입니다
      });

      // 선 화면에 그리기
      this.polyline.setMap(this.map);

      //맵에서 이동할 좌표
      let iwPosition = new kakao.maps.LatLng(
        this.currentPath.pathList[0].lat,
        this.currentPath.pathList[0].lon
      );

      // 지도의 중심을 결과값으로 받은 위치로 이동시킵니다
      this.map.setCenter(iwPosition);
    },
    initMap() {
      const container = document.getElementById("map");
      const options = {
        center: new kakao.maps.LatLng(36.35515, 127.298415),
        level: 5,
      };

      //지도 객체를 등록합니다.
      //지도 객체는 반응형 관리 대상이 아니므로 initMap에서 선언합니다.
      this.map = new kakao.maps.Map(container, options);

      this.makeLine();
    },
  },
  mounted() {
    this.changeCandidateTimePath();
    this.firstLoading = false;

    if (window.kakao && window.kakao.maps) {
      this.initMap();
    } else {
      const script = document.createElement("script");
      /* global kakao */
      script.onload = () => kakao.maps.load(this.initMap);
      script.src =
        "//dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=e22041108e144667e2284ec7ed6bc357&libraries=services,clusterer,drawing";
      // script.src =
      //   "//dapi.kakao.com/v2/maps/sdk.js?autoload=false&appkey=" +
      //   process.env.VUE_APP_APT_DEAL_API_KEY;
      document.head.appendChild(script);
    }
  },
};
</script>

<style>
#map {
  width: 100%;
  height: 600px;
}
.dot {
  overflow: hidden;
  float: left;
  width: 12px;
  height: 12px;
  background: url("https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/mini_circle.png");
}
.dotOverlay {
  position: relative;
  bottom: 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
  border-bottom: 2px solid #ddd;
  float: left;
  font-size: 12px;
  padding: 5px;
  background: #fff;
}
.dotOverlay:nth-of-type(n) {
  border: 0;
  box-shadow: 0px 1px 2px #888;
}
.number {
  font-weight: bold;
  color: #ee6152;
}
.dotOverlay:after {
  content: "";
  position: absolute;
  margin-left: -6px;
  left: 50%;
  bottom: -8px;
  width: 11px;
  height: 8px;
  background: url("https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/vertex_white_small.png");
}
.distanceInfo {
  position: relative;
  top: 5px;
  left: 5px;
  list-style: none;
  margin: 0;
}
.distanceInfo .label {
  display: inline-block;
  width: 50px;
}
.distanceInfo:after {
  content: none;
}
</style>
