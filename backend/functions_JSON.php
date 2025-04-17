<?php
header("Cache-Control: no-store, no-cache, must-revalidate, max-age=0");
header("Cache-Control: post-check=0, pre-check=0", false);
header("Pragma: no-cache");

function loadCommentOfPost($con)
{
    $postId = $_GET['postId'];
    $resultArray = array();
    $tempArray = array();
    $sql = "SELECT * FROM comment where expid=$postId order by id desc";
    if ($result = $con->QUERY_RUN($con, $sql)) {
        while ($row = $result->fetch_object()) {
            $row->email = fetchUserByUserid($con, $row->userid)->email;
            $tempArray = $row;
            array_push($resultArray, $row);
        }
    }
    $t = json_encode($resultArray);
    if (strlen($t) != 2)
        echo $t;
}
function seenMessage($con, $filter)
{
    $sender = $_GET['sender'];
    $receiver = $_GET['receiver'];
    $tempArray = array();
    $sql = "update messages set seen='yes' where email='$sender' and sender='$receiver'";
    if ($result = $con->QUERY_RUN($con, $sql)) {
        $tempArray = fetchAllMessagesByParameter($con, $sender, $receiver);
    }
    $t = json_encode($tempArray);
    if (strlen($t) != 2)
        echo $t;
}

function fetchAllMessagesByParameter($con, $sender, $receiver)
{
    $resultArray = array();
    $sql = "SELECT * from messages where (sender='$sender' and email='$receiver' ) or (sender='$receiver' and email='$sender' ) order by id desc";//echo $sql;
    if ($result = $con->QUERY_RUN($con, $sql)) {
        while ($row = $result->fetch_object()) {
            array_push($resultArray, $row);
        }
    }
    return $resultArray;
}

function fetchFilters($con)
{
    $filters = ['color', 'brand', 'sizes', 'material', 'sx', 'scent', 'country', 'discount'];
    $resultArray = array();
    for ($i = 0; $i < 12; $i++) {
        $row = null;
        $row->name = $filters[$i];
        $row->values = fetchFilter($con, $filters[$i]);
        array_push($resultArray, $row);
        // var_dump($resultArray);
    }
    $t = json_encode($resultArray);
    if (strlen($t) != 2)
        ;
    echo $t;

}
function fetchFilter($con, $filter)
{
    $tempArray = array();
    $sql = "SELECT distinct $filter FROM exp"; //echo $sql;
    if ($result = $con->QUERY_RUN($con, $sql)) {
        while ($row = $result->fetch_object()) {
            $r1 = explode(",", $row->$filter);
            for ($i = 0; $i < count($r1); $i++) {
                if (!in_array($r1[$i], $tempArray))
                    array_push($tempArray, $r1[$i]);
            }
        }
    }
    return $tempArray;

}
function fetchAllProvince($con)
{
    $resultArray = array();
    $tempArray = array();
    $sql = "SELECT * FROM province order by province_id"; // echo $sql;
    if ($result = $con->QUERY_RUN($con, $sql)) {
        while ($row = $result->fetch_object()) {
            $tempArray = $row;
            array_push($resultArray, $row);
        }
    }
    $t = json_encode($resultArray);
    if (strlen($t) != 2)
        echo $t;

}
function fetchCityByProvince($con)
{
    $provinceid = $_GET['provinceid'];
    $resultArray = array();
    $tempArray = array();
    $sql = "SELECT * FROM city where province_id=$provinceid"; // echo $sql;
    if ($result = $con->QUERY_RUN($con, $sql)) {
        while ($row = $result->fetch_object()) {
            $tempArray = $row;
            array_push($resultArray, $row);
        }
    }
    $t = json_encode($resultArray);
    if (strlen($t) != 2)
        echo $t;
}

function fetchAllMessages($con)
{
    $receiver = $_GET['receiver'];
    $sender = $_GET['sender'];
    $resultArray = array();
    $tempArray = array();
    $sql = "SELECT * from messages where (sender='$sender' and email='$receiver' ) or (sender='$receiver' and email='$sender' ) order by id desc";//echo $sql;
    if ($result = $con->QUERY_RUN($con, $sql)) {
        while ($row = $result->fetch_object()) {
            array_push($resultArray, $row);
        }
    }
    $t = json_encode($resultArray);
    if (strlen($t) != 2)
        echo $t;
}
function numNewMessageUnseen($con, $sender, $receiver)
{
    $resultArray = array();
    $tempArray = array();
    $sql = "SELECT count(*) as c from messages where email='$receiver' and sender='$sender' and seen ='no'";//echo $sql;
    if ($result = $con->QUERY_RUN($con, $sql)) {
        $row = $result->fetch_object();
        return $row->c;
    }
}

function fetchMessages($con)
{
    $userEmail = $_GET['email'];
    $resultArray = array();
    $tempArray = array();
    $sql = "SELECT distinct sender,email,date from messages where sender='$userEmail' or email='$userEmail'";//echo $sql;
    if ($result = $con->QUERY_RUN($con, $sql)) {
        while ($row = $result->fetch_object()) {
            if (!repeatedMessage($resultArray, $row->sender, $row->email, $userEmail)) {
                $row->content = getLastMessage($con, $row->sender, $row->email)->message;
                if (strcmp($row->sender, $userEmail) != 0)
                    $row->numunseen = (int) numNewMessageUnseen($con, $row->sender, $userEmail);
                else
                    $row->numunseen = 0;
                if (strcmp($userEmail, $row->email) == 0)
                    $row->icon = $row->sender;
                else
                    $row->icon = $row->email;
                array_push($resultArray, $row);
            }
        }
    }

    $t = json_encode($resultArray);
    if (strlen($t) != 2)
        echo $t;
}
function getLastMessage($con, $sender, $receiver)
{
    $sql = "SELECT message from  messages where (sender='$sender' and email='$receiver' ) or (email='$sender' and email='$sender' ) order by id desc";//echo $sql;
    if ($result = $con->QUERY_RUN($con, $sql)) {
        $row = $result->fetch_object();
    }
    return $row;
}

