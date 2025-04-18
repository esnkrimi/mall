export const AppState: IState = {
  user: {
    email: '',
    firstName: '',
    lastName: '',
    telegram: "",
    instagram: "",
    email2: "",
    whatsapp: ""
  },
  post: [],
  groupCats: [],
  searchPool: [],
  zoom: [],
  userProfile: [],
  postOfUser: [],
  category: [],
  follows: [],
  UserLoginedSavedPosts: [],
  message: [],
  allMessage: [],
  provinces: [],
  citySelectedOfProvince: [],
  filters: [],
  userBoard: [],
  basket: []
};
export interface IProvince {
  province_id: string;
  province: string;
}
export interface ICitySelectedOfProvince {
  id: string;
  province_id: string;
  city: string;
}
export interface IUserLoginedSavedPosts {
  id: string;
  title: string;
  content: string;
  typeofpost: string;
  date: string;
}
export interface IState {
  userProfile: IUser[];
  userBoard: IUserBoard[];
  postOfUser: IPost[];
  user: IUser;
  filters: IFilterDistinctInExpTable[];
  post: IPost[];
  groupCats: IGroupCats[];
  searchPool: IPost[];
  provinces: IProvince[];
  citySelectedOfProvince: ICitySelectedOfProvince[];
  zoom: IPost[];
  category: IPostCategory[];
  follows: IFOllows[];
  message: IMessages[];
  allMessage: IAllMessages[];
  UserLoginedSavedPosts: IUserLoginedSavedPosts[];
  basket:IBasket[]
}
export interface IGroupCats {
  title: string;
  id: string;
  count: string;
  active: string;
}
export interface IFOllows {
  id: number;
  follower: any;
  following: any;
}

export interface IUserBoard {
  id?: string;
  email: string;
  firstName: string;
  lastName: string;
  name?: string;
  job?: string;
  interrests?: IPostCategory[];
  posts: any;
}
export interface IBasket {
  size:number
  count:number
  produceID:string
  produceBrand:string
  produceName:string
}
export interface IUser {
  id?: string;
  email: string;
  firstName: string;
  lastName: string;
  pass?: string;
  idToken?: string;
  name?: string;
  photoUrl?: string;
  provider?: string;
  telegram?: string;
  instagram?: string;
  email2?: string;
  whatsapp?: string;
  job?: string;
  interrests?: IPostCategory[];
}
export interface loginHandle {
  email: string;
  pass: string;
}
export interface IPost {
  id: number;
  title: string;
  typeofpost: string;
  content: string;
  date: string;
  user: IUser;
  likes: ILikes[];
  saves: ISaved[];
  comments: IComments[];
  category: IPostCategory[];
  scorezoom?:string;
  viewCount?:number;
  score?:number;
}
export interface ISaved {
  id: number;
  useremail: string;
  expid: number;
  saved: string;
}
export interface IMessages {
  id: number;
  email: string;
  sender: number;
  message: string;
  icon: string;
  numunseen: number;
}
export interface IAllMessages {
  id: number;
  email: string;
  sender: number;
  message: string;
  date: string;
}
export interface ILikes {
  id: number;
  userEmailDestination: string;
  expid: number;
  liked: string;
}
export interface IComments {
  id: number;
  comment: string;
  expid: number;
  userEmail?: string;
  userEmailDestination?: string;
  user?: any;
  likeCounter?: any;
}
export interface IPostCategory {
  id?: string;
  name: string;
}

export interface IFilterDistinctInExpTable {
  name: string;
  values?: any;
}
