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
        private $baseUrl = 'https://car4crete.com/back';

        public function __construct()
        {
            $this->database = new DataBase();
            $this->token = new Token();
            $this->filesUpload = new FilesUpload();
        }

        public function GetCars($query){
            unset($query['key']);
            unset($query['token']);
            
            $queryText = "SELECT * FROM car ";
            $hasCondition = false;
            if(isset($query['dateFrom']) && isset($query['dateTo']) && !!($dateFrom = $query['dateFrom']) && $dateTo = $query['dateTo']){
                unset($query['dateFrom']);
                unset($query['dateTo']);
                $queryText = $queryText."WHERE 0 = (SELECT COUNT(*) FROM carOrder co WHERE co.carId = car.id AND co.status IN (1,2) AND (co.dateFrom = '$dateFrom' OR co.dateFrom = '$dateTo' OR co.dateTo = '$dateTo' OR (co.dateFrom > '$dateFrom' AND co.dateTo < '$dateTo') OR (co.dateFrom < '$dateFrom' AND co.dateTo > '$dateTo') OR (co.dateFrom > '$dateFrom' AND co.dateFrom < '$dateTo' AND (co.dateTo IS NULL OR co.dateTo > '$dateTo')) OR (co.dateTo > '$dateFrom' AND co.dateTo < '$dateTo' AND co.dateFrom < '$dateFrom'))) ";
            
                $hasCondition = true;
            }
            if(!isset($query['dateTo']) && isset($query['dateFrom']) && $dateFrom = $query['dateFrom']){
                unset($query['dateFrom']);
                $queryText = $queryText."WHERE 0 = (SELECT COUNT(*) FROM carOrder co WHERE co.carId = car.id AND co.status IN (1,2) AND (co.dateFrom = '$dateFrom' OR co.dateTo = '$dateFrom' OR (co.dateFrom < '$dateFrom' AND co.dateTo > '$dateFrom'))) ";
            
                $hasCondition = true;
            }
            if(count(array_keys($query))>0){
                if( $hasCondition){
                     $queryText = $queryText."AND ";
                } else {
                    $queryText = $queryText."WHERE ";
                   
                }
                foreach(array_keys($query) as $key){
                    $values = explode(',', $query[$key]);
                    $value = '';
                    if(count($values) > 1){
                        $value = "'".implode("','", $values)."'";
                    } else {
                        $value = "'".$values[0]."'";
                    }
                    $queryText = $queryText."$key IN ($value) AND ";
                }
            }
            $queryText = rtrim($queryText,'AND ');
            $queryText = $queryText." ORDER BY summerPrice ASC ";
            //return $queryText;
            $query = $this->database->db->query($queryText);
            $query->setFetchMode(PDO::FETCH_CLASS, 'Car');
            $cars = array();
            while ($car = $query->fetch()) {
                $car->description = array('en' => $car->description_eng, 'ru' => $car->description, 'de' => $car->description_de);
                $car->ac = $car->ac == '1';
                $car->abs = $car->abs == '1';
                $car->airBags = $car->airBags == '1';
                $car->summerPrices = $this->getPrices($car->id, false);
                $car->winterPrices = $this->getPrices($car->id, true);
                $cars[] = $car;
            }
            return $cars;
            
        }
        
        public function GetFilters(){
            
            $filters = array(
                 array('name' => 'BODY_TYPE', 'prop' => 'bodyType', 'options'=> $this->GetFilterOptions('bodyType')),
                 array('name' => 'PLACES_COUNT', 'prop' => 'places', 'options'=> $this->GetFilterOptions('places')),
                 array('name' => 'TRANSMISSION', 'prop' => 'kpp', 'options'=> $this->GetFilterOptions('kpp')),
                 array('name' => 'FUEL_TYPE', 'prop' => 'fuelType', 'options'=> $this->GetFilterOptions('fuelType'))
                );
            return $filters;
            
        }
        
        public function GetFilterOptions($name){
            $query = $this->database->db->query("SELECT DISTINCT $name FROM car");
            
             $options = array();
            while ($option = $query->fetch()) {
                
                $options[] = array('name' => $option[$name]);
            }
            
            return $options;
            
        }
        
        public function GetPlaces(){
            $query = $this->database->db->query("SELECT * FROM place");
            $query->setFetchMode(PDO::FETCH_CLASS, 'Place');
            $places = array();
            while ($place = $query->fetch()) {
                $place->name = array('en' => $place->name_eng, 'ru' => $place->name, 'de' => $place->name_de);
                
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

        public function AddFeedback($feedback){
            if(!isset($feedback->userName) || !$feedback->message){
                return array("message" => "Укажите фио и отзыв", "method" => "AddFeedback", "requestData" => $feedback);
            }
            $insert = $this->database->genInsertQuery((array)$feedback, 'feedback');
            $query = $this->database->db->prepare($insert[0]);
            if($insert[1][0]!=null){
                $query->execute($insert[1]);
            }
            return $this->database->db->lastInsertId()*1;
        }

        public function GetFeedbacks(){
            $text = "SELECT * from feedback ORDER BY date DESC";
            $query = $this->database->db->query($text);
            $query->setFetchMode(PDO::FETCH_CLASS, 'Feedback');
            $feedbacks = [];
            while ($feedback = $query->fetch()) {
                $feedback->car = $this->GetCarDetails($feedback->carId);
                $feedback->date = date("Y/m/d H:00:00",strtotime($feedback->date));
                
                $feedbacks[] = $feedback;
            }
            return $feedbacks;
        }

        public function RemoveFeedback($id){
            $query = $this->database->db->prepare("DELETE FROM feedback WHERE id = ?");
            $query->execute(array($id));
            return array('message' => 'Отзыв удален');
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
        
        public function GetPlacesOfInterest(){
            $query = $this->database->db->query("SELECT * FROM placeOfInterest");
            $query->setFetchMode(PDO::FETCH_CLASS, 'PlaceOfInterest');
            $places = array();
            while ($place = $query->fetch()) {
                $place->name = array('en' => $place->name_eng, 'ru' => $place->name, 'de' => $place->name_de);
                $place->description = array('en' => $place->description_eng, 'ru' => $place->description, 'de' => $place->description_de);
                $place->road = array('en' => $place->road_eng, 'ru' => $place->road, 'de' => $place->road_de);
                
                $places[] = $place;
            }
            return $places;
            
        }

        public function AddPlaceOfInterest($place){
            if(!isset($place->name) || !$place->name){
                return array("message" => "Укажите название места сдачи", "method" => "AddPlace", "requestData" => $place);
            }
            $insert = $this->database->genInsertQuery((array)$place, 'placeOfInterest');
            $query = $this->database->db->prepare($insert[0]);
            if($insert[1][0]!=null){
                $query->execute($insert[1]);
            }
            return $this->database->db->lastInsertId();
        }

        public function UpdatePlaceOfInterest($place){
            if(!isset($place->id) || !$place->id){
                return array("message" => "Укажите id места сдачи", "method" => "UpdatePlace", "requestData" => $place);
            }
            if(!isset($place->name) || !$place->name){
                return array("message" => "Укажите название места сдачи", "method" => "UpdatePlace", "requestData" => $place);
            }

            $placeId = $place->id;
            unset($place->id);
            if($place->oldImg && $place->img != $place->oldImg){
                $this->removeFile($place->oldImg);
            }
            unset($place->oldImg);
            $a = $this->database->genUpdateQuery(array_keys((array)$place), array_values((array)$place), "placeOfInterest", $placeId);
            $query = $this->database->db->prepare($a[0]);
            $query->execute($a[1]);
            return array('message' => 'Место обновлено');
        }

        public function DeletePlaceOfInterest($placeId, $img){
            $query = $this->database->db->prepare("DELETE FROM placeOfInterest WHERE id = ?");
            $this->removeFile($img);
            $query->execute(array($placeId));
            return array('message' => 'Место удалено');
        }

        public function UploadPlaceOfInterestImg($file){
            $newFileName = $this->filesUpload->upload($file, 'PlaceImages', uniqid());
            return $this->baseUrl.'/PlaceImages'.'/'.$newFileName;
        }

        public function GetSlides(){
            $query = $this->database->db->query("SELECT * FROM MainSlide");
            $query->setFetchMode(PDO::FETCH_ASSOC);
            $places = array();
            while ($place = $query->fetch()) {
                $place['title'] = array('en' => $place['title_eng'], 'ru' => $place['title'], 'de' => $place['title_de']);
                $place['description'] = array('en' => $place['description_eng'], 'ru' => $place['description'], 'de' => $place['description_de']);
                
                $places[] = $place;
            }
            return $places;
            
        }

        public function AddSlide($slide){
            if(!isset($slide->title) || !$slide->title){
                return array("message" => "Укажите заголовок слайда", "method" => "AddSlide", "requestData" => $slide);
            }
            $insert = $this->database->genInsertQuery((array)$slide, 'MainSlide');
            $query = $this->database->db->prepare($insert[0]);
            if($insert[1][0]!=null){
                $query->execute($insert[1]);
            }
            return $this->database->db->lastInsertId();
        }

        public function UpdateSlide($slide){
            if(!isset($slide->id) || !$slide->id){
                return array("message" => "Укажите id слайда", "method" => "UpdateSlide", "requestData" => $slide);
            }
            if(!isset($slide->title) || !$slide->title){
                return array("message" => "Укажите заголовок слайда", "method" => "UpdateSlide", "requestData" => $slide);
            }

            $slideId = $slide->id;
            unset($slide->id);
            if($slide->oldImg && $slide->img != $slide->oldImg){
                $this->removeFile($slide->oldImg);
            }
            unset($slide->oldImg);
            $a = $this->database->genUpdateQuery(array_keys((array)$slide), array_values((array)$slide), "MainSlide", $slideId);
            $query = $this->database->db->prepare($a[0]);
            $query->execute($a[1]);
            return array('message' => 'Слайд изменен');
        }

        public function DeleteSlide($slideId, $img){
            $query = $this->database->db->prepare("DELETE FROM MainSlide WHERE id = ?");
            $this->removeFile($img);
            $query->execute(array($slideId));
            return array('message' => 'Слайд удален');
        }

        public function UploadSlideImg($file){
            $newFileName = $this->filesUpload->upload($file, 'SlideImages', uniqid());
            return $this->baseUrl.'/SlideImages'.'/'.$newFileName;
        }

        public function GetCarDetails($carId){
            if($carId == null){
                return array("message" => "Введите id автомобиля", "method" => "GetCarDetails", "requestData" => $carId);
            }

            $query = $this->database->db->prepare("SELECT * from car WHERE id = ?");
            $query->execute(array($carId));
            $query->setFetchMode(PDO::FETCH_CLASS, 'Car');
            $car = $query->fetch();
            $car->description = array('en' => $car->description_eng, 'ru' => $car->description, 'de' => $car->description_de);
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
            $range['min'] = $range['min']*1;
            $range['max'] = $range['max']*1;
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
                $order->isCarFree = $order->isCarFree*1;
                $orders[] = $order;
            }
            return $orders;
            
        }

        public function AddOrder($userId, $order, $lang){
            if($order == null){
                return array("message" => "Заказ пуст", "method" => "AddOrder", "requestData" => array("userId" => $userId, "order" => $order));
            }
            $user = $order->user;
            $car = $order->car;
            unset($order->user);
            unset($order->car);
            if(!$userId){
                $id = $this->CreateUser($user);
                if(!$id){
                     return array("message" => "Не удалось создать пользователя", "method" => "AddOrder", "requestData" => array("userId" => $userId, "order" => $order));
                }
                $userId = $id;
            }
            $order->userId = $userId;
            $insert = $this->database->genInsertQuery((array)$order, 'carOrder');
            $query = $this->database->db->prepare($insert[0]);
            if($insert[1][0]!=null){
                $query->execute($insert[1]);
            }
            
            $order->placeFrom = $this->GetPlace($order->placeFromId);
            $order->placeTo = $this->GetPlace($order->placeToId);
            $subject = "";
            $message = '';
            if($lang == 'ru'){
                $subject = "Бронирование автомобиля";
                $message = "<h2>Вы успешно забронировали автомобиль на сайте <a href='http://car4crete.com/'>www.car4crete.com</a>!</h2>
                </br> <p>Наш менеджер свяжется с вами для подтверждения наличия автомобиля. Бронь вы можете просмотреть в личном кабинете на сайте. Там же есть возможность изменить бронь за неделю до начала аренды или отменить её за три дня до начала аренды.</p></br>
                <p></br></br><h3>Детали бронирования:</h3></p> </br>
                <p>Автомобиль: ".$car->name."</p></br>
                <p>Дата начала аренды: ".date("d.m.Y",strtotime($order->dateFrom))." ".$order->timeFrom." (".$order->placeFrom->name.")</p></br>
                <p>Дата конца аренды: ".date("d.m.Y",strtotime($order->dateTo))." ".$order->timeTo." (".$order->placeTo->name.")</p></br>
                <p></br>Сумма заказа: ".$order->orderSum."€</p></br>";
            } else {
                $subject = "Car reservation";
                $message = "<h2>You have successfully booked a car on <a href='http://car4crete.com/'>www.car4crete.com</a>!</h2>
                </br> <p>Our manager will contact you to confirm the presence of the car. You can view the reservation in your personal office on the site. There is also an opportunity to change the reservation a week before the start of the lease or to cancel it three days before the start of the lease.</p></br>
                <p></br></br><h3>Booking details:</h3></p> </br>
                <p>Car: ".$car->name."</p></br>
                <p>Lease start date: ".date("d.m.Y",strtotime($order->dateFrom))." ".$order->timeFrom." (".$order->placeFrom->name_eng.")</p></br>
                <p>Lease end date: ".date("d.m.Y",strtotime($order->dateTo))." ".$order->timeTo." (".$order->placeTo->name_eng.")</p></br>
                <p></br>Order value: ".$order->orderSum."€</p></br>";
            }   
            
            
            $headers  = "Content-type: text/html; charset=utf-8 \r\nFrom: info@car4crete.com\r\n";
            
            mail($user->email, $subject, $message, $headers);
            $this->SendOrderToAdmin($car, $order, $user);
            return $this->database->db->lastInsertId();
            
        }

        public function SendOrderToAdmin($car, $order, $user){
            if($order == null){
                return array("message" => "Заказ пуст", "method" => "AddOrder", "requestData" => array("order" => $order));
            }
            $subject = "Новое бронирование автомобиля";
                $message = "<p></br></br><h3>Детали бронирования:</h3></p> </br>
                <p>Клиент: ".$user->surname." ".$user->name." ".$user->middlename."</p></br>
                <p>Email: ".$user->email."</p></br>
                <p>Телефон: ".($user->phone ? $user->phone : 'Не указан')."</p></br></br>
                <p>Автомобиль: ".$car->name."</p></br>
                <p>Дата начала аренды: ".date("d.m.Y",strtotime($order->dateFrom))." ".$order->timeFrom." (".$order->placeFrom->name.")</p></br>
                <p>Дата конца аренды: ".date("d.m.Y",strtotime($order->dateTo))." ".$order->timeTo." (".$order->placeTo->name.")</p></br>
                <p></br>Сумма заказа: ".$order->orderSum."€</p></br>"; 
            
            
            $headers  = "Content-type: text/html; charset=utf-8 \r\nFrom: info@car4crete.com\r\n";
            
            mail('info@carcrete24.com', $subject, $message, $headers);
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

        public function SignUp($user = null, $lang = 'en'){
            if($user != null){
                try{
                    if($this->EmailExists($user->email)){
                        return false;
                    }
                    $p = $user->password;
                    $e = $user->email;
                    $user->password = password_hash($user->password, PASSWORD_BCRYPT);
                    $insert = $this->database->genInsertQuery((array)$user, 'user');
                    $query = $this->database->db->prepare($insert[0]);
                    if ($insert[1][0]!=null) {
                        $query->execute($insert[1]);
                    }
                    $subject = "";
                    $message = "";
                    
                    if($lang == 'ru'){
                        $subject = "Регистрация на портале";
                        $message = "<h2>Вы зарегистрированы на сайте <a href='http://car4crete.com/'>www.car4crete.com</a>!</h2>
                        </br> <p><b>Ваш логин: </b>".$user->email."<b></br></p><p>Ваш пароль: </b>$p</br></p></br>
                        <p>В личном кабинете вы можете просмотреть, изменить и отменить текущие заявки на бронирование автомобилей.</p> </br>";
                    } else {
                        $subject = "Registration on the website";
                        $message = "<h2>You are registered on the site <a href='http://car4crete.com/'>www.car4crete.com</a>!</h2>
                        </br> <p><b>Your login: </b>".$user->email."<b></br></p><p>Your password: </b>$p</br></p></br>
                        <p>In your personal account you can view, change and cancel the current application for booking cars.</p> </br>";
                    }
                    
                     
                
                    
                    
                    $headers  = "Content-type: text/html; charset=utf-8 \r\n";
                    
                    mail($e, $subject, $message, $headers);
                    
                    return $this->token->encode(array("id" => $this->database->db->lastInsertId()));
                } catch(Exception $e) {
                    return false;
                }
                
            } else {
                return false;
            }
        }
        
        private function CreateUser($user = null){
            if($user != null){
                try{
                    if($userId = $this->EmailExists($user->email)){
                        return $userId;
                    }
                    $user->password = $this->genPassword();
                    return $this->token->decode($this->SignUp($user))->id;
                } catch(Exception $e) {
                    return false;
                }
                
            } else {
                return false;
            }
        }
        
        private function genPassword(){
            // Символы, которые будут использоваться в пароле.

            $chars="qazxswedcvfrtgbnhyujmkiolp1234567890QAZXSWEDCVFRTGBNHYUJMKIOLP";
            
            // Количество символов в пароле.
            
            $max=10;
            
            // Определяем количество символов в $chars
            
            $size=StrLen($chars)-1;
            
            // Определяем пустую переменную, в которую и будем записывать символы.
            
            $password=null;
            
            // Создаём пароль.
            
            while($max--){
                $password.=$chars[rand(0,$size)];
            }
            
            return $password;
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
            
            $prices->Id = $carId;
            $q = $this->database->genInsertQuery((array)$prices,$table);
            
            $s = $this->database->db->prepare($q[0]);
            if ($q[1][0]!=null) {
                $s->execute($q[1]);
            }
        }

        private function EmailExists(string $email){
            $query = "SELECT id FROM user WHERE email = ?";
 
            // подготовка запроса 
            $stmt = $this->database->db->prepare( $query );
            // инъекция 
            $email=htmlspecialchars(strip_tags($email));
            // выполняем запрос 
            $stmt->execute(array($email));
        
            // получаем количество строк 
            $num = $stmt->rowCount();
            
            if($num > 0){
                return $stmt->fetch()['id'];
            }

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