function repeatedMessage($source, $sender, $receiver, $loginer)
{
    for ($i = 0; $i < count($source); $i++) {
        if ((($source[$i]->email == $sender) and ($source[$i]->sender == $receiver)) || (($source[$i]->sender == $sender) and ($source[$i]->email == $receiver)))
            return true;
    }
    return false;
}

function sendMessage($con)
{
    $email = $_GET['email'];
    $sender = $_GET['sender'];
    $message = $_GET['message'];
    $id = $con->GET_MAX_COL('messages', 'id');
    $date = date("YmdHis");
    $sql = "insert into messages values($id,'$sender','$email','$message','$date','no')";  //echo $sql;
    $con->QUERY_RUN($con, $sql);
    echo ('[{"success":' . '"YES"' . "}]");
}


function updateUserCommentlike($con)
{
    $cid = $_GET['cid'];
    $action = $_GET['action'];
    if (strcmp($action, 'add') == 0)
        $cond = "likecount+1";
    else
        $cond = "likecount-1";
    $resultArray = array();
    $tempArray = array();
    $sql = "update comment set likecount=" . $cond . " where id=$cid";  //echo $sql;
    echo ('[{"success":' . '"YES"' . "}]");
}


function fetch_experiences_by_parameters($con, $offset, $groupId, $seed, $typeOfPost, $userEmail, $sort)
{
    if (strcmp($seed, 'public') != 0) {
        if (strcmp($userEmail, 'undefined') != 0)
            $result = fetch_experiences_by_interresting_cats($con, $offset, $groupId, $typeOfPost, $userEmail);//var_dump($arrayInterrestedPosts);
    } else {
        $result = fetch_experiences_by_public($con, $offset, $groupId, $typeOfPost, $userEmail);//var_dump($arrayInterrestedPosts);    
    }

    if (strcmp($sort, 'new') == 0) {
        usort($result, "cmp");
    } else if (strcmp($sort, 'like') == 0)
        usort($result, "likeCmp");

    $t = json_encode($result);
    if (strlen($t) != 2)
        echo $t;
}



function deletePost($con)
{
    $userEmail = $_GET['email'];
    $eid = $_GET["eid"];
    $sql = "SELECT * FROM user,exp where user.email='$userEmail'and user.id=exp.userid and exp.id=$eid";
    if ($result = $con->QUERY_RUN($con, $sql)) {
        $row = $result->fetch_object();
        if ($row->id) {
            $sql = "delete from  comment where expid=$eid ";
            $result = $con->QUERY_RUN($con, $sql);

            $sql = "delete from  likes where expid=$eid ";
            $result = $con->QUERY_RUN($con, $sql);

            $sql = "delete from  exp_category where expid=$eid ";
            $result = $con->QUERY_RUN($con, $sql);

            $sql = "delete from  exp where id=$eid ";
            $result = $con->QUERY_RUN($con, $sql);
        }
    }

    fetch_experiences_by_parameters($con, 0, 'all', 'public', 'all', $userEmail, 'new');
}

function deleteComment($con)
{
    $eid = $_GET['eid'];
    $sql = "delete from  comment where id=$eid ";
    $result = $con->QUERY_RUN($con, $sql);
}

function fetchSavedPosts($con)
{
    $userEmail = $_GET['email'];
    $resultArray = array();
    $tempArray = array();
    $sql = "SELECT saves.expid as id,exp.title,exp.content,exp.date,exp.typeofpost,exp.userid FROM `saves` ,exp where exp.id=saves.expid and saves.useremail='$userEmail'"; //echo $sql;
    if ($result = $con->QUERY_RUN($con, $sql)) {
        while ($row = $result->fetch_object()) {
            $row->email = fetchUserByUserid($con, $row->userid)->email;
            $tempArray = $row;
            array_push($resultArray, $row);
        }
    }
    $t = json_encode($resultArray);
    if (strlen($t) != 2)
        echo $t;
}

function savePost($con)
{
    $userEmail = $_GET['userEmail'];
    $postId = $_GET["postId"];
    $sql = "SELECT * FROM saves where useremail='$userEmail' and expid=$postId"; //echo $sql;
    if ($result = $con->QUERY_RUN($con, $sql)) {
        $row = $result->fetch_object();
        if ($row->expid)
            $sqlFinal = "delete FROM saves where useremail='$userEmail' and expid=$postId";
        else {
            $sqlFinal = "insert into saves values('$userEmail',$postId)";
        }
        $result = $con->QUERY_RUN($con, $sqlFinal);
    }


    echo ('[{"success":' . '"YES"' . "}]");
}



function sendSms($con, $phone, $ref)
{

    $client = new SoapClient("http://188.0.240.110/class/sms/wsdlservice/server.php?wsdl");
    $user = "09188108019";
    $pass = "AnDyMaMa!1";
    $fromNum = "+9890000145";
    $toNum = array($phone);
    $pattern_code = "181p4w4p35";
    $input_data = array(
        "verification-code" => $ref,

    );
    echo $client->sendPatternSms($fromNum, $toNum, $user, $pass, $pattern_code, $input_data);
}

