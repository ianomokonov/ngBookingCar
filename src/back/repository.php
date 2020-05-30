<?php
    //обработка запросов
    include_once './utils/token.php';
    include_once './utils/database.php';
    include_once './utils/filesUpload.php';
    include_once 'models.php';
    class BookingRepository{
        private $database;
        private $token;
        private $filesUpload;
        private $baseUrl = 'http://client.nomokoiw.beget.tech/booking';

        public function __construct()
        {
            $this->database = new DataBase();
            $this->token = new Token();
            $this->filesUpload = new FilesUpload();
        }

        public function GetCars($query){
            
            $queryText = "SELECT * FROM car ";
            if(isset($query['priceFrom']) && $priceFrom = $query['priceFrom']){
                $queryText = $queryText."WHERE price >= $priceFrom ";
            }
            if(isset($query['priceTo']) && $priceTo = $query['priceTo']){
                if(isset($priceFrom)) {
                    $queryText = $queryText."AND ";
                } else {
                    $queryText = $queryText."WHERE ";
                }
                $queryText = $queryText."price <= $priceTo ";
            }
            if(isset($query['dateFrom']) && isset($query['dateTo']) && !!($dateFrom = $query['dateFrom']) && $dateTo = $query['dateTo']){
                if(isset($priceFrom) || isset($priceTo)) {
                    $queryText = $queryText."AND ";
                } else {
                    $queryText = $queryText."WHERE ";
                }
                $queryText = $queryText."0 = (SELECT COUNT(*) FROM carOrder co WHERE co.carId = car.id AND co.status IN (1,2) AND (co.dateFrom = '$dateFrom' OR co.dateFrom = '$dateTo' OR co.dateTo = '$dateTo' OR (co.dateFrom > '$dateFrom' AND co.dateTo < '$dateTo') OR (co.dateFrom < '$dateFrom' AND co.dateTo > '$dateTo') OR (co.dateFrom > '$dateFrom' AND co.dateFrom < '$dateTo' AND (co.dateTo IS NULL OR co.dateTo > '$dateTo')) OR (co.dateTo > '$dateFrom' AND co.dateTo < '$dateTo' AND co.dateFrom < '$dateFrom'))) ";
            }
            if(!isset($query['dateTo']) && isset($query['dateFrom']) && $dateFrom = $query['dateFrom']){
                if(isset($priceFrom) || isset($priceTo)) {
                    $queryText = $queryText."AND ";
                } else {
                    $queryText = $queryText."WHERE ";
                }
                $queryText = $queryText."0 = (SELECT COUNT(*) FROM carOrder co WHERE co.carId = car.id AND co.status IN (1,2) AND (co.dateFrom = '$dateFrom' OR co.dateTo = '$dateFrom' OR (co.dateFrom < '$dateFrom' AND co.dateTo > '$dateFrom'))) ";
            }
            $queryText = $queryText."ORDER BY price ASC ";
            if(isset($query['limit']) && $limit = $query['limit']){
                $queryText = $queryText."LIMIT $limit";
            }
            //return $queryText;
            $query = $this->database->db->query($queryText);
            $query->setFetchMode(PDO::FETCH_CLASS, 'Car');
            $cars = array();
            while ($car = $query->fetch()) {
                $car->description = array('en' => $car->description_eng, 'ru' => $car->description);
                $car->ac = $car->ac == '1';
                $car->abs = $car->abs == '1';
                $car->airBags = $car->airBags == '1';
                $car->summerPrices = $this->getPrices($car->id, false);
                $car->winterPrices = $this->getPrices($car->id, true);
                $cars[] = $car;
            }
            return $cars;
            
        }

        public function GetPlaces(){
            $query = $this->database->db->query("SELECT * FROM place");
            $query->setFetchMode(PDO::FETCH_CLASS, 'Place');
            $places = array();
            while ($place = $query->fetch()) {
                $place->name = array('en' => $place->name_eng, 'ru' => $place->name);
                
                $places[] = $place;
            }
            return $places;
            
        }

        public function AddPlace($place){
            if(!isset($place->name) || !$place->name){
                return array("message" => "Укажите название места сдачи", "method" => "AddPlace", "requestData" => $place);
            }
            $insert = $this->database->genInsertQuery((array)$place, 'place');
            $query = $this->database->db->prepare($insert[0]);
            if($insert[1][0]!=null){
                $query->execute($insert[1]);
            }
            return $this->database->db->lastInsertId();
        }

        public function UpdatePlace($place){
            if(!isset($place->id) || !$place->id){
                return array("message" => "Укажите id места сдачи", "method" => "UpdatePlace", "requestData" => $place);
            }
            if(!isset($place->name) || !$place->name){
                return array("message" => "Укажите название места сдачи", "method" => "UpdatePlace", "requestData" => $place);
            }

            $placeId = $place->id;
            unset($place->id);
            $a = $this->database->genUpdateQuery(array_keys((array)$place), array_values((array)$place), "place", $placeId);
            $query = $this->database->db->prepare($a[0]);
            $query->execute($a[1]);
            return array('message' => 'Место обновлено');
        }

        public function DeletePlace($placeId){
            $query = $this->database->db->prepare("DELETE FROM place WHERE id = ?");
            $query->execute(array($placeId));
            return array('message' => 'Место удалено');
        }

        public function UploadCarImg($file){
            $newFileName = $this->filesUpload->upload($file, 'Files', uniqid());
            return $this->baseUrl.'/Files'.'/'.$newFileName;
        }

        public function GetCarDetails($carId){
            if($carId == null){
                return array("message" => "Введите id автомобиля", "method" => "GetCarDetails", "requestData" => $carId);
            }

            $query = $this->database->db->prepare("SELECT * from car WHERE id = ?");
            $query->execute(array($carId));
            $query->setFetchMode(PDO::FETCH_CLASS, 'Car');
            $car = $query->fetch();
            $car->description = array('en' => $car->description_eng, 'ru' => $car->description);
            $car->ac = $car->ac == '1';
            $car->abs = $car->abs == '1';
            $car->airBags = $car->airBags == '1';
            $car->summerPrices = $this->getPrices($carId, false);
            $car->winterPrices = $this->getPrices($carId, true);
            return $car;
            
        }
        
        public function getPrices($id, $t) {
            if($t){
                 $s = $this->database->db->prepare("SELECT * FROM winter_prices WHERE Id=?");
                $s->execute(array($id));
                $s->setFetchMode(PDO::FETCH_CLASS, 'Prices');
                return $s->fetch();
            }else{
                 $s = $this->database->db->prepare("SELECT * FROM summer_prices WHERE Id=?");
                $s->execute(array($id));
                $s->setFetchMode(PDO::FETCH_CLASS, 'Prices');
                return $s->fetch();
            }
           
        }

        public function GetPlace($id){
            if($id == null){
                return array("message" => "Введите id места", "method" => "GetPlace", "requestData" => $id);
            }

            $query = $this->database->db->prepare("SELECT * from place WHERE id = ?");
            $query->execute(array($id));
            $query->setFetchMode(PDO::FETCH_CLASS, 'Place');
            
            return $query->fetch();
            
        }

        public function GetCarDates($carId, $orderId = null){
            if($carId == null){
                return array("message" => "Введите id автомобиля", "method" => "GetCarDates", "requestData" => $carId);
            }

            $str = "SELECT id, dateFrom, dateTo from carOrder WHERE dateFrom > now() AND carId = ? AND status IN (1,2)";
            if($orderId){
                $str = $str." AND id != $orderId";
            }

            $query = $this->database->db->prepare($str);
            $query->execute(array($carId));
            $query->setFetchMode(PDO::FETCH_CLASS, 'DateRange');
            return $query->fetchAll();
            
        }
        
        public function GetPriceRange(){

            $str = "SELECT max(price) as max, min(price) as min from car";

            $query = $this->database->db->query($str);
            $query->setFetchMode(PDO::FETCH_CLASS, 'PriceRange');
            $range = $query->fetch();
            $range->min = $range->min*1;
            $range->max = $range->max*1;
            return $range;
            
        }

        public function GetHistory($userId, $isAdmin){
            if($userId == null){
                return array("message" => "Введите id пользователя", "method" => "GetHistory", "requestData" => $userId);
            }
            $text = "SELECT * from carOrder WHERE userId = ? ORDER BY status ASC, dateFrom ASC";
            if($isAdmin){
                $text = "SELECT * from carOrder ORDER BY status ASC, dateFrom ASC";
            }
            $query = $this->database->db->prepare($text);
            $query->execute(array($userId));
            $query->setFetchMode(PDO::FETCH_CLASS, 'Order');
            $orders = [];
            while ($order = $query->fetch()) {
                $order->car = $this->GetCarDetails($order->carId);
                $order->car->dates = $this->GetCarDates($order->carId, $order->id);
                $order->place = $this->GetPlace($order->placeId);
                if($isAdmin){
                    $order->user = $this->getUserInfo($order->userId);
                }
                unset($order->userId);
                $orders[] = $order;
            }
            return $orders;
            
        }

        public function AddOrder($userId, $order){
            if($userId == null){
                return array("message" => "Вы не вошли", "method" => "AddOrder", "requestData" => array("userId" => $userId, "order" => $order));
            }
            if($order == null){
                return array("message" => "Заказ пуст", "method" => "AddOrder", "requestData" => array("userId" => $userId, "order" => $order));
            }
            $order->userId = $userId;
            $insert = $this->database->genInsertQuery((array)$order, 'carOrder');
            $query = $this->database->db->prepare($insert[0]);
            if($insert[1][0]!=null){
                $query->execute($insert[1]);
            }

            return $this->database->db->lastInsertId();
            
        }

        public function UpdateOrder($order){
            if(!$order || !isset($order->id) || !$order->id){
                return array("message" => "Укажите id заказа", "method" => "UpdateOrder", "requestData" => $order);
            }

            $orderId = $order->id;
            unset($order->id);
            $a = $this->database->genUpdateQuery(array_keys((array)$order), array_values((array)$order), "carOrder", $orderId);
            $query = $this->database->db->prepare($a[0]);
            $query->execute($a[1]);
            return array('message' => 'Заказ обновлен');
        }

        public function CancelOrder($orderId){
            if(!$orderId){
                return array("message" => "Укажите id заказа", "method" => "CancelOrder", "requestData" => $orderId);
            }
            $query = $this->database->db->prepare("UPDATE carOrder SET status=4 WHERE id=?");
            $query->execute(array($orderId));
            return array('message' => 'Заказ отменен');
        }

        public function SignIn($user = null){
            if($user != null){
                $sth = $this->database->db->prepare("SELECT id, password, isAdmin FROM user WHERE email = ? LIMIT 1");
                $sth->setFetchMode(PDO::FETCH_CLASS, 'User');
                $sth->execute(array($user->email));
                $fullUser = $sth->fetch();
                
                if($fullUser){
                    if(!password_verify($user->password, $fullUser->password)){
                        return false;
                    }
                    return $this->token->encode(array("id" => $fullUser->id, "isAdmin" => $fullUser->isAdmin));
                } else {
                    return false;
                }
                
            } else {
                return array("message" => "Введите данные для регистрации");
            }
        }

        public function getUserInfo($userId){
            $sth = $this->database->db->prepare("SELECT name, surname, middlename, phone, email FROM user WHERE id = ? LIMIT 1");
            $sth->setFetchMode(PDO::FETCH_CLASS, 'User');
            $sth->execute(array($userId));
            return $sth->fetch();
        }

        public function UpdateUserInfo($userId, $user){
            if(!$userId){
                return array("message" => "Укажите id пользователя", "method" => "UpdateUserInfo", "requestData" => array($userId, $user));
            }
            if(!$user){
                return array("message" => "Укажите данные", "method" => "UpdateUserInfo", "requestData" => $user);
            }
            $a = $this->database->genUpdateQuery(array_keys((array)$user), array_values((array)$user), "user", $userId);
            $query = $this->database->db->prepare($a[0]);
            $query->execute($a[1]);
            return array('message' => 'Пользователь обновлен');
        }

        public function SignUp($user = null){
            if($user != null){
                try{
                    if($this->EmailExists($user->email)){
                        return false;
                    }
                    $user->password = password_hash($user->password, PASSWORD_BCRYPT);
                    $insert = $this->database->genInsertQuery((array)$user, 'user');
                    $query = $this->database->db->prepare($insert[0]);
                    if ($insert[1][0]!=null) {
                        $query->execute($insert[1]);
                    }
                    return $this->token->encode(array("id" => $this->database->db->lastInsertId()));
                } catch(Exception $e) {
                    return false;
                }
                
            } else {
                return false;
            }
        }

        public function AddCar($car = null){
            if($car != null){
                try{
                    $wPrices = $car->winterPrices;
                    $sPrices = $car->summerPrices;
                    unset($car->winterPrices);
                    unset($car->summerPrices);
                    $insert = $this->database->genInsertQuery((array)$car, 'car');
                    $query = $this->database->db->prepare($insert[0]);
                    if ($insert[1][0]!=null) {
                        $query->execute($insert[1]);
                    }
                    $carId = $this->database->db->lastInsertId();
                    $this->addPrices($carId, $wPrices, 'winter_prices');
                    $this->addPrices($carId, $sPrices, 'summer_prices');
                    return $carId;
                } catch(Exception $e) {
                    return array("message" => "Ошибка добавления автомобиля", "error" => $e->getMessage());
                }
                
            } else {
                return array("message" => "Введите данные автомобиля");
            }
        }
        
        private function addPrices($carId, $prices, $table){
            $prices['Id'] = $carId; 
            $q = $this->genInsertQuery((array)$prices,$table);
            $s = $this->db->prepare($q[0]);
            if ($q[1][0]!=null) {
                $s->execute($q[1]);
            }
        }

        private function EmailExists(string $email){
            $query = "SELECT id, email FROM user WHERE email = ?";
 
            // подготовка запроса 
            $stmt = $this->database->db->prepare( $query );
            // инъекция 
            $email=htmlspecialchars(strip_tags($email));
            // выполняем запрос 
            $stmt->execute(array($email));
        
            // получаем количество строк 
            $num = $stmt->rowCount();

            return $num > 0;
        }

        public function UpdateCar($car){
            if($car == null || !isset($car->id)){
                return array("message" => "Укажите id автомобиля", "method" => "UpdateCar", "requestData" => $car);
            }

            $carId = $car->id;
            unset($car->id);
            $wPrices = $car->winterPrices;
            $sPrices = $car->summerPrices;
            unset($car->winterPrices);
            unset($car->summerPrices);
            if($car->oldImg && $car->img != $car->oldImg){
                $this->removeFile($car->oldImg);
            }
            unset($car->oldImg);
            $a = $this->database->genUpdateQuery(array_keys((array)$car), array_values((array)$car), "car", $carId);
            
            $query = $this->database->db->prepare($a[0]);
            $query->execute($a[1]);
               
            $this->updatePrices($carId, $wPrices, 'winter_prices');
            $this->updatePrices($carId, $sPrices, 'summer_prices');
            return array('message' => 'Автомобиль обновлен');
        }
        
        public function updatePrices($id, $prices, $table){
            $a=$this->database->genUpdateQuery(array_keys((array)$prices), array_values((array)$prices), $table, $id);
            $s = $this->database->db->prepare($a[0]);
            $s->execute($a[1]);
        }

        private function removeFile($filelink){
            $path = explode($this->baseUrl.'/', $filelink);
            if($path[1] && file_exists($path[1])){
                unlink($path[1]);
            }
        }

    }
?>