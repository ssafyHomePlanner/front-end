import jwtDecode from "jwt-decode";
import router from "@/router";
import {
  login,
  findById,
  tokenRegeneration,
  logout,
  deleteMember,
  selectMemberDetail,
  findMemberId,
  findMemberPw,
  checkMemberId,
  joinMember,
  updateMember,
  selectRecentData,
  insertRecentData,
  deleteRecentDataAll,
  deleteRecentData,
} from "@/api/member.js";

const memberStore = {
  namespaced: true,
  state: {
    isLogin: false,
    isLoginError: false,
    userInfo: {
      id: "",
      name: "",
      email: "",
      age: "",
      phone: "",
      gender: "",
    },
    isValidToken: false,

    memberId: null,
    memberPw: null,

    isDuplicatedId: false,

    recentDataList: [],
    recentData: {},
  },
  getters: {
    checkUserInfo: function (state) {
      return state.userInfo;
    },
    checkToken: function (state) {
      return state.isValidToken;
    },
  },
  mutations: {
    SET_IS_LOGIN: (state, isLogin) => {
      state.isLogin = isLogin;
    },
    SET_IS_LOGIN_ERROR: (state, isLoginError) => {
      state.isLoginError = isLoginError;
    },
    SET_IS_VALID_TOKEN: (state, isValidToken) => {
      state.isValidToken = isValidToken;
    },
    SET_USER_INFO: (state, userInfo) => {
      state.isLogin = true;
      state.userInfo = userInfo;
    },
    SET_MEMBER_ID: (state, memberId) => {
      state.memberId = memberId;
    },
    SET_MEMBER_PW: (state, memberPw) => {
      state.memberPw = memberPw;
    },
    IS_DUPLICATED_ID: (state, flag) => {
      state.isDuplicatedId = flag;
    },
    SET_RECENT_DATA_LIST: (state, data) => {
      state.recentDataList = data;
    },
    DELETE_RECENT_DATA: (state, data) => {
      state.recentDataList.forEach((item, index) => {
        if (item.id === data) {
          state.recentDataList.splice(index, 1);
        }
      });
    },
  },
  actions: {
    async userConfirm({ commit }, user) {
      await login(
        user,
        ({ data }) => {
          if (data.message === "success") {
            let accessToken = data["access-token"];
            let refreshToken = data["refresh-token"];
            // console.log("login success token created!!!! >> ", accessToken, refreshToken);
            commit("SET_IS_LOGIN", true);
            commit("SET_IS_LOGIN_ERROR", false);
            commit("SET_IS_VALID_TOKEN", true);
            sessionStorage.setItem("access-token", accessToken);
            sessionStorage.setItem("refresh-token", refreshToken);

            // console.log(data);
            alert("????????? ??????!!");
          }
        },
        (error) => {
          alert("????????? ??????!!, ????????? ?????? ??????????????? ???????????????!!");
          commit("SET_IS_LOGIN", false);
          commit("SET_IS_LOGIN_ERROR", true);
          commit("SET_IS_VALID_TOKEN", false);
          router.push({ name: "logInView" });
          console.log(error);
        }
      );
    },
    async getUserInfo({ commit, dispatch }, token) {
      let decodeToken = jwtDecode(token);
      // console.log("2. getUserInfo() decodeToken :: ", decodeToken);
      await findById(
        decodeToken.memberId,
        ({ data }) => {
          if (data.message === "success") {
            commit("SET_USER_INFO", data.memberInfo);
            // console.log("3. getUserInfo data >> ", data);
          } else {
            // console.log("?????? ?????? ??????!!!!");
          }
        },
        async (error) => {
          console.log(
            "getUserInfo() error code [?????? ???????????? ?????? ?????????.] ::: ",
            error.response.status
          );
          commit("SET_IS_VALID_TOKEN", false);
          await dispatch("tokenRegeneration");
        }
      );
    },
    async tokenRegeneration({ commit, state }) {
      // console.log(
      //   "?????? ????????? >> ?????? ?????? ?????? : {}",
      //   sessionStorage.getItem("access-token")
      // );
      await tokenRegeneration(
        JSON.stringify(state.userInfo),
        ({ data }) => {
          if (data.message === "success") {
            let accessToken = data["access-token"];
            // console.log("????????? ?????? >> ????????? ?????? : {}", accessToken);
            sessionStorage.setItem("access-token", accessToken);
            commit("SET_IS_VALID_TOKEN", true);
          }
        },
        async (error) => {
          // HttpStatus.UNAUTHORIZE(401) : RefreshToken ?????? ?????? >> ?????? ?????????!!!!
          if (error.response.status === 401) {
            // console.log("?????? ??????");
            // ?????? ????????? ??? DB??? ????????? RefreshToken ??????.
            await logout(
              state.userInfo.userid,
              ({ data }) => {
                if (data.message === "success") {
                  console.log("???????????? ?????? ?????? ??????");
                } else {
                  console.log("???????????? ?????? ?????? ??????");
                }
                alert(
                  "refresh token ????????? ?????????????????????! ?????? ???????????? ?????????."
                );
                commit("SET_IS_LOGIN", false);
                commit("SET_USER_INFO", {
                  id: "",
                  name: "",
                  email: "",
                  age: "",
                  phone: "",
                  gender: "",
                });
                commit("SET_IS_VALID_TOKEN", false);
                router.push({ name: "logInView" });
              },
              (error) => {
                console.log(error);
                commit("SET_IS_LOGIN", false);
                commit("SET_USER_INFO", {
                  id: "",
                  name: "",
                  email: "",
                  age: "",
                  phone: "",
                  gender: "",
                });
              }
            );
          }
        }
      );
    },
    async userLogout({ commit }, userid) {
      await logout(
        userid,
        ({ data }) => {
          if (data.message === "success") {
            commit("SET_IS_LOGIN", false);
            commit("SET_USER_INFO", {
              id: "",
              name: "",
              email: "",
              age: "",
              phone: "",
              gender: "",
            });
            commit("SET_IS_VALID_TOKEN", false);
          } else {
            console.log("?????? ?????? ??????!!!!");
          }
        },
        (error) => {
          console.log(error);
        }
      );
    },

    // ?????? ??????
    deleteMemberInfo({ commit }, memberId) {
      deleteMember(
        memberId,
        ({ data }) => {
          if (data.message === "success") {
            commit("SET_IS_LOGIN", false);
            commit("SET_USER_INFO", {
              id: "",
              name: "",
              email: "",
              age: "",
              phone: "",
              gender: "",
            });
            commit("SET_IS_VALID_TOKEN", false);
          } else {
            // console.log("?????? ?????? ?????? !!");
          }
        },
        (error) => {
          console.log(error);
        }
      );
    },

    // ?????? ?????? ?????? ??????
    selectMemberInfoDetail({ commit }, memberId) {
      selectMemberDetail(
        memberId,
        ({ data }) => {
          if (data.message === "success") {
            commit("SET_USER_INFO", data.memberDto);
          } else {
            // console.log("?????? ?????? ?????? !!!");
          }
        },
        (error) => {
          console.log(error);
        }
      );
    },

    // ?????? ????????? ??????
    findMemberInfoId(context, payload) {
      findMemberId(
        payload.memberName,
        payload.memberPhone,
        ({ data }) => {
          if (data.message === "success") {
            // commit("SET_MEMBER_ID", payload.memberId);
            // console.log(data);
            alert("???????????? ???????????? : " + data.memberId + " ?????????.");
            router.push({ name: "logInView" });
          } else {
            alert("?????? ????????? ????????????.");
            // console.log("?????? ?????? ?????? !!!");
          }
        },
        (error) => {
          alert("?????? ????????? ????????????.");
          console.log(error);
        }
      );
    },

    // ?????? ???????????? ??????
    findMemberInfoPw(context, payload) {
      findMemberPw(
        payload.memberId,
        payload.memberPhone,
        ({ data }) => {
          if (data.message === "success") {
            alert("???????????? ??????????????? : " + data.memberPw + "?????????");
            router.push({ name: "logInView" });
          } else {
            alert("?????? ????????? ????????????.");
            // console.log("?????? ?????? ?????? !!!");
          }
        },
        (error) => {
          alert("?????? ????????? ????????????.");
          console.log(error);
        }
      );
    },

    // ????????? ?????? ??????
    async checkMemberInfoId({ commit }, memberId) {
      console.log("check id : ", memberId);
      await checkMemberId(
        memberId,
        ({ data }) => {
          if (data.message === "success") {
            // console.log("????????? ?????? ?????? X!!");
            commit("IS_DUPLICATED_ID", false);
          } else {
            // console.log("????????? ?????? ??????");
            commit("IS_DUPLICATED_ID", true);
          }
        },
        (error) => {
          console.log(error);
        }
      );
    },

    // ????????????
    joinMemberInfo({ commit }, payload) {
      const memberInfo = {
        age: payload.age,
        email: payload.email,
        gender: payload.gender,
        id: payload.id,
        name: payload.name,
        phone: payload.phone,
        pw: payload.pw,
        salt: payload.salt,
      };

      console.log(commit);

      joinMember(
        memberInfo,
        ({ data }) => {
          if (data.message === "success") {
            console.log("???????????? ??????");
            alert("???????????? ??????!!");
            router.push({ name: "logInView" });
          } else {
            alert("???????????? ??????!!");
            console.log("???????????? ??????");
          }
        },
        (error) => {
          alert("???????????? ??????!!");
          console.log(error);
        }
      );
    },

    // ?????? ?????? ??????
    updateMemberInfo({ commit }, payload) {
      console.log(commit);
      const memberInfo = {
        age: payload.age,
        email: payload.email,
        gender: payload.gender,
        id: payload.id,
        joinDate: "",
        name: payload.name,
        phone: payload.phone,
        pw: payload.pw,
        salt: payload.salt,
      };
      updateMember(
        memberInfo,
        async ({ data }) => {
          if (data.message === "success") {
            alert("???????????? ?????? ?????? !! ?????? ????????? ????????????!!");
            // router.push({ name: "home" });
            await logout(
              memberInfo.id,
              ({ data }) => {
                if (data.message === "success") {
                  console.log("???????????? ?????? ?????? ??????");
                } else {
                  console.log("???????????? ?????? ?????? ??????");
                }
                commit("SET_IS_LOGIN", false);
                commit("SET_USER_INFO", {
                  id: "",
                  name: "",
                  email: "",
                  age: "",
                  phone: "",
                  gender: "",
                });
                commit("SET_IS_VALID_TOKEN", false);
                router.push({ name: "logInView" });
              },
              (error) => {
                console.log(error);
                commit("SET_IS_LOGIN", false);
                commit("SET_USER_INFO", {
                  id: "",
                  name: "",
                  email: "",
                  age: "",
                  phone: "",
                  gender: "",
                });
              }
            );
          } else {
            alert("???????????? ?????? ??????");
          }
        },
        (error) => {
          console.log(error);
        }
      );
    },

    // ?????? ?????? ?????? ??????
    selectRecentDataInfo({ commit }, memberId) {
      selectRecentData(
        memberId,
        ({ data }) => {
          if (data.message === "success") {
            commit("SET_RECENT_DATA_LIST", []);
            commit("SET_RECENT_DATA_LIST", data.resultDataList);
          } else {
            console.log("?????? ????????? ????????????.");
          }
        },
        (error) => {
          console.log(error);
        }
      );
    },

    // ?????? ?????? ?????? ??????
    insertRecentDataInfo(context, payload) {
      console.log("insertRecentDataInfo", payload);
      insertRecentData(
        payload.memberId,
        payload.data,
        ({ data }) => {
          if (data.message === "success") {
            console.log("?????? ?????? ?????? ??????");
          } else {
            console.log("?????? ?????? ?????? ??????");
          }
        },
        (error) => {
          console.log(error);
        }
      );
    },

    // ?????? ?????? ?????? ?????? ??????
    deleteRecentDataInfoAll({ commit }, memberId) {
      deleteRecentDataAll(memberId, ({ data }) => {
        if (data.message === "success") {
          commit("SET_RECENT_DATA_LIST", []);
          console.log("?????? ?????? ?????? ?????? ??????");
        } else {
          console.log("?????? ?????? ?????? ?????? ??????");
        }
      });
    },

    // ?????? ?????? ?????? ??????
    deleteRecentDataInfo({ commit }, payload) {
      deleteRecentData(
        payload.memberId,
        payload.recentId,
        ({ data }) => {
          if (data.message === "success") {
            commit("DELETE_RECENT_DATA", payload.recentId);
            console.log("?????? ?????? ?????? ??????");
          } else {
            console.log("?????? ?????? ?????? ??????");
          }
        },
        (error) => {
          console.log(error);
        }
      );
    },
  },
};

export default memberStore;
