<?php
//прием запросов с клиента
header("Access-Control-Allow-Origin: *"); 
header("Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token , Authorization");

include_once 'repository.php';
include_once './utils/token.php';

$repository = new BookingRepository();
$token = new Token();
// http://localhost/controller.php?key=get-cars&id=3&name=John
if(isset($_GET['key'])){
    switch($_GET['key']){
        case 'get-cars':
            // echo json_encode($repository->GetCars($_GET['dateFrom'],$_GET['dateTo'],$_GET['priceFrom'],$_GET['priceTo']));
            echo json_encode($repository->GetCars(null, null, null, null));
            return;
        case 'get-places':
            echo json_encode($repository->GetPlaces());
            return;
        case 'add-place':
            if($decodeToken = checkToken($token, true)){
                $data = json_decode(file_get_contents("php://input"));
                echo json_encode($repository->AddPlace($data));
            }
            return;
        case 'update-place':
            if($decodeToken = checkToken($token, true)){
                $data = json_decode(file_get_contents("php://input"));
                echo json_encode($repository->UpdatePlace($data));
            }
            return;
        case 'delete-place':
            if($decodeToken = checkToken($token, true)){
                echo json_encode($repository->DeletePlace($_GET['placeId']));
            }
            return;
        case 'get-car':
            echo json_encode($repository->GetCarDetails($_GET['carId']));
            return;
        case 'add-order':
            if($decodeToken = checkToken($token)){
                $data = json_decode(file_get_contents("php://input"));
                echo json_encode($repository->AddOrder($decodeToken->id, $data));
            }
            return;
        case 'sign-in':
            $data = json_decode(file_get_contents("php://input"));
            echo json_encode($repository->SignIn($data));
            return;
        case 'sign-up':
            $data = json_decode(file_get_contents("php://input"));
            echo json_encode($repository->SignUp($data));
            return;
        case 'get-history':
            if($decodeToken = checkToken($token)){
                echo json_encode($repository->GetHistory($decodeToken->id));
            }
            return;
        case 'get-user-info':
            if($decodeToken = checkToken($token)){
                $data = json_decode(file_get_contents("php://input"));
                echo json_encode($repository->GetUserInfo($decodeToken->id));
                return;
            }
            return;
        case 'add-car':
            if($decodeToken = checkToken($token, true)){
                $data = json_decode(file_get_contents("php://input"));
                echo json_encode($repository->AddCar($data));
            }
            return;
        case 'update-car':
            if($decodeToken = checkToken($token, true)){
                $data = json_decode(file_get_contents("php://input"));
                echo json_encode($repository->UpdateCar($data));
            }
            return;
        case 'update-user-info':
            if($decodeToken = checkToken($token)){
                $data = json_decode(file_get_contents("php://input"));
                echo json_encode($repository->UpdateUserInfo($decodeToken->id, $data));
            }
            return;
        case 'update-order':
            if($decodeToken = checkToken($token)){
                $data = json_decode(file_get_contents("php://input"));
                echo json_encode($repository->UpdateOrder($decodeToken, $data));
            }
            return;
        case 'upload-car-img':
            if($decodeToken = checkToken($token, true)){
                echo json_encode($repository->UploadCarImg($_FILES['CarImage']));
            } else {
                echo json_encode(array("message" => "В доступе отказано"));
            }
            return;
        default: 
            echo json_encode(array("message" => "Ключ запроса не найден"));
            return;
    }

} else {
    http_response_code(500);
    echo json_encode(array("message" => "Отсутствует ключ запроса."));
}

function checkToken($token, $checkAdmin = false) {
    try{
        if(!isset($_GET['token'])){
            http_response_code(401);
            echo json_encode(array("message" => "Вход не выполнен"));
            return false;
        }
        $data = $token->decode($_GET['token']);
        if($checkAdmin && (!isset($data->isAdmin) || !$data->isAdmin)){
            echo json_encode('В доступе отказано');
            return false;
        }
        return $data;
        
    } catch(Exception $e) {
        return false;
    }
}
?>