import { createFeature, createReducer, on } from '@ngrx/store';
import { AppState } from './state';
import { actions } from './action';

export const ExpState = createFeature({
  name: 'store',
  reducer: createReducer(
    AppState,
    on(actions.loadComment, function (state: any, action: any) {
      return {
        ...state,
        zoom: state.zoom.map((res: any) => {
          if (String(res.id) === String(action.postId)) {
            return {
              ...res,
              comments: action.comments,
            };
          } else {
            return {
              ...res,
            };
          }
        }),
      };
    }),
    on(actions.seenMessage, function (state: any, action: any) {
      return {
        ...state,
        zoom: [...state.zoom, action[0]],
      };
    }),
    on(
      actions.fetchAllFilterDistinctInExpTable,
      function (state: any, action: any) {
        return {
          ...state,
          filters: action.filters,
        };
      }
    ),
    on(actions.fetchAllProvince, function (state: any, action: any) {
      return {
        ...state,
        provinces: action.provinces,
      };
    }),
    on(actions.fetchCity, function (state: any, action: any) {
      return {
        ...state,
        citySelectedOfProvince: action.cities,
      };
    }),
    on(actions.fetchAllMessage, function (state: any, action: any) {
      return {
        ...state,
        allMessage: action.message,
      };
    }),
    on(actions.fetchMessage, function (state: any, action: any) {
      return {
        ...state,
        message: action.message,
      };
    }),
    on(actions.deletePost, function (state: any, action: any) {
      return {
        ...state,
        post: action.datas,
      };
    }),
    on(actions.deleteComment, function (state: any, action: any) {
      return {
        ...state,
        post: state.post.map((res: any) => {
          if (String(res.id) === String(action.postId)) {
            return {
              ...res,
              comments: res.comments.map((res2: any) => {
                if (String(res2.id) === String(action.id)) {
                  const tmpObjComment = {
                    id: 0,
                    comment: '',
                    expid: 0,
                  };
                  return {
                    ...res2,
                    ...tmpObjComment,
                  };
                } else {
                  return {
                    ...res2,
                  };
                }
              }),
            };
          } else {
            return {
              ...res,
            };
          }
        }),
      };
    }),
    on(actions.fetchUserSavedPost, function (state: any, action: any) {
      return {
        ...state,
        UserLoginedSavedPosts: action.posts,
      };
    }),
    on(actions.loginViaMobile, function (state: any, action: any) {
      return {
        ...state,
        user: action.user,
      };
    }),
    on(actions.fetchFollowers, function (state: any, action: any) {
      return {
        ...state,
        follows: action.follows,
      };
    }),
    on(actions.makeCategoryInterrested, function (state: any, action: any) {
      return {
        ...state,
        user: action.user,
      };
    }),
    on(actions.fetchPostCategory, function (state: any, action: any) {
      return {
        ...state,
        category: action.category,
      };
    }),
    on(actions.fetchUserProfile, function (state: any, action: any) {
      return {
        ...state,
        userProfile: [action.user[0]],
      };
    }),
    on(actions.fetchUserBoard, function (state: any, action: any) {
      return {
        ...state,
        userBoard: [action.user[0]],
      };
    }),
    on(actions.fetchPostsOfAUser, function (state: any, action: any) {
      return {
        ...state,
        postOfUser: [...action.post],
      };
    }),
    on(actions.zoomPost, function (state: any, action: any) {
      return {
        ...state,
        zoom: [...state.zoom, action[0]],
      };
    }),
    on(actions.submitComment, function (state: any, action: any) {
      return {
        ...state,
        post: state.post.map((res: any) => {
          if (String(res.id) === String(action.postId)) {
            return {
              ...res,
              comments: action.comment,
            };
          } else {
            return {
              ...res,
            };
          }
        }),
      };
    }),
    on(actions.likePost, function (state: any, action: any) {
      return {
        ...state,
        post: state.post.map((res: any) => {
          if (res?.id?.toString() === action.postId?.toString()) {
            let isExistsFlag = false;
            const tmp = res.likes.filter(
              (res: any) => res.useremail === action.userLoginedEmail
            );

            if (tmp.length === 0) {
              const obgTmp = {
                expid: action.postId,
                useremail: action.userLoginedEmail,
              };
              return {
                ...res,
                likes: [...res.likes, obgTmp],
              };
            } else if (tmp.length > 0)
              return {
                ...res,
                likes: res.likes.map((resLike: any) => {
                  const obgTmp = {
                    expid: action.postId,
                    useremail: action.userLoginedEmail,
                  };
                  if (
                    resLike.useremail === obgTmp.useremail &&
                    resLike.expid === obgTmp.expid
                  ) {
                    isExistsFlag = true;
                    return {
                      undefined,
                    };
                  } else return { ...resLike };
                }),
              };
          } else
            return {
              ...res,
            };
        }),
        zoom: state.zoom.map((res: any) => {
          if (res?.id?.toString() === action.postId?.toString()) {
            let isExistsFlag = false;
            const tmp = res.likes.filter(
              (res: any) => res.useremail === action.userLoginedEmail
            );

            if (tmp.length === 0) {
              const obgTmp = {
                expid: action.postId,
                useremail: action.userLoginedEmail,
              };
              return {
                ...res,
                likes: [...res.likes, obgTmp],
              };
            } else if (tmp.length > 0)
              return {
                ...res,
                likes: res.likes.map((resLike: any) => {
                  const obgTmp = {
                    expid: action.postId,
                    useremail: action.userLoginedEmail,
                  };
                  if (
                    resLike.useremail === obgTmp.useremail &&
                    resLike.expid === obgTmp.expid
                  ) {
                    isExistsFlag = true;
                    return {
                      undefined,
                    };
                  } else return { ...resLike };
                }),
              };
          } else
            return {
              ...res,
            };
        }),
      };
    }),

    on(actions.savePost, function (state: any, action: any) {
      return {
        ...state,
        post: state.post.map((res: any) => {
          if (res?.id?.toString() === action?.postId?.toString()) {
            let isExistsFlag = false;
            const tmp = res?.saves?.filter(
              (res: any) => res.useremail === action.userLoginedEmail
            );
            if (tmp?.length === 0) {
              const obgTmp = {
                expid: action.postId,
                useremail: action.userLoginedEmail,
                saved: 'yes',
                id: res?.id,
              };
              return {
                ...res,
                saves: [...res.saves, obgTmp],
              };
            } else if (tmp?.length > 0) {
              return {
                ...res,
                saves: res.saves.map((resSaves: any) => {
                  const obgTmp = {
                    expid: action.postId,
                    useremail: action.userLoginedEmail,
                  };
                  if (
                    resSaves.useremail === obgTmp.useremail &&
                    resSaves.expid === obgTmp.expid
                  ) {
                    isExistsFlag = true;
                    return {
                      undefined,
                    };
                  } else return { ...resSaves };
                }),
              };
            }
          } else
            return {
              ...res,
            };
        }),
        zoom: state.zoom.map((res: any) => {
          if (res?.id?.toString() === action.postId?.toString()) {
            let isExistsFlag = false;
            const tmp = res.saves.filter(
              (res: any) => res.useremail === action.userLoginedEmail
            );

            if (tmp.length === 0) {
              const obgTmp = {
                expid: action.postId,
                useremail: action.userLoginedEmail,
              };
              return {
                ...res,
                saves: [...res.saves, obgTmp],
              };
            } else if (tmp.length > 0)
              return {
                ...res,
                saves: res.saves.map((resLike: any) => {
                  const obgTmp = {
                    expid: action.postId,
                    useremail: action.userLoginedEmail,
                  };
                  if (
                    resLike.useremail === obgTmp.useremail &&
                    resLike.expid === obgTmp.expid
                  ) {
                    isExistsFlag = true;
                    return {
                      undefined,
                    };
                  } else return { ...resLike };
                }),
              };
          } else
            return {
              ...res,
            };
        }),
      };
    }),

    on(actions.submitCommentOnZoom, function (state: any, action: any) {
      return {
        ...state,
        zoom: state.zoom.map((res: any) => {
          if (String(res.id) === String(action.postId)) {
            return {
              ...res,
              comments: action.comment,
            };
          } else {
            return {
              ...res,
            };
          }
        }),
        post: state.post.map((res: any) => {
          if (String(res.id) === String(action.postId)) {
            return {
              ...res,
              comments: action.comment,
            };
          } else {
            return {
              ...res,
            };
          }
        }),
      };
    }),
    on(actions.searchPostByWord, function (state: any, action: any) {
      return {
        ...state,
        searchPool: action.post,
      };
    }),
    on(actions.clearPostArray, function (state: any, action: any) {
      return {
        ...state,
        post: [],
      };
    }),
    on(actions.fetchGroupCats, function (state: any, action: any) {
      return {
        ...state,
        groupCats: action.groups,
      };
    }),
    on(actions.login, function (state: any, action: any) {
      return {
        ...state,
        user: action.user,
      };
    }),
    on(actions.fetchPosts, function (state: any, action: any) {
      if (!action.restartFetchData)
        return {
          ...state,
          post: action.posts ? [...state.post, ...action.posts] : state.post,
        };
      else
        return {
          ...state,
          post: action.posts,
        };
    })
  ),
});
