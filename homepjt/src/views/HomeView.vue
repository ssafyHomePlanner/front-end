<template>
  <div class="item">
    <div class="item-bg">
      <div class="item-header-text">Home Planner</div>
      <div class="item-header-subtext">
        내 집 마련, 언제까지 생각만 할껀가요?
      </div>
      <v-container>
        <v-row justify="center">
          <v-sheet
            rounded="xl"
            class="item-header-card"
            color="white"
            elevation="8"
            height="185"
            width="825"
          >
            <v-container fill-height fluid>
              <v-autocomplete
                :items="houseInfoList"
                :search-input.sync="search"
                class="mt-5 ml-8 mr-8"
                solo
                label="아파트를 검색해보세요."
                @input="inputChanged"
                ref="autoinput"
                v-model="aptObject"
                clearable
                @keyup.enter="makeHouseInfoList"
                item-text="apartmentName"
                item-value="apartmentName"
                return-object
              >
                <template v-slot:no-data>
                  <v-row justify="space-between" class="ma-2">
                    <h3 class="ma-2">최근 검색어</h3>
                    <v-btn @click="deleteAllRecentSearch" text class="ma-2"
                      >전체삭제
                    </v-btn>
                  </v-row>
                  <v-list-item
                    v-for="(recentData, index) in recentDataList"
                    :key="index"
                  >
                    <v-list-item-action>
                      <v-icon>mdi-clock-outline</v-icon>
                    </v-list-item-action>
                    <v-list-item-content
                      @click="clickRecentSearch(recentData.searchedName)"
                    >
                      <v-list-item-title>
                        {{ recentData.searchedName }}
                      </v-list-item-title>
                    </v-list-item-content>
                    <v-list-item-action>
                      <v-btn icon @click="deleteRecentSearch(recentData.id)">
                        <v-icon>mdi-close</v-icon>
                      </v-btn>
                    </v-list-item-action>
                  </v-list-item>
                </template>
              </v-autocomplete>
              <v-row justify="center" class="ml-2 mr-2">
                <v-col cols="3">
                  <v-select
                    v-model="sidoName"
                    :items="sidoList"
                    no-data-text="데이터가 존재하지 않습니다."
                    label="시도 선택"
                    @change="makeGugunList"
                  ></v-select>
                </v-col>
                <v-col cols="3">
                  <v-select
                    v-model="gugunName"
                    :items="gugunList"
                    no-data-text="데이터가 존재하지 않습니다."
                    label="시군구 선택"
                    @change="makeDongList"
                  ></v-select>
                </v-col>
                <v-col cols="3">
                  <v-select
                    v-model="dongName"
                    :items="dongList"
                    no-data-text="데이터가 존재하지 않습니다."
                    label="읍면동 선택"
                  ></v-select>
                </v-col>
                <v-col cols="auto">
                  <v-btn color="primary" x-large @click="makeHouseInfoList"
                    >검색</v-btn
                  >
                </v-col>
              </v-row>
            </v-container>
          </v-sheet>
        </v-row>
      </v-container>
    </div>
    <v-container class="mt-16 pt-16 pb-16 mb-16 text-center">
      <div class="item-middle-text">아파트 구매 계획 세우기</div>
      <div class="item-middle-subtext mt-2">원하는 아파트를 찾으셨나요?</div>
      <v-container class="mt-8 mb-8" style="width: 1167px">
        <v-row justify="space-between">
          <v-sheet height="278" width="214" elevation="4" class="pt-7">
            <v-row justify="center" class="mt-5">
              <v-icon size="109" color="green darken-2"> mdi-bank </v-icon>
            </v-row>
            <v-row class="item-middle-box-text mt-4" justify="center">
              저축 계획 세우기
            </v-row>
            <v-row justify="center" class="item-middle-box-subtext mt-4">
              내가 찜한 아파트를 목표로 <br />
              저축 계획 세우기
            </v-row>
          </v-sheet>
          <v-sheet height="278" width="214" elevation="4" class="pt-7">
            <v-row justify="center" class="mt-5">
              <v-icon size="109" color="red darken-2"> mdi-check </v-icon>
            </v-row>
            <v-row class="item-middle-box-text mt-4" justify="center">
              계획 점검하기
            </v-row>
            <v-row justify="center" class="item-middle-box-subtext mt-4">
              내가 목표로 한 저축 계획이 <br />
              실천할 수 있는 계획인지 체크
            </v-row>
          </v-sheet>
          <v-sheet height="278" width="214" elevation="4" class="pt-7">
            <v-row justify="center" class="mt-5">
              <v-icon size="109" color="yellow darken-2">
                mdi-clock-outline
              </v-icon>
            </v-row>
            <v-row class="item-middle-box-text mt-4" justify="center">
              계획 실천하기
            </v-row>
            <v-row justify="center" class="item-middle-box-subtext mt-4">
              내 계획을 잘 지키고 있는지 <br />
              지속적으로 체크하기
            </v-row>
          </v-sheet>
          <v-sheet height="278" width="214" elevation="4" class="pt-7">
            <v-row justify="center" class="mt-5">
              <v-icon size="109" color="blue darken-2"> mdi-home </v-icon>
            </v-row>
            <v-row class="item-middle-box-text mt-4" justify="center">
              내 집 마련 성공!!
            </v-row>
            <v-row justify="center" class="item-middle-box-subtext mt-4">
              드디어 내가 원하던 집을 <br />
              구매했다!
            </v-row>
          </v-sheet>
        </v-row>
      </v-container>
      <v-container fluid style="max-width: 600px">
        <v-btn style="height:60px" @click="movePlannerView" outlined block class="mt-8"
          >구매 계획 세우러 가기</v-btn
        >
      </v-container>
    </v-container>
    <v-container class="mt-16 pt-16 pb-16 mb-16 text-center">
      <div class="item-middle-text">아파트 경로 찾기</div>
      <div class="item-middle-subtext mt-2">
        보고싶은 아파트는 많은데 여디부터 가야할지 모르겠나요?
      </div>
      <v-container class="mt-8 mb-8" style="width: 1167px">
        <v-row justify="space-between" class="ml-6 mr-6">
          <v-sheet
            height="164"
            width="274"
            elevation="4"
            class="pt-4"
            rounded="xl"
          >
            <v-row justify="start" class="ml-8">
              <v-col cols="auto" class="pa-0 mt-7">
                <v-sheet
                  class="rounded-circle pt-1"
                  elevation="2"
                  height="30"
                  width="30"
                  >1</v-sheet
                >
              </v-col>
              <v-col cols="auto" class="ml-3">
                <v-row class="item-middle-box-text mt-4" justify="start">
                  위브더스테이트
                </v-row>
                <v-row
                  justify="start"
                  class="item-middle-box-subtext mt-3 text-start"
                >
                  경기도 부천시 원미구<br /><br />
                  건축 년도: 2010.08
                </v-row>
              </v-col>
            </v-row>
          </v-sheet>
          <v-icon size="40"> mdi-play </v-icon>
          <v-sheet
            height="164"
            width="274"
            elevation="4"
            class="pt-4"
            rounded="xl"
          >
            <v-row justify="start" class="ml-8">
              <v-col cols="auto" class="pa-0 mt-7">
                <v-sheet
                  class="rounded-circle pt-1"
                  elevation="2"
                  height="30"
                  width="30"
                  >2</v-sheet
                >
              </v-col>
              <v-col cols="auto" class="ml-3">
                <v-row class="item-middle-box-text mt-4" justify="start">
                  소사 SKView
                </v-row>
                <v-row
                  justify="start"
                  class="item-middle-box-subtext mt-3 text-start"
                >
                  경기도 부천시 소사구<br /><br />
                  건축 년도: 2016.07
                </v-row>
              </v-col>
            </v-row>
          </v-sheet>
          <v-icon size="40"> mdi-play </v-icon>
          <v-sheet
            height="164"
            width="274"
            elevation="4"
            class="pt-4"
            rounded="xl"
          >
            <v-row justify="start" class="ml-8">
              <v-col cols="auto" class="pa-0 mt-7">
                <v-sheet
                  class="rounded-circle pt-1"
                  elevation="2"
                  height="30"
                  width="30"
                  >3</v-sheet
                >
              </v-col>
              <v-col cols="auto" class="ml-3">
                <v-row class="item-middle-box-text mt-4" justify="start">
                  범박 힐스테이트
                </v-row>
                <v-row
                  justify="start"
                  class="item-middle-box-subtext mt-3 text-start"
                >
                  경기도 부천시 도봉구<br /><br />
                  건축 년도: 2013.02
                </v-row>
              </v-col>
            </v-row>
          </v-sheet>
        </v-row>
      </v-container>
      <v-container fluid style="max-width: 600px">
        <v-btn style="height:60px" @click="movePathView" outlined block class="mt-8"
          >아파트 최적 경로 찾기</v-btn
        >
      </v-container>
    </v-container>
  </div>
</template>

<script>
import { mapState, mapActions, mapMutations } from "vuex";

const aptStore = "aptStore";
const houseInfoStore = "houseInfoStore";
const memberStore = "memberStore";

export default {
  name: "HomeView",

  data() {
    return {
      aptObject: {},
      sidoName: "",
      gugunName: "",
      dongName: "",
      page: 1,
      search: "",
    };
  },
  watch: {
    search(val) {
      if (!val) {
        this.aptObject.apartmentName = "";
        this.CLEAR_HOUSE_INFO_LIST();
        return;
      }
      this.aptObject.apartmentName = val;
      this.makeHouseInfoListAuto(val);
    },
  },
  create() {
    this.CLEAR_SIDO_LIST();
    this.CLEAR_GUGUN_LIST();
    this.CLEAR_DONG_LIST();

    this.CLEAR_SEARCH_HOUSE_INFO_LIST();
    this.CLEAR_SEARCH_HOUSE_INFO();
    // this.searchSidoList();
  },
  computed: {
    ...mapState(aptStore, ["sidoList", "gugunList", "dongList"]),
    ...mapState(houseInfoStore, ["houseInfoList"]),
    ...mapState(memberStore, ["recentDataList"]),
  },
  mounted() {
    this.searchSidoList();
    this.selectRecentDataInfo(this.$store.state.memberStore.userInfo.id);
  },
  methods: {
    movePathView() {
      this.$router.push({ name: "pathView" }).catch(() => {});
    },
    movePlannerView() {
      this.$router.push({ name: "plannerView" }).catch(() => {});
    },
    inputChanged() {
      //↓ For clear v-menu slot
      this.$refs.autoinput.blur();
      setTimeout(() => {
        this.$refs.autoinput.focus();
      }, 500);
    },
    ...mapActions(aptStore, [
      "searchSidoList",
      "searchGugunList",
      "searchDongList",
      "setAddressInfo",
      "setSearchedApartName",
    ]),
    ...mapMutations(aptStore, [
      "CLEAR_SIDO_LIST",
      "CLEAR_GUGUN_LIST",
      "CLEAR_DONG_LIST",
    ]),
    ...mapActions(houseInfoStore, ["getHouseInfoList", "getHouseInfoListAuto"]),
    ...mapActions(memberStore, [
      "selectRecentDataInfo",
      "insertRecentDataInfo",
      "deleteRecentDataInfoAll",
      "deleteRecentDataInfo",
    ]),
    ...mapMutations(houseInfoStore, [
      "SEARCH_HOUSE_INFO_LIST",
      "SEARCH_HOUSE_INFO",
      "CLEAR_HOUSE_INFO_LIST",
      "CLEAR_HOUSE_INFO",
    ]),

    makeGugunList() {
      this.CLEAR_GUGUN_LIST();
      this.CLEAR_DONG_LIST();

      this.gugunName = "";
      this.dongName = "";

      if (this.sidoName) this.searchGugunList(this.sidoName);
    },
    makeDongList() {
      this.CLEAR_DONG_LIST();
      this.dongName = "";
      if (this.gugunName != "") this.searchDongList(this.gugunName);
      console.log("sidoName : ", this.sidoName);
      console.log("gugunName : ", this.gugunName);
    },
    makeHouseInfoListAuto(value) {
      // console.log("makeHouseInfoListAuto", value);
      // cancel pending call
      clearTimeout(this._timerId);

      this._timerId = setTimeout(() => {
        this.getHouseInfoListAuto(value);
      }, 500);
    },
    makeHouseInfoList() {
      this.CLEAR_HOUSE_INFO_LIST();
      console.log("sido Name : ", this.sidoName);
      console.log("gugun Name : ", this.gugunName);
      console.log("dong Name : ", this.dongName);
      console.log("apt Name : ", this.aptObject.apartmentName);
      console.log("userInfo.id: ", this.$store.state.memberStore.userInfo.id);

      if (
        this.$store.state.memberStore.userInfo.id.length >= 1 &&
        this.aptObject.apartmentName.length >= 1
      ) {
        console.log("최근 검색어 저장 로직 실행");
        let tempMember = {
          memberId: this.$store.state.memberStore.userInfo.id,
          data: this.aptObject.apartmentName,
        };

        this.insertRecentDataInfo(tempMember);
      }

      const aptInfo = {
        sidoName: this.sidoName,
        gugunName: this.gugunName,
        dongName: this.dongName,
        aptName: this.aptObject.apartmentName,
        page: this.page,
      };

      this.getHouseInfoList(aptInfo);

      const addressInfo = {
        sidoName: this.sidoName,
        gugunName: this.gugunName,
        dongName: this.dongName,
      };

      this.setAddressInfo(addressInfo);
      this.setSearchedApartName(this.aptObject.apartmentName);

      this.$router.push({ name: "aptListView" }).catch(() => {});
    },
    clickRecentSearch(recentStr) {
      this.aptObject.apartmentName = recentStr;
      this.makeHouseInfoList();
    },
    deleteAllRecentSearch() {
      if (this.$store.state.memberStore.userInfo.id.length >= 1) {
        this.deleteRecentDataInfoAll(this.$store.state.memberStore.userInfo.id);
      }
    },
    deleteRecentSearch(recentId) {
      // console.log("recentId", recentId);
      let payload = {
        memberId: this.$store.state.memberStore.userInfo.id,
        recentId: recentId,
      };

      this.deleteRecentDataInfo(payload);
    },
  },
};
</script>

<style>
.item-bg {
  width: 100%;
  height: 557px;
  background-image: url(../assets/backgroundImage.jpg);
  background-position: center;
}

.item-header-text {
  position: relative;
  top: 104px;
  font-size: 80px;
  font-weight: bold;
  text-align: center;
  text-shadow: 0px 2px 9px rgba(0, 0, 0, 0.8);
  color: white;
}

.item-header-subtext {
  position: relative;
  top: 108px;
  text-align: center;
  color: white;
  font-size: 25px;
  text-shadow: 0px 1px 4px rgba(0, 0, 0, 0.85);
}
.item-header-card {
  position: relative;
  top: 140px;
}

.item-middle-text {
  font-weight: bold;
  text-align: center;
  font-size: 27px;
}
.item-middle-subtext {
  font-weight: bold;
  text-align: center;
  font-size: 16px;
  color: #9f9999;
}

.item-middle-box-text {
  font-weight: bold;
  text-align: center;
  font-size: 17px;
}
.item-middle-box-subtext {
  text-align: center;
  font-size: 14px;
  color: #958e8e;
}
</style>
