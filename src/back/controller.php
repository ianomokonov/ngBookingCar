<?php
//прием запросов с клиента
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token , Authorization");

include_once 'repository.php';
include_once './utils/token.php';

$repository = new BookingRepository();
$token = new Token();
if (isset($_GET['key'])) {
    switch ($_GET['key']) {
        case 'check-admin':
            if ($decodeToken = checkToken($token, true)) {
                if ($decodeToken) {
                    echo json_encode($decodeToken->isAdmin == "1");
                } else {
                    echo json_encode($decodeToken);
                }
            }
            return;
        case 'get-cars':
            echo json_encode($repository->GetCars($_GET));
            return;
        case 'get-filters':
            echo json_encode($repository->GetFilters());
            return;
        case 'get-places':
            echo json_encode($repository->GetPlaces());
            return;
        case 'add-place':
            if ($decodeToken = checkToken($token, true)) {
                $data = json_decode(file_get_contents("php://input"));
                echo json_encode($repository->AddPlace($data));
            }
            return;
        case 'update-place':
            if ($decodeToken = checkToken($token, true)) {
                $data = json_decode(file_get_contents("php://input"));
                echo json_encode($repository->UpdatePlace($data));
            }
            return;
        case 'delete-place':
            if ($decodeToken = checkToken($token, true)) {
                echo json_encode($repository->DeletePlace($_GET['placeId']));
            }
            return;
        case 'get-places-of-interest':
            echo json_encode($repository->GetPlacesOfInterest());
            return;
        case 'add-place-of-interest':
            if ($decodeToken = checkToken($token, true)) {
                $data = json_decode(file_get_contents("php://input"));
                echo json_encode($repository->AddPlaceOfInterest($data));
            }
            return;
        case 'update-place-of-interest':
            if ($decodeToken = checkToken($token, true)) {
                $data = json_decode(file_get_contents("php://input"));
                echo json_encode($repository->UpdatePlaceOfInterest($data));
            }
            return;
        case 'delete-place-of-interest':
            if ($decodeToken = checkToken($token, true)) {
                $data = json_decode(file_get_contents("php://input"));
                echo json_encode($repository->DeletePlaceOfInterest($_GET['placeId'], $data->img));
            }
            return;
        case 'get-car':
            echo json_encode($repository->GetCarDetails($_GET['carId']));
            return;
        case 'get-feedbacks':
            echo json_encode($repository->GetFeedbacks());
            return;
        case 'add-feedback':
            $data = json_decode(file_get_contents("php://input"));
            echo json_encode($repository->AddFeedback($data));
            return;
        case 'remove-feedback':
            if ($decodeToken = checkToken($token, true)) {
                echo json_encode($repository->RemoveFeedback($_GET['id']));
            }
            return;
        case 'get-car-dates':
            echo json_encode($repository->GetCarDates($_GET['carId']));
            return;
        case 'get-price-range':
            echo json_encode($repository->GetPriceRange());
            return;
        case 'add-order':
            if ($decodeToken = checkToken($token)) {
                $data = json_decode(file_get_contents("php://input"));
                echo json_encode($repository->AddOrder($decodeToken->id, $data));
            } else {
                $data = json_decode(file_get_contents("php://input"));
                echo json_encode($repository->AddOrder(false, $data));
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
            if ($decodeToken = checkToken($token, true)) {
                echo json_encode($repository->GetHistory($decodeToken->id, true));
                return;
            }
            if ($decodeToken = checkToken($token)) {
                echo json_encode($repository->GetHistory($decodeToken->id, false));
            }
            return;
        case 'get-user-info':
            if ($decodeToken = checkToken($token)) {
                $data = json_decode(file_get_contents("php://input"));
                echo json_encode($repository->GetUserInfo($decodeToken->id));
                return;
            }
            return;
        case 'add-car':
            if ($decodeToken = checkToken($token, true)) {
                $data = json_decode(file_get_contents("php://input"));
                echo json_encode($repository->AddCar($data));
            }
            return;
        case 'update-car':
            if ($decodeToken = checkToken($token, true)) {
                $data = json_decode(file_get_contents("php://input"));
                echo json_encode($repository->UpdateCar($data));
            }
            return;
        case 'update-user-info':
            if ($decodeToken = checkToken($token)) {
                $data = json_decode(file_get_contents("php://input"));
                echo json_encode($repository->UpdateUserInfo($decodeToken->id, $data));
            }
            return;
        case 'update-order':
            if ($decodeToken = checkToken($token)) {
                $data = json_decode(file_get_contents("php://input"));
                echo json_encode($repository->UpdateOrder($data));
            }
            return;
        case 'cancel-order':
            if ($decodeToken = checkToken($token)) {
                echo json_encode($repository->CancelOrder($_GET['orderId']));
            }
            return;
        case 'upload-car-img':
            if ($decodeToken = checkToken($token, true)) {
                echo json_encode($repository->UploadCarImg($_FILES['CarImage']));
            } else {
                echo json_encode(array("message" => "В доступе отказано"));
            }
            return;
        case 'upload-place-img':
            if ($decodeToken = checkToken($token, true)) {
                echo json_encode($repository->UploadPlaceOfInterestImg($_FILES['PlaceImage']));
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

function checkToken($token, $checkAdmin = false)
{
    try {
        if (!isset($_GET['token'])) {
            return false;
        }
        $data = $token->decode($_GET['token']);
        if ($checkAdmin && (!isset($data->isAdmin) || !$data->isAdmin)) {
            return false;
        }
        return $data;
    } catch (Exception $e) {
        return false;
    }
}
