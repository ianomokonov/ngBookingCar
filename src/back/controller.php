<?php
//прием запросов с клиента
header("Access-Control-Allow-Origin: *"); 
header("Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token , Authorization");

include_once 'repository.php';
include_once './utils/token.php';

$repository = new BookingRepository();
// http://localhost/controller.php?key=get-cars&id=3&name=John
if(isset($_GET['key'])){
    switch($_GET['key']){
        case 'get-cars':
            echo json_encode($repository->GetCars($_GET['dateFrom'],$_GET['dateTo'],$_GET['priceFrom'],$_GET['priceTo']));
            return;
        case 'get-car-details':
            echo json_encode($repository->GetCarDetails($_GET['carId']));
            return;
        case 'add-order':
            if($decodeToken = checkToken()){
                $data = json_decode(file_get_contents("php://input"));
                echo json_encode($repository->AddOrder($decodeToken->userId, $data));
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
            if($decodeToken = checkToken()){
                $data = json_decode(file_get_contents("php://input"));
                echo json_encode($repository->GetHistory($decodeToken, $data));
            }
            return;
        case 'add-car':
            if($decodeToken = checkToken(true)){
                $data = json_decode(file_get_contents("php://input"));
                echo json_encode($repository->AddCar($decodeToken, $data));
            }
            return;
        case 'update-car':
            if($decodeToken = checkToken(true)){
                $data = json_decode(file_get_contents("php://input"));
                echo json_encode($repository->UpdateCar($decodeToken, $data));
            }
            return;
        case 'update-user-info':
            if($decodeToken = checkToken()){
                $data = json_decode(file_get_contents("php://input"));
                echo json_encode($repository->UpdateUserInfo($decodeToken, $data));
            }
            return;
        case 'update-order':
            if($decodeToken = checkToken()){
                $data = json_decode(file_get_contents("php://input"));
                echo json_encode($repository->UpdateOrder($decodeToken, $data));
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

function checkToken($checkAdmin) {
    try{
        $data = $token->decode($_GET['token']);
        if($checkAdmin && !$data->isAdmin){
            json_encode(array("message" => "В доступе отказано"));
            return false;
        }
        return $data;
        
    } catch(Exception $e) {
        return json_encode(array("message" => "В доступе отказано", "error" => $e->getMessage()));
    }
}
?>