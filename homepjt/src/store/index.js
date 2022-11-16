import Vue from "vue";
import Vuex from "vuex";
import http from "@/api/http";
// import createPersistedState from "vuex-persistedstate";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    member: {
      id: "ssafy",
      pw: "1234",
      name: "싸피",
      email: "'ssafy@gmail.com'",
      age: "27",
      phone: "010",
      gender: "m",
      joinDate: "2022-11-16 09:44:18",
    },
    boardList: [],
    board: null,
  },
  getters: {},
  mutations: {
    SEARCH_BOARD_LIST(state, payload) {
      state.boardList = payload;
    },
    UPDATE_BOARD_DETAIL(state, payload) {
      state.board = payload;
    },
    DELETE_BOARD(state) {
      state.board = null;
    },
  },
  actions: {
    updateBoardDetail({ commit }, payload) {
      commit("UPDATE_BOARD_DETAIL", payload);
    },
    searchBoardList({ commit }, payload) {
      http.get(`/board/${payload}`).then(({ data }) => {
        commit("SEARCH_BOARD_LIST", data.boardList);
      });
    },
    writeBoard(context, payload) {
      http
        .post(`/board/write`, {
          memberId: context.state.member.id,
          title: payload.title,
          content: payload.content,
        })
        .then(({ data }) => {
          if (data === "success") {
            console.log("게시글 등록 성공");
          }
        });
    },
    deleteBoard({ commit }, payload) {
      http.delete(`/board/delete/${payload}`).then(({ data }) => {
        if (data === "success") {
          console.log("게시글 삭제 성공");
          commit("DELETE_BOARD");
        }
      });
    },
  },
  modules: {},
  // plugins: [
  //   createPersistedState({
  //     // 브라우저 종료시 제거하기 위해 localStorage가 아닌 sessionStorage로 변경. (default: localStorage)
  //     storage: sessionStorage,
  //   }),
  // ],
});