function sendCodeMobile($con)
{
    $mobile = $_GET['mobile'];
    $row->result = 'finish';
    $t = json_encode($row);
    $sql = "delete from  codelogin where mobile='$mobile' ";
    $result = $con->QUERY_RUN($con, $sql);
    $code = rand(12345, 99999);
    $sql = "insert into codelogin values('$mobile','$code') ";
    $result = $con->QUERY_RUN($con, $sql);
    sendSms($con, $mobile, $code);
    if (strlen($t) != 2)
        echo $t;
}

function loginViaMobile($con)
{
    $mobile = $_GET['mobile'];
    $code = $_GET['code'];
    $sql = "SELECT * from codelogin where mobile='$mobile' and code='$code'"; //echo $sql;
    if ($result = $con->QUERY_RUN($con, $sql)) {
        while ($row = $result->fetch_object()) {
            REGISTERPARAMETER($con, $mobile);
        }
    } else {
        echo ('[{"success":' . '"no"' . "}]");
    }

}
function REGISTERPARAMETER($con, $mobile)
{
    $sql = "SELECT * FROM user where phone='$mobile'";
    if ($result = $con->QUERY_RUN($con, $sql)) {
        if ($row = $result->fetch_object()) {
            $row->firstName = $row->name;
            $row->lastName = $row->family;
        } else {
            $id = $con->GET_MAX_COL('user', 'id');
            $sql = "insert into user values($id,1,'','','$mobile','$mobile','','','','','','','')";//echo $sql;
            $result = $con->QUERY_RUN($con, $sql);

            $sql = "SELECT * FROM user where phone='$mobile'";
            if ($result = $con->QUERY_RUN($con, $sql)) {
                if ($row = $result->fetch_object()) {
                    $row->firstName = $row->name;
                    $row->lastName = $row->family;
                }
            }
        }
        $t = json_encode($row);
        if (strlen($t) != 2)
            echo $t;
    }
}

function FetchUserProfileByArgument($con, $id)
{
    $resultArray = array();
    $tempArray = array();
    $sql = "SELECT email FROM user where email='$id'"; // echo $sql;
    if ($result = $con->QUERY_RUN($con, $sql)) {
        while ($row = $result->fetch_object()) {
            $tempArray = $row;
            array_push($resultArray, $row);
        }
    }
    $t = json_encode($resultArray);
    if (strlen($t) != 2)
        echo $t;
}

function FetchUserProfileByArgumentFull($con, $email)
{
    $resultArray = array();
    $tempArray = array();
    $sql = "SELECT id,name,family,email,birthdate,cityid FROM user where email='$email'";
    if ($result = $con->QUERY_RUN($con, $sql)) {
        while ($row = $result->fetch_object()) {
            $tempArray = $row;
            $row->interrests = fetchUserInterrests($con, $row->id);
            array_push($resultArray, $row);
        }
    }
    $t = json_encode($resultArray);
    if (strlen($t) != 2)
        echo $t;
}

function fetchUserInterrests($con, $uid)
{
    $resultArray = array();
    $sql = "SELECT catid,name FROM user_category  inner  join category on category.id=user_category.catid  where userid=$uid"; //echo $sql;
    if ($result = $con->QUERY_RUN($con, $sql)) {
        while ($row = $result->fetch_object()) {
            array_push($resultArray, $row);
        }
    }
    return $resultArray;
}

function doUserLikeCategory($con, $userid, $catid)
{
    $sql = "SELECT * from user_category where userid=$userid and catid=$catid";
    if ($result = $con->QUERY_RUN($con, $sql)) {
        while ($row = $result->fetch_object()) {
            return true;
        }
    }
    return false;
}

function toggleLikeCategoriese($con)
{
    $userEmail = $_GET['email'];
    $action = $_GET['action'];
    $catid = $_GET['catid'];
    $userid = fetchUserByUserEmail($con, $userEmail)->id;
    $id = $con->GET_MAX_COL('user_category', 'id');
    // $catId=findCatIdByName($con,$cat[$i]);
    if (strcmp($action, 'remove') == 0)
        $sql = "delete from user_category where userid=$userid and catid=$catid";
    else {
        if (!doUserLikeCategory($con, $userid, $catid))
            $sql = "insert into user_category values($id,$userid,$catid)";
    }
    $con->QUERY_RUN($con, $sql);
    FetchUserProfileByArgumentFull($con, $userEmail);
}

function getFollowerOfThisUser($con, $userid)
{
    $resultArray = array();
    $sql = "SELECT followerid,date from follows where userid=$userid";
    if ($result = $con->QUERY_RUN($con, $sql)) {
        while ($row = $result->fetch_object()) {
            $row->email = fetchUserByUserid($con, $row->followerid)->email;
            if (strcmp(fetchUserByUserid($con, $row->followerid)->email, 'guest') != 0)
                array_push($resultArray, $row);
        }
    }
    return $resultArray;
}

function getFollowingOfThisUser($con, $userid)
{
    $resultArray = array();
    $sql = "SELECT userid,date from follows where followerid=$userid";
    if ($result = $con->QUERY_RUN($con, $sql)) {
        while ($row = $result->fetch_object()) {
            $row->email = fetchUserByUserid($con, $row->userid)->email;
            if (strcmp(fetchUserByUserid($con, $row->userid)->email, 'guest') != 0)
                array_push($resultArray, $row);
        }
    }
    return $resultArray;
}

