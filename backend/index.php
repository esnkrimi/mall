
text/x-generic index.php ( PHP script, ASCII text )
<?php
ini_set('display_errors', '0'); 
//header('Content-Type: image/jpeg');
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: PUT, GET, POST");
header("Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept");

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
//header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token');
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");


include("connection.php");
include("functions_JSON.php");
$con=new connection;
$link=$con->CONNECT_DB();
if (mysqli_connect_errno())
{
  echo "Failed to connect to db: ";
}

$id=$_GET['id'];
$uid=$_GET['uid'];

//echo '{';
if($id==0)  REGISTER($con);
else if($id==1)  fetch_experiences($con);
else if($id==2)  likePost($con);
else if($id==3)  fetchMenuCat($con);
else if($id==4)  searchPostByWord($con);
else if($id==5)  submitComment($con);
else if($id==6)  submitPost($con);
else if($id==7)  fetch_one_experiences($con);
else if($id==8)  FetchUserProfile($con);
else if($id==9)  fetchPostOfAUser($con);
else if($id==10)  updateUserProfile($con);
else if($id==11)  updateProfilePicture($con);
else if($id==12)  fetchCategoriese($con);
else if($id==13)  toggleLikeCategoriese($con);
else if($id==14)  toggleFollowing($con);
else if($id==15)  followerOfUsers($con);
else if($id==16)  loginViaMobile($con);
else if($id==17)  sendCodeMobile($con);
else if($id==18)  savePost($con);
else if($id==19)  fetchSavedPosts($con);
else if($id==20)  deleteComment($con);
else if($id==21)  deletePost($con);
//else if($id==22)  updateUserCommentlike($con);
else if($id==22)  sendMessage($con);
else if($id==23)  fetchMessages($con);
else if($id==24)  fetchAllMessages($con);
else if($id==25)  fetchAllProvince($con);
else if($id==26)  fetchCityByProvince($con);
else if($id==27)  fetchFilters($con);
else if($id==28)  fetchUserBoard($con);
else if($id==29)  seenMessage($con);
else if($id==30)  loadCommentOfPost($con);
else if($id==31)  loadBasket($con);
else if($id==32)  addremoveBasket($con);
//echo '}';
$link->close();