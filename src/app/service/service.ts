import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { IUser, loginHandle } from '../+state/state';
import { HttpClient } from '@angular/common/http';
import { LocalStorageService } from './localstorage.service';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  baseUrl = 'https://burjcrown.com/drm/mall/index.php?';
  constructor(private http: HttpClient) {}
  login(data: loginHandle): Observable<any> {
    const jsonEncoded = encodeURIComponent(JSON.stringify(data));
    return this.http.get(
      this.baseUrl +
        'id=0&ts=' +
        new Date().getSeconds() +
        '=&jsonUser=' +
        jsonEncoded
    );
  }
  fetchPostOfAUser(id: any) {
    return this.http.get(
      this.baseUrl + 'id=9&uid=' + id + '&ts=' + new Date().getSeconds()
    );
  }
  FetchUserProfile(id: any) {
    return this.http.get(
      this.baseUrl + 'id=8&uid=' + id + '&ts=' + new Date().getSeconds()
    );
  }
  FetchUserBoard(email: any) {
    return this.http.get(
      this.baseUrl + 'id=28&email=' + email + '&ts=' + new Date().getSeconds()
    );
  }
  fetchCategoriese() {
    return this.http.get(this.baseUrl + 'id=12&ts=' + new Date().getSeconds());
  }
  makeCategoryInterrested(email: string, catid: string, action: string) {
    return this.http.get(
      this.baseUrl +
        'id=13&email=' +
        email +
        '&action=' +
        action +
        '&catid=' +
        catid +
        '&ts=' +
        new Date().getSeconds()
    );
  }
  sendMobileCode(mobile: string) {
    return this.http.get(
      this.baseUrl + 'id=17&mobile=' + mobile + '&ts=' + new Date().getSeconds()
    );
  }
  loginViaMobile(mobile: string, code: string) {
    return this.http.get(
      this.baseUrl +
        'id=16&mobile=' +
        mobile +
        '&code=' +
        code +
        '&ts=' +
        new Date().getSeconds()
    );
  }
  updateUserProfile(formObject: IUser) {
    return this.http.get(
      this.baseUrl +
        'id=10&email=' +
        formObject.email +
        '&job=' +
        formObject.job +
        '&firstName=' +
        formObject.firstName +
        '&lastName=' +
        formObject.lastName +
        '&telegram=' +
        formObject.telegram +
        '&instagram=' +
        formObject.instagram +
        '&email2=' +
        formObject.email2 +
        '&whatsapp=' +
        formObject.whatsapp +
        '&ts=' +
        new Date().getSeconds()
    );
  }
  likePost(postId: number, userEmail: string) {
    return this.http.get(
      this.baseUrl +
        'id=2&userEmail=' +
        userEmail +
        '&postId=' +
        postId +
        '&ts=' +
        new Date().getSeconds()
    );
  }
  fetchUserSavedPost(userEmail: string) {
    return this.http.get(
      this.baseUrl +
        'id=19&email=' +
        userEmail +
        '&ts=' +
        new Date().getSeconds()
    );
  }
  deleteComment(id: string) {
    return this.http.get(
      this.baseUrl + 'id=20&eid=' + id + '&ts=' + new Date().getSeconds()
    );
  }
  deletePost(id: string, email: string) {
    return this.http.get(
      this.baseUrl +
        'id=21&eid=' +
        id +
        '&email=' +
        email +
        '&ts=' +
        new Date().getSeconds()
    );
  }
  fetchMessage(email: string) {
    return this.http.get(
      this.baseUrl + 'id=23&email=' + email + '&ts=' + new Date().getSeconds()
    );
  }
  fetchAllMessage(sender: string, receiver: string) {
    return this.http.get(
      this.baseUrl +
        'id=24&sender=' +
        sender +
        '&receiver=' +
        receiver +
        '&ts=' +
        new Date().getSeconds()
    );
  }
  sendMessage(email: string, sender: string, message: string) {
    return this.http.get(
      this.baseUrl +
        'id=22&email=' +
        email +
        '&sender=' +
        sender +
        '&message=' +
        message +
        '&ts=' +
        new Date().getSeconds()
    );
  }
  savePost(postId: number, userEmail: string) {
    return this.http.get(
      this.baseUrl +
        'id=18&userEmail=' +
        userEmail +
        '&postId=' +
        postId +
        '&ts=' +
        new Date().getSeconds()
    );
  }
  submitComment(userLoginedId: any, postId: any, comment: any) {
    return this.http.get(
      this.baseUrl +
        'id=5&userLoginedId=' +
        userLoginedId +
        '&postId=' +
        postId +
        '&comment=' +
        comment
    );
  }
  zoomPost(postId: any) {
    const timestap = new Date().getSeconds();
    return this.http.get(
      this.baseUrl + 'id=7&postid=' + postId + '&ts=' + timestap
    );
  }
  submitNewPost(formValues: any, formData: any) {
    console.log(
      `https://burjcrown.com/drm/mall/index.php?id=6&userid=${formValues.userEmail}&category=${formValues.category}&groupid=${formValues.group}&title=${formValues.title}&content=${formValues.content}&color=${formValues.color}&brand=${formValues.brand}&&sizes=${formValues.sizes}&&price=${formValues.price}&&material=${formValues.material}&sx=${formValues.sx}&scent=${formValues.scent}&country=${formValues.country}&discount=${formValues.discount}`,

    )
    return this.http.post(
      `https://burjcrown.com/drm/mall/index.php?id=6&userid=${formValues.userEmail}&category=${formValues.category}&groupid=${formValues.group}&title=${formValues.title}&content=${formValues.content}&color=${formValues.color}&brand=${formValues.brand}&&sizes=${formValues.sizes}&&price=${formValues.price}&&material=${formValues.material}&sx=${formValues.sx}&scent=${formValues.scent}&country=${formValues.country}&discount=${formValues.discount}`,
      formData
    );
  }
  fetchAllProvince() {
    return this.http.get(this.baseUrl + 'id=25');
  }
  fetchCityByProvince(provinceId: string) {
    return this.http.get(this.baseUrl + 'id=26&provinceid=' + provinceId);
  }
  seenMessage(sender: string, receiver: string) {
    return this.http.get(
      this.baseUrl + 'id=29&sender=' + sender + '&receiver=' + receiver
    );
  }
  loadCommentOfPost(postId: string) {
    const timestap = new Date().getSeconds();
    return this.http.get(
      this.baseUrl + 'id=30&postId=' + postId + '&ts=' + timestap
    );
  }
  fetchFilters() {
    return this.http.get(this.baseUrl + 'id=27');
  }
  searchPostByWord(word: string) {
    const timestap = new Date().getSeconds();
    return this.http.get(
      this.baseUrl + 'id=4&word=' + word + '&ts=' + timestap
    );
  }
  followerOfUsers(user: string) {
    const timestap = new Date().getSeconds();
    return this.http.get(
      this.baseUrl + 'id=15&user=' + user + '&ts=' + timestap
    );
  }
  fetchExperience(
    offet: string,
    groupId: string,
    typeOfPost: string,
    userEmail: string,
    sort: string,
    seed: string,
    filter: string
  ): Observable<any> {
       console.log(
      this.baseUrl +
        'id=1&offset=' +
        offet +
        '&ts=' +
        new Date().getSeconds() +
        '&groupId=' +
        groupId +
        '&typeOfPost=' +
        typeOfPost +
        '&userEmail=' +
        userEmail +
        '&sort=' +
        sort +
        '&seed=' +
        seed +
        '&filter=' +
        JSON.stringify(filter)
    );
    return this.http.get(
      this.baseUrl +
        'id=1&offset=' +
        offet +
        '&ts=' +
        new Date().getSeconds() +
        '&groupId=' +
        groupId +
        '&typeOfPost=' +
        typeOfPost +
        '&userEmail=' +
        userEmail +
        '&sort=' +
        sort +
        '&seed=' +
        seed +
        '&filter=' +
        JSON.stringify(filter)
    );
  }
  fetchGroupCats(): Observable<any> {
    return this.http.get(this.baseUrl + 'id=3&ts=' + new Date().getSeconds());
  }
}