function followerOfUsers($con)
{
    $userEmail = $_GET['user'];
    $resultArray = array();
    $tempArray = array();
    $sql = "SELECT distinct id from user where email='$userEmail'";
    if ($result = $con->QUERY_RUN($con, $sql)) {
        while ($row = $result->fetch_object()) {
            $row->follower = getFollowerOfThisUser($con, $row->id);
            $row->following = getFollowingOfThisUser($con, $row->id);
            $tempArray = $row;
            array_push($resultArray, $row);
        }
    }

    $t = json_encode($resultArray);
    if (strlen($t) != 2)
        echo $t;
}





function doUserFollowThisUser($con, $userid, $followerid)
{
    $sql = "SELECT * from follows where followerid=$followerid and userid=$userid";//echo $sql;
    if ($result = $con->QUERY_RUN($con, $sql)) {
        while ($row = $result->fetch_object()) {
            return true;
        }
    }
    return false;
}

function toggleFollowing($con)
{
    $followerid = $_GET['followerid'];
    $userid = $_GET['userid'];
    $action = $_GET['action'];

    $id = $con->GET_MAX_COL('follows', 'id');
    $date = date("YmdHis");

    if (strcmp($action, 'remove') == 0)
        $sql = "delete from follows where userid=$userid and followerid=$followerid";
    else {
        if (!doUserFollowThisUser($con, $userid, $followerid))
            $sql = "insert into follows values($id,$followerid,$userid,'$date')";
    }
    $con->QUERY_RUN($con, $sql);
    followerOfUsersSimple($con);

}

function followerOfUsersSimple($con)
{
    $resultArray = array();
    $tempArray = array();
    $sql = "SELECT distinct id from user";
    if ($result = $con->QUERY_RUN($con, $sql)) {
        while ($row = $result->fetch_object()) {
            $row->follower = getFollowerOfThisUser($con, $row->id);
            $tempArray = $row;
            array_push($resultArray, $row);
        }
    }

    $t = json_encode($resultArray);
    if (strlen($t) != 2)
        echo $t;
}

function fetchCategoriese($con, $id)
{
    $resultArray = array();
    $tempArray = array();
    $sql = "SELECT * from category"; // echo $sql;
    if ($result = $con->QUERY_RUN($con, $sql)) {
        while ($row = $result->fetch_object()) {
            $tempArray = $row;
            array_push($resultArray, $row);
        }
    }

    $t = json_encode($resultArray);
    if (strlen($t) != 2)
        echo $t;
}
function updateProfilePicture($con)
{
    $email = $_GET['email'];
    $userid = $email;

    $file_names = $_FILES["file"]["name"];
    $file = $file_names;
    for ($i = 0; $i < 1; $i++) {
        $file_name = $file_names[$i];
        $extension = end(explode(".", $file_name));
        $original_file_name = pathinfo($file_name, PATHINFO_FILENAME);
        $file_url = $original_file_name . "-" . date("YmdHis") . "." . $extension;
        $pathDir = "./users/" . $userid;
        if (!is_dir($pathDir)) {
            mkdir($pathDir);
        }

        $folderPath = $pathDir . "/user.jpg";//echo $folderPath;
        move_uploaded_file($_FILES["file"]["tmp_name"][$i], $folderPath);
    }
    echo ('[{"commited":"success"}]');

}

function updateUserProfile($con)
{
    $email = $_GET['email'];
    $firstName = $_GET['firstName'];
    $lastName = $_GET['lastName'];
    $telegram = $_GET['telegram'];
    $email2 = $_GET['email2'];
    $instagram = $_GET['instagram'];
    $whatsapp = $_GET['whatsapp'];
    $job = $_GET['job'];
    $resultArray = array();
    $tempArray = array();
    $sql = "update user set name='$firstName', family='$lastName',job='$job',telegram='$telegram',instagram='$instagram',whatsapp='$whatsapp',email2='$email2' where email='$email'";  //echo $sql;
    if ($result = $con->QUERY_RUN($con, $sql)) {
        FetchUserProfileByArgument($con, $email);
    }
}

function fetchPostOfAUser($con)
{
    $id = $_GET['uid'];
    $id = fetchUserByUserEmail($con, $id)->id;
    $resultArray = array();
    $tempArray = array();
    $sql = "SELECT * FROM exp where userid=$id order by id desc";  //echo $sql;
    if ($result = $con->QUERY_RUN($con, $sql)) {
        while ($row = $result->fetch_object()) {
            $tempArray = $row;
            $row->user = fetchUserByUserid($con, $row->userid);
            $row->comments = fetchCommentByPostid($con, $row->id);
            $row->likes = fetchLikesByPostid($con, $row->id);
            $row->saves = fetchSavesByPostid($con, $row->id);
            array_push($resultArray, $row);
        }
    }
    $t = json_encode($resultArray);
    if (strlen($t) != 2)
        echo $t;

}



function FetchUserProfile($con)
{
    $id = $_GET['uid'];
    $resultArray = array();
    $tempArray = array();
    $sql = "SELECT id,name,family,email,birthdate,cityid,job,instagram,telegram,whatsapp,email2 FROM user where email='$id'"; // echo $sql;
    if ($result = $con->QUERY_RUN($con, $sql)) {
        while ($row = $result->fetch_object()) {
            $tempArray = $row;
            $row->interrests = fetchUserInterrests($con, $row->id);
            array_push($resultArray, $row);
        }
    }

    $t = json_encode($resultArray);
    if (strlen($t) != 2)
        echo $t;
}

function fetchPostOfAUserByArgument($con, $email)
{
    $id = fetchUserByUserEmail($con, $email)->id;//echo $id;
    $resultArray = array();
    $tempArray = array();
    $sql = "SELECT * FROM exp where userid=$id order by id desc"; // echo $sql;
    if ($result = $con->QUERY_RUN($con, $sql)) {
        while ($row = $result->fetch_object()) {
            $row->user = fetchUserByUserid($con, $row->userid);
            $row->likes = fetchLikesByPostid($con, $row->id);
            $tempArray = $row;
            array_push($resultArray, $row);
        }
    }
    return $resultArray;

}



function fetchUserBoard($con)
{
    $email = $_GET['email'];
    $resultArray = array();
    $tempArray = array();
    $sql = "SELECT id,name,family,email,birthdate,cityid,job FROM user where email='$email'"; // echo $sql;
    if ($result = $con->QUERY_RUN($con, $sql)) {
        while ($row = $result->fetch_object()) {
            $tempArray = $row;
            $row->posts = fetchPostOfAUserByArgument($con, $email);
            array_push($resultArray, $row);
        }
    }

    $t = json_encode($resultArray);
    if (strlen($t) != 2)
        echo $t;
}

function fetch_one_experiences($con)
{
    $postid = $_GET['postid'];
    $resultArray = array();
    $tempArray = array();
    $sql = "update exp set scorezoom=scorezoom+1 where id=$postid"; // echo $sql;
    $result = $con->QUERY_RUN($con, $sql);
    $sql = "SELECT * FROM exp where id=$postid"; // echo $sql;
    if ($result = $con->QUERY_RUN($con, $sql)) {
        while ($row = $result->fetch_object()) {
            $tempArray = $row;
            $row->user = fetchUserByUserid($con, $row->userid);
            $row->comments = [];
            $row->likes = fetchLikesByPostid($con, $row->id);
            $row->city = fetchCityByCityid($con, $row->cityid);
            $row->groups = fetchGroupByGroupid($con, $row->groupid);
            $row->typeofpost = strcmp($row->typeofpost, 'female') == 0 ? 'خانم' : 'آقا';
            $row->saves = fetchSavesByPostid($con, $row->id);
            $row->score = ceil((count($row->saves) * 2 + count($row->likes) * 3 + $row->scorezoom * 0.3) / 200);
            $row->viewCount = $row->scorezoom;


            array_push($resultArray, $row);
        }
    }
    $t = json_encode($resultArray);
    if (strlen($t) != 2)
        echo $t;
}
function fetchGroupByGroupid($con, $groupid)
{
    $sql = "SELECT * FROM groups where id=$groupid";//echo $sql;
    if ($result = $con->QUERY_RUN($con, $sql)) {
        $row = $result->fetch_object();
        return $row->title;
    }
}


function fetchCityByCityid($con, $cityid)
{
    $sql = "SELECT * FROM city,province where city.province_id=province.province_id and city.id='$cityid'";//echo $sql;
    if ($result = $con->QUERY_RUN($con, $sql)) {
        $row = $result->fetch_object();
        return $row->province . " - " . $row->city;
    }
}

function findCatIdByName($con, $name)
{
    $sql = "SELECT * FROM category where name='$name'";//echo $sql;
    if ($result = $con->QUERY_RUN($con, $sql)) {
        while ($row = $result->fetch_object()) {
            return $row->id;
        }
        $catid = $con->GET_MAX_COL('category', 'id');
        $sql2 = "insert into category values($catid,'$name',1)";
        $result2 = $con->QUERY_RUN($con, $sql2);

        $sql3 = "SELECT * FROM category where name='$name'";//  echo $sql;
        if ($result = $con->QUERY_RUN($con, $sql3)) {
            while ($row3 = $result->fetch_object()) {
                return $row3->id;
            }
        }

    }
}

function submitPost($con)
{
    $email = $_GET['userid'];
    $userid = fetchUserByUserEmail($con, $_GET['userid'])->id;
    $groupid = $_GET['groupid'];
    $cat = explode(",", $_GET['category']);//var_dump( $cat);
    $title = $_GET['title'];
    $sx = $_GET['sx'];
    $content = $_GET['content'];
    $color = $_GET['color'];
    $brand = $_GET['brand'];
    $sizes = $_GET['sizes'];
    $price = $_GET['price'];
    $material = $_GET['material'];
    $scent = $_GET['scent'];
    $country = $_GET['country'];
    $discount = $_GET['discount'];

    $date = date("YmdHis");
    $expid = $con->GET_MAX_COL('exp', 'id');



    $sql = "insert into exp values($expid,$userid,$groupid,'$title','$content','$date',1,'$color','$brand','$sizes','$price','$material','$sx','$scent','$country','$discount')";
    echo $sql;
    $con->QUERY_RUN($con, $sql);
    for ($i = 0; $i < count($cat); $i++) {
        $id = $con->GET_MAX_COL('exp_category', 'id');
        $catId = findCatIdByName($con, $cat[$i]);
        if ($catId != '') {
            $sql = "insert into exp_category values($id,$expid,$catId)";
            echo $sql;
            $con->QUERY_RUN($con, $sql);
        }
    }
    $file = $_FILES["file"];
    $id = $expid;
    imgUpload($con, $email, $id, $file);
}

function imgUpload($con, $userid, $id, $file)
{
    $folderPath = "../";
    $file_names = $_FILES["file"]["name"];
    $file = $file_names;
    for ($i = 0; $i < 1; $i++) {
        $file_name = $file_names[$i];
        $extension = end(explode(".", $file_name));
        $original_file_name = pathinfo($file_name, PATHINFO_FILENAME);
        $file_url = $original_file_name . "-" . date("YmdHis") . "." . $extension;
        $pathDir = "./users/" . $userid;
        if (!is_dir($pathDir)) {
            mkdir($pathDir);
        }
        if (strcmp($id, '0') != 0) {
            $pathDir = "./users/" . $userid . "/" . $id;
            if (!is_dir($pathDir)) {
                mkdir($pathDir);
            }
        }

        $folderPath = $pathDir . "/" . (1 + $i) . ".jpg";//echo $folderPath;
        move_uploaded_file($_FILES["file"]["tmp_name"][$i], $folderPath);
    }
    echo ('[{"commited":"success"}]');

}

function submitComment($con)
{
    $userLoginedId = $_GET['userLoginedId'];
    $postId = $_GET['postId'];
    $comment = $_GET['comment'];
    $userID = fetchUserByUserEmail($con, $userLoginedId)->id;//echo $userID;
    $resultArray = array();
    $tempArray = array();
    $cid = $con->GET_MAX_COL('comment', 'id');

    $sql = "insert into comment values($cid,$userID,'$comment',0,$postId,0)"; //echo $sql;
    $con->QUERY_RUN($con, $sql);

    $sql = "SELECT * FROM comment where expid=$postId order by id desc";
    if ($result = $con->QUERY_RUN($con, $sql)) {
        while ($row = $result->fetch_object()) {
            $tempArray = $row;
            $objectResult = null;
            $objectResult->user = fetchUserByUserid($con, $row->userid);
            $objectResult->userEmailDestination = '';
            $objectResult->id = $row->id;
            $objectResult->expid = $row->expid;
            $objectResult->comment = $row->comment;
            $user = null;

            array_push($resultArray, $objectResult);
        }
    }
    $t = json_encode($resultArray);
    if (strlen($t) != 2)
        echo $t;
}

function replaceColorize($source, $word)
{
    $result = str_replace(strtolower($word), "<span class='text-danger fw-bold' style='color:red !important'>" . $word . "</span>", strtolower($source));
    return $result;
}
function searchPostByWord($con)
{
    $word = $_GET['word'];
    $word1 = str_replace(' ', '', $word);
    $word1 = strtolower($word1);
    if (strcmp($word, 'RESET123') === 0)
        echo ('[{"success":' . '"reset"' . "}]");
    else {
        $resultArray = array();
        $tempArray = array();
        $sql = "select * from user where trim(lower(name)) like '%$word1%' or trim(lower(family)) like '%$word1%' or trim(lower(email)) like '%$word1%' ";//echo $sql;
        if ($result = $con->QUERY_RUN($con, $sql)) {
            while ($row = $result->fetch_object()) {
                $tempArray = $row;
                $row->user = fetchUserByUserid($con, $row->userid);
                $row->comments = fetchCommentByPostid($con, $row->id);
                $row->likes = fetchLikesByPostid($con, $row->id);
                $row->saves = fetchSavesByPostid($con, $row->id);
                $row->title = replaceColorize($row->title, $word);
                $row->content = replaceColorize($row->content, $word);
                $row->category = fetch_experiences_categories($con, $row->id);
                array_push($resultArray, $row);
            }
        }
        $t = json_encode($resultArray);
        if (strlen($t) != 2)
            echo $t;
        else
            echo ('[{"success":' . '"not found"' . "}]");
    }
}

function fetchMenuCat($con)
{
    $offset = $_GET['offset'];
    $resultArray = array();
    $tempArray = array();
    $sql = "SELECT * FROM groups order by title ";
    if ($result = $con->QUERY_RUN($con, $sql)) {
        while ($row = $result->fetch_object()) {
            $tempArray = $row;
            $row->count = CountCategory($con, $row->id);
            array_push($resultArray, $row);
        }
    }
    $t = json_encode($resultArray);
    if (strlen($t) != 2)
        echo $t;
}

function CountCategory($con, $id)
{
    $sql = "SELECT count(*) as count FROM exp  where groupid=$id group by groupid";
    if ($result = $con->QUERY_RUN($con, $sql)) {
        $row = $result->fetch_object();
        return $row->count;
    }
}

function likePost($con)
{
    $userEmail = $_GET['userEmail'];
    $postId = $_GET["postId"];
    $sql = "SELECT * FROM likes where useremail='$userEmail' and expid=$postId"; //echo $sql;
    if ($result = $con->QUERY_RUN($con, $sql)) {
        $row = $result->fetch_object();
        if ($row->expid)
            $sqlFinal = "delete FROM likes where useremail='$userEmail' and expid=$postId";
        else {
            $sqlFinal = "insert into likes values('$userEmail',$postId)";
            doFavouritePost($con, $postId, $userEmail);
        }
        $result = $con->QUERY_RUN($con, $sqlFinal);
    }
    echo ('[{"success":' . '"YES"' . "}]");
}

