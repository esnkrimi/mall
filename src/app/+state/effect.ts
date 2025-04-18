import { Injectable } from '@angular/core';
import { Actions, ofType, createEffect } from '@ngrx/effects';
import { map, switchMap, tap } from 'rxjs/operators';
import { actions } from './action';
import { ApiService } from '../service/service';

@Injectable()
export class storeEffects {
  constructor(private actions$: Actions, private apiService: ApiService) {}
  addBasket: any = createEffect(() => {
    return this.actions$.pipe(
      ofType(actions.preparingAddRemoveBasket),
      switchMap((res: any) => {
        return this.apiService
          .addRemoveBasket(res.user, res.productID, res.size, res.count)
          .pipe(
            map((res2: any) =>
              actions.loadComment({ comments: res2, postId: res.postId })
            )
          );
      })
    );
  });

  loadBasket: any = createEffect(() => {
    return this.actions$.pipe(
      ofType(actions.preparingLoadBasket),
      switchMap((res: any) => {
        return this.apiService
          .loadBasket(res.user)
          .pipe(map((res2: any) => actions.loadBasket({ basket: res2 })));
      })
    );
  });

  loadComments: any = createEffect(() => {
    return this.actions$.pipe(
      ofType(actions.preparingLoadComment),
      switchMap((res: any) => {
        return this.apiService
          .loadCommentOfPost(res.postId)
          .pipe(
            map((res2: any) =>
              actions.loadComment({ comments: res2, postId: res.postId })
            )
          );
      })
    );
  });
  seenMessage: any = createEffect(() => {
    return this.actions$.pipe(
      ofType(actions.prepareToSeenMessage),
      switchMap((res: any) => {
        return this.apiService
          .seenMessage(res.sender, res.receiver)
          .pipe(map((res: any) => actions.seenMessage({ post: res })));
      })
    );
  });
  fetchFilters: any = createEffect(() => {
    return this.actions$.pipe(
      ofType(actions.prepareFetchAllFilterDistinctInExpTable),
      switchMap((res: any) => {
        return this.apiService
          .fetchFilters()
          .pipe(
            map((res: any) =>
              actions.fetchAllFilterDistinctInExpTable({ filters: res })
            )
          );
      })
    );
  });

  fetchAllCity: any = createEffect(() => {
    return this.actions$.pipe(
      ofType(actions.prepareFetchCity),
      switchMap((res: any) => {
        return this.apiService
          .fetchCityByProvince(res.provinceid)
          .pipe(map((res: any) => actions.fetchCity({ cities: res })));
      })
    );
  });
  fetchAllProvince: any = createEffect(() => {
    return this.actions$.pipe(
      ofType(actions.prepareFetchAllProvince),
      switchMap((res: any) => {
        return this.apiService
          .fetchAllProvince()
          .pipe(
            map((res: any) => actions.fetchAllProvince({ provinces: res }))
          );
      })
    );
  });
  fetchMessage: any = createEffect(() => {
    return this.actions$.pipe(
      ofType(actions.prepareFetchMessage),
      switchMap((res: any) => {
        return this.apiService
          .fetchMessage(res.email)
          .pipe(map((res: any) => actions.fetchMessage({ message: res })));
      })
    );
  });

  fetchAllMessage: any = createEffect(() => {
    return this.actions$.pipe(
      ofType(actions.prepareFetchAllMessage),
      switchMap((res: any) => {
        return this.apiService
          .fetchAllMessage(res.sender, res.receiver)
          .pipe(map((res: any) => actions.fetchAllMessage({ message: res })));
      })
    );
  });

  sendMessage: any = createEffect(() => {
    return this.actions$.pipe(
      ofType(actions.sendMessage),
      switchMap((res: any) => {
        return this.apiService
          .sendMessage(res.email, res.sender, res.message)
          .pipe(map((res: any) => actions.finishLogin()));
      })
    );
  });
  deletePost: any = createEffect(() => {
    return this.actions$.pipe(
      ofType(actions.prepareDeletePost),
      switchMap((res: any) => {
        return this.apiService
          .deletePost(res.id, res.email)
          .pipe(map((res2: any) => actions.deletePost({ datas: res })));
      })
    );
  });
  deleteComment: any = createEffect(() => {
    return this.actions$.pipe(
      ofType(actions.prepareDeleteComment),
      switchMap((res: any) => {
        return this.apiService
          .deleteComment(res.id)
          .pipe(
            map((res2: any) =>
              actions.deleteComment({ id: res.id, postId: res.postId })
            )
          );
      })
    );
  });
  fetchUserSavedPosts: any = createEffect(() => {
    return this.actions$.pipe(
      ofType(actions.prepareFetchUserSavedPost),
      switchMap((res: any) => {
        return this.apiService
          .fetchUserSavedPost(res.email)
          .pipe(map((res: any) => actions.fetchUserSavedPost({ posts: res })));
      })
    );
  });
  sendCodeToMobile: any = createEffect(() => {
    return this.actions$.pipe(
      ofType(actions.sendMobileCode),
      switchMap((res: any) => {
        return this.apiService
          .sendMobileCode(res.mobile)
          .pipe(map((res: any) => actions.nullAction()));
      })
    );
  });
  loginViaMobile: any = createEffect(() => {
    return this.actions$.pipe(
      ofType(actions.prepareToLoginViaMobile),
      switchMap((res: any) => {
        return this.apiService
          .loginViaMobile(res.mobile, res.code)
          .pipe(map((res: any) => actions.loginViaMobile({ user: res })));
      })
    );
  });
  makeCategoryInterrested: any = createEffect(() => {
    return this.actions$.pipe(
      ofType(actions.prepareToMakeCategoryInterrested),
      switchMap((res: any) => {
        return this.apiService
          .makeCategoryInterrested(res.user, res.catid, res.action)
          .pipe(
            map((res: any) => actions.makeCategoryInterrested({ user: res[0] }))
          );
      })
    );
  });
  fetchFollows: any = createEffect(() => {
    return this.actions$.pipe(
      ofType(actions.prepareToFetchFollowers),
      switchMap((res: any) => {
        return this.apiService
          .followerOfUsers(res.user)
          .pipe(map((res: any) => actions.fetchFollowers({ follows: res })));
      })
    );
  });