function doFavouritePost($con, $postId, $userEmail)
{
    $sql = "SELECT * FROM exp where id=$postId"; //echo $sql;
    if ($result = $con->QUERY_RUN($con, $sql)) {
        $row = $result->fetch_object();

    }
    $id = $con->GET_MAX_COL('favourite', 'id');
    $userid = fetchUserByUserEmail($con, $userEmail)->id;
    $res = isExistsInFavourite($con, $userid);
    if ($res == 0)
        $sql = "insert into favourite values($id,$userid,$row->groupid,'$row->typeofpost',$row->height	,$row->weight	,'$row->hair'	,'$row->eye'	,'$row->glass'	,$row->waist	,$row->hips	,$row->arm	,$row->armpit	,$row->thigh	,'$row->tatto'	,'$row->smoke'	,'$row->drink'
       ,'$row->region'	,'$row->openrelation'	,'$row->mainattr'	,$row->income	,'$row->car'	,'$row->house'	,'$row->sport'	,$row->age
       )";
    else
        $sql = "update favourite set groupid=$row->groupid,typeofpost='$row->typeofpost',height=(height+$row->height)/2 where userid=$userid";
    echo $sql;
    $result = $con->QUERY_RUN($con, $sql);
    echo ('[{"success":' . '"YES"' . "}]");
}

function isExistsInFavourite($con, $postId)
{
    $sql = "SELECT * FROM favourite where id=$postId";// echo $sql;
    if ($result = $con->QUERY_RUN($con, $sql)) {
        $rows = $result->fetch_object();
        if ($rows->id)
            return $rows->id;
    }
    return 0;
}

function REGISTER($con)
{
    $jsonUser = $_GET['jsonUser'];
    $obj = json_decode($jsonUser, true);
    $firstName = $obj["firstName"];
    $lastName = $obj["lastName"];
    $email = $obj["email"];
    $sql = "SELECT * FROM user where email='$email'";
    $result = $con->QUERY_RUN($con, $sql);
    if ($row = $result->fetch_object()) {
        echo ('[{"user_id":' . $row->id . "}]");

    } else {
        $id = $con->GET_MAX_COL('user', 'id');
        $sql = "insert into user(id,name,family,email,phone) values($id,'$firstName','$lastName','$email','$email')";
        $result = $con->QUERY_RUN($con, $sql);
        echo ('[{"user_id":' . $id . "}]");
    }
}
function fetch_experiences_categories($con, $postId)
{
    $resultArray = array();
    $sql = "SELECT * FROM exp_category where expid=$postId"; //echo $sql;
    if ($result = $con->QUERY_RUN($con, $sql)) {
        while ($row = $result->fetch_object()) {
            $id = $row->catid;
            $sql2 = "SELECT * FROM category where id=$id"; //echo $sql2;
            if ($result2 = $con->QUERY_RUN($con, $sql2)) {
                $row2 = $result2->fetch_object();
                array_push($resultArray, $row2->name);
            }
        }
    }
    return $resultArray;
}

function fetch_experiences_by_public($con, $offset, $groupId, $typeOfPost, $userEmail, $conditionFilter)
{
    $resultArray = array();
    $tempArray = array();
    if (strcmp($groupId, "all") == 0)
        $addSql = " ";
    else
        $addSql = " and groupid=$groupId ";
    if (strcmp($typeOfPost, "all") == 0)
        $addSqlTypeExp = " ";
    else
        $addSqlTypeExp = " typeofpost='$typeOfPost' ";

    if ((strcmp($typeOfPost, "all") != 0) && (strcmp($groupId, "all") != 0))
        $and = " and ";

    $lastCondition = $addSql . $and . $addSqlTypeExp;
    $sql = "SELECT * FROM exp where id>0 $lastCondition $conditionFilter order by id desc LIMIT 20 OFFSET $offset";//  echo $sql;
    if ($result = $con->QUERY_RUN($con, $sql)) {
        while ($row = $result->fetch_object()) {
            $tempArray = $row;
            $row->category = fetch_experiences_categories($con, $row->id);
            $row->user = fetchUserByUserid($con, $row->userid);
            $row->comments = fetchCommentByPostid($con, $row->id);
            $row->likes = fetchLikesByPostid($con, $row->id);
            $row->saves = fetchSavesByPostid($con, $row->id);
            $row->location = getCityProvinceByCityid($con, $row->cityid);
            $row->score = ceil((count($row->saves) * 2 + count($row->likes) * 3 + $row->scorezoom * 0.3) / 200);
            //$row->content='';
            $row->numLikes = count($row->likes);
            array_push($resultArray, $row);
        }
    }
    return $resultArray;
}