  fetchPostCategories: any = createEffect(() => {
    return this.actions$.pipe(
      ofType(actions.prepareToFetchPostCategory),
      switchMap((res: any) => {
        return this.apiService
          .fetchCategoriese()
          .pipe(
            map((res: any) => actions.fetchPostCategory({ category: res }))
          );
      })
    );
  });
  profileUpdate: any = createEffect(() => {
    return this.actions$.pipe(
      ofType(actions.prepareUpdateProfile),
      switchMap((res: any) => {
        return this.apiService
          .updateUserProfile(res.formObject)
          .pipe(
            map((res: any) =>
              actions.prepareToFetchUserProfile({ email: res[0].email })
            )
          );
      })
    );
  });

  fetchPostOfaUser: any = createEffect(() => {
    return this.actions$.pipe(
      ofType(actions.prepareToFetchPostsOfAUser),
      switchMap((res: any) => {
        return this.apiService
          .fetchPostOfAUser(res.email)
          .pipe(map((res: any) => actions.fetchPostsOfAUser({ post: res })));
      })
    );
  });

  fetchProfile: any = createEffect(() => {
    return this.actions$.pipe(
      ofType(actions.prepareToFetchUserProfile),
      switchMap((res: any) => {
        return this.apiService
          .FetchUserProfile(res.email)
          .pipe(map((res: any) => actions.fetchUserProfile({ user: res })));
      })
    );
  });

  fetchBoard: any = createEffect(() => {
    return this.actions$.pipe(
      ofType(actions.prepareToFetchUserBoard),
      switchMap((res: any) => {
        return this.apiService
          .FetchUserBoard(res.email)
          .pipe(map((res: any) => actions.fetchUserBoard({ user: res })));
      })
    );
  });

  zoomPost: any = createEffect(() => {
    return this.actions$.pipe(
      ofType(actions.prepareToZoomPost),
      switchMap((res: any) => {
        return this.apiService
          .zoomPost(res.id)
          .pipe(map((res: any) => actions.zoomPost(res)));
      })
    );
  });
  submitPost: any = createEffect(() => {
    return this.actions$.pipe(
      ofType(actions.prepareToSubmitPost),
      switchMap((res: any) => {
        return this.apiService
          .submitNewPost(res.formValues, res.formData)
          .pipe(map((result: any) => actions.submitPost()));
      })
    );
  });
  submitComment: any = createEffect(() => {
    return this.actions$.pipe(
      ofType(actions.prepareToSubmitComment),
      switchMap((res: any) => {
        return this.apiService
          .submitComment(res.loginedId, res.postId, res.comment)
          .pipe(
            map((result: any) =>
              actions.submitComment({ comment: result, postId: res.postId })
            )
          );
      })
    );
  });
  submitCommentOnZoom: any = createEffect(() => {
    return this.actions$.pipe(
      ofType(actions.prepareToSubmitCommentOnZoom),
      switchMap((res: any) => {
        return this.apiService
          .submitComment(res.loginedId, res.postId, res.comment)
          .pipe(
            map((result: any) =>
              actions.submitCommentOnZoom({
                comment: result,
                postId: res.postId,
              })
            )
          );
      })
    );
  });
  searchPostByWord: any = createEffect(() => {
    return this.actions$.pipe(
      ofType(actions.prepareToSearchPostByWord),
      switchMap((res: any) => {
        return this.apiService
          .searchPostByWord(res.word)
          .pipe(map((res: any) => actions.searchPostByWord({ post: res })));
      })
    );
  });

  fetchGroupCats: any = createEffect(() => {
    return this.actions$.pipe(
      ofType(actions.prepareToFetchGroupCats),
      switchMap((res: any) => {
        return this.apiService
          .fetchGroupCats()
          .pipe(map((res: any) => actions.fetchGroupCats({ groups: res })));
      })
    );
  });
  likePost: any = createEffect(() => {
    return this.actions$.pipe(
      ofType(actions.likePost),
      switchMap((res: any) => {
        return this.apiService
          .likePost(res.postId, res.userLoginedEmail)
          .pipe(map((res: any) => actions.finishLogin()));
      })
    );
  });
  savePost: any = createEffect(() => {
    return this.actions$.pipe(
      ofType(actions.savePost),
      switchMap((res: any) => {
        return this.apiService
          .savePost(res.postId, res.userLoginedEmail)
          .pipe(map((res: any) => actions.finishLogin()));
      })
    );
  });
  signinViaGoogle: any = createEffect(() => {
    return this.actions$.pipe(
      ofType(actions.login),
      switchMap((res: any) => {
        return this.apiService
          .login(res.user)
          .pipe(map((res: any) => actions.finishLogin()));
      })
    );
  });

  fetchPosts: any = createEffect(() => {
    return this.actions$.pipe(
      ofType(actions.prepareFetchPosts),
      switchMap((res: any) => {
        return this.apiService
          .fetchExperience(
            res.offset,
            res.groupId,
            res.typeOfPost,
            res.userEmail,
            res.sort,
            res.seed,
            res.filters
          )
          .pipe(
            map((res2: any) =>
              actions.fetchPosts({
                posts: res2,
                restartFetchData: res.restartFetchData,
              })
            )
          );
      })
    );
  });
}