function fetch_experiences_by_interresting_cats($con, $offset, $groupId, $typeOfPost, $userEmail, $conditionFilter)
{
    $resultArray = array();
    $tempArray = array();
    if (strcmp($groupId, "all") == 0)
        $addSql = " ";
    else
        $addSql = "and groupid=$groupId ";
    if (strcmp($typeOfPost, "all") == 0)
        $addSqlTypeExp = " ";
    else
        $addSqlTypeExp = " typeofpost='$typeOfPost' ";
    if ((strcmp($typeOfPost, "all") != 0) || (strcmp($groupId, "all") != 0))
        $and1 = " and ";
    if ((strcmp($typeOfPost, "all") != 0) && (strcmp($groupId, "all") != 0))
        $and2 = " and ";

    $lastCondition = $addSql . $and2 . $addSqlTypeExp;
    $sql = "select * from( SELECT userid,catid,email FROM user_category join user on user_category.userid=user.id)as t1 JOIN ( SELECT userid as userid2, groupid, title, content, confirm, typeofpost,date, expid,expid as id, catid FROM exp join exp_category on exp_category.expid=exp.id) as t2 on t1.userid=t2.userid2 and t1.catid=t2.catid
 where email='$userEmail' $and1 $lastCondition $conditionFilter LIMIT 20 OFFSET $offset"; //echo $sql;
    if ($result = $con->QUERY_RUN($con, $sql)) {
        while ($row = $result->fetch_object()) {
            $tempArray = $row;
            $row->category = fetch_experiences_categories($con, $row->expid);
            $row->user = fetchUserByUserid($con, $row->userid);
            $row->comments = fetchCommentByPostid($con, $row->expid);
            $row->likes = fetchLikesByPostid($con, $row->expid);
            $row->saves = fetchSavesByPostid($con, $row->expid);
            $row->location = getCityProvinceByCityid($con, $row->cityid);
            $row->score = ceil((count($row->saves) * 2 + count($row->likes) * 3 + $row->scorezoom * 0.3) / 200);
            array_push($resultArray, $row);
        }
    }
    return $resultArray;

}
function getCityProvinceByCityid($con, $cityid)
{
    $location = ['', ''];
    $sql = "SELECT * FROM city where id=$cityid";
    if ($result = $con->QUERY_RUN($con, $sql)) {
        $row = $result->fetch_object();
        $location[0] = $row->city;
        $sql_ = "SELECT * FROM province where province_id=$row->province_id";
        if ($result_ = $con->QUERY_RUN($con, $sql_)) {
            $row_ = $result_->fetch_object();
            $location[1] = $row_->province;
        }
    }
    return $location;
}



function fetch_experiences($con)
{
    $offset = $_GET['offset'];
    $groupId = $_GET['groupId'];
    $seed = $_GET['seed'];
    $typeOfPost = $_GET['typeOfPost'];
    $userEmail = $_GET['userEmail'];
    $sort = $_GET['sort'];
    $filter = json_decode($_GET['filter']);
    if ($filter) {
        for ($i = 0; $i < count($filter); $i++) {
            $cond .= ' and ';
            if (strcmp($filter[$i]->name, "price") == 0)
                if ((!$filter[$i]->value)) {
                    $cond .= $filter[$i]->name . '<=' . $filter[$i]->valueMax . " and " . $filter[$i]->name . '>=' . $filter[$i]->valueMin;
                } else {
                    $cond .= $filter[$i]->name . "='" . $filter[$i]->value . "'";
                } else {
                $tmp1 = explode(",", $filter[$i]->value);
                // echo $tmp1[0];
                for ($j = 0; $j < count($tmp1); $j++) {
                    $cond .= $filter[$i]->name . " like '%" . $tmp1[$j] . "%'";
                    if ($tmp1[$j + 1])
                        $cond .= ' or ';
                }
            }




        }

    }

    $result = fetch_experiences_by_public($con, $offset, $groupId, $typeOfPost, $userEmail, $cond);//var_dump($arrayInterrestedPosts);  
    if (strcmp($sort, 'new') == 0) {
        usort($result, "cmp");
    } else if (strcmp($sort, 'like') == 0)
        usort($result, "likeCmp");
    else if (strcmp($sort, 'view') == 0)
        usort($result, "viewCmp");

    $t = json_encode($result);
    if (strlen($t) != 2)
        echo $t;
    else
        echo ('[{"finish":"yes"}]');
}




function viewCmp($object1, $object2)
{
    return (int) ($object1->scorezoom) < (int) ($object2->scorezoom);
}


function likeCmp($object1, $object2)
{
    return (int) ($object1->numLikes) < (int) ($object2->numLikes);
}

function cmp($object1, $object2)
{
    return (int) ($object1->id) < (int) ($object2->id);
}

function notInserted($row, $source)
{
    for ($i = count($source) - 1; $i >= 0; $i--) {
        if ($source[$i]->id == $row->id)
            return true;
    }
    return false;
}

function fetchUserByUserEmail($con, $email)
{
    $sql = "SELECT * FROM user where email='$email'";//echo $sql;
    if ($result = $con->QUERY_RUN($con, $sql))
        $row = $result->fetch_object();
    return $row;
}

function fetchUserByUserid($con, $uid)
{
    $sql = "SELECT * FROM user where id=$uid";//echo $sql;
    if ($result = $con->QUERY_RUN($con, $sql))
        $row = $result->fetch_object();
    return $row;
}

function fetchCommentByPostid($con, $postid)
{
    $comment = array();
    $sql = "SELECT * FROM comment where expid=$postid order by id desc";//echo $sql;
    if ($result = $con->QUERY_RUN($con, $sql))
        while ($row = $result->fetch_object()) {
            $row->user = fetchUserByUserid($con, $row->userid);
            array_push($comment, $row);
        }
    return $comment;
}

function fetchLikesByPostid($con, $postid)
{
    $likes = array();
    $sql = "SELECT * FROM likes where expid=$postid";//echo $sql;
    if ($result = $con->QUERY_RUN($con, $sql))
        while ($row = $result->fetch_object()) {
            array_push($likes, $row);
        }
    return $likes;
}
function fetchSavesByPostid($con, $postid)
{
    $likes = array();
    $likes = [];
    $sql = "SELECT * FROM saves where expid=$postid";//echo $sql;
    if ($result = $con->QUERY_RUN($con, $sql))
        while ($row = $result->fetch_object()) {
            array_push($likes, $row);
        }
    return $likes;
}

?>