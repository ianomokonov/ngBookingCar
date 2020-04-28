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
        private $baseUrl = 'http://localhost/booking';

        public function __construct()
        {
            $this->database = new DataBase();
            $this->token = new Token();
            $this->filesUpload = new FilesUpload();
        }

        public function GetCars($dateFrom, $dateTo, $priceFrom, $priceTo){
            $queryText = "SELECT * FROM car ";
            if($priceFrom){
                $queryText = $queryText."WHERE price > $priceFrom ";
            }
            if($priceTo){
                if($priceFrom) {
                    $queryText = $queryText."AND ";
                } else {
                    $queryText = $queryText."WHERE ";
                }
                $queryText = $queryText."price < $priceTo";
            }
            $query = $this->database->db->query($queryText);
            $query->setFetchMode(PDO::FETCH_CLASS, 'Car');
            
            return $query->fetchAll();
            
        }

        public function GetPlaces(){
            $query = $this->database->db->query("SELECT * FROM place");
            $query->setFetchMode(PDO::FETCH_CLASS, 'Place');
            return $query->fetchAll();
            
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
            $newFileName = $this->filesUpload->upload($file, __DIR__.'\Files', uniqid());
            return $this->baseUrl.'/Files'.'/'.$newFileName;
        }

        public function GetCarDetails($carId){
            if($carId == null){
                return array("message" => "Введите id автомобиля", "method" => "GetCarDetails", "requestData" => $carId);
            }

            $query = $this->database->db->prepare("SELECT * from car WHERE id = ?");
            $query->execute(array($carId));
            $query->setFetchMode(PDO::FETCH_CLASS, 'Car');
            
            return $query->fetch();
            
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

        public function GetHistory($userId){
            if($userId == null){
                return array("message" => "Введите id пользователя", "method" => "GetHistory", "requestData" => $userId);
            }

            $query = $this->database->db->prepare("SELECT * from carorder WHERE userId = ?");
            $query->execute(array($userId));
            $query->setFetchMode(PDO::FETCH_CLASS, 'Order');
            $orders = [];
            while ($order = $query->fetch()) {
                $order->car = $this->GetCarDetails($order->carId);
                $order->place = $this->GetPlace($order->placeId);
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
            $insert = $this->database->genInsertQuery((array)$order, 'carorder');
            $query = $this->database->db->prepare($insert[0]);
            if($insert[1][0]!=null){
                $query->execute($insert[1]);
            }

            return $this->database->db->lastInsertId();
            
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
                    $insert = $this->database->genInsertQuery((array)$car, 'car');
                    $query = $this->database->db->prepare($insert[0]);
                    if ($insert[1][0]!=null) {
                        $query->execute($insert[1]);
                    }
                    return $this->database->db->lastInsertId();
                } catch(Exception $e) {
                    return array("message" => "Ошибка добавления автомобиля", "error" => $e->getMessage());
                }
                
            } else {
                return array("message" => "Введите данные автомобиля");
            }
        }

        private function GetUserById(int $id){
            if($id){
                $sth = $this->database->db->prepare("SELECT * FROM user WHERE id = ?");
                $sth->setFetchMode(PDO::FETCH_CLASS, 'User');
                $sth->execute(array($id));
                return $sth->fetch();
            } else {
                return array("message" => "GetUserById -> id не может быть пустым");
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
            if($car->oldImg && $car->img != $car->oldImg){
                $this->removeFile($car->oldImg);
            }
            unset($car->oldImg);
            $a = $this->database->genUpdateQuery(array_keys((array)$car), array_values((array)$car), "car", $carId);
            $query = $this->database->db->prepare($a[0]);
            $query->execute($a[1]);
            return array('message' => 'Автомобиль обновлен');
        }

        private function removeFile($filelink){
            $path = explode($this->baseUrl.'/', $filelink);
            if($path[1] && file_exists($path[1])){
                unlink($path[1]);
            }
        }

        public function CreateGuest($guest){
            if(!isset($guest->name) || $guest->name == null){
                //http_response_code(403);
                return array("message" => "Укажите имя", "method" => "CreateGuest", "requestData" => $guest);
            }
            $insert = $this->database->genInsertQuery((array)$guest, 'guest');
            $query = $this->database->db->prepare($insert[0]);
            if($insert[1][0]!=null){
                $query->execute($insert[1]);
            }
            return $this->database->db->lastInsertId();
        }

        public function GenerateLink($link){
            if($link == null || !isset($link->guestId) || $link->guestId == null){
                //http_response_code(500);
                return array("message" => "Укажите id гостя", "method" => "GenerateLink", "requestData" => $link);
            }

            if($link == null || !isset($link->header) || $link->header == null){
                //http_response_code(500);
                return array("message" => "Укажите заголовок приглашения для ссылки", "method" => "GenerateLink", "requestData" => $link);
            }

            if($this->LinkExists($link->guestId)){
                //http_response_code(403);
                return array("message" => "У гостя уже есть ссылка", "method" => "GenerateLink", "requestData" => $link);
            }

            $token = $this->token->encode(array('guestId' => $link->guestId));
            $url = $this->baseUrl.'guest/'.$token;
            $link->url = $url;
            $guestId = $link->guestId;
            unset( $link->guestId );
            
            $insert = $this->database->genInsertQuery((array)$link, 'link');
            $query = $this->database->db->prepare($insert[0]);
            if($insert[1][0]!=null){
                $query->execute($insert[1]);
            }

            $linkId = $this->database->db->lastInsertId();

            $this->UpdateGuest((object) array('id' => $guestId, 'linkId' => $linkId));

            return $this->GetGuestLink($linkId);
            
        }

        public function UpdateGuest($guest){
            if($guest == null || !isset($guest->id)){
                //http_response_code(500);
                return array("message" => "Укажите id гостя", "method" => "UpdateGuest", "requestData" => $guest);
            }

            $guestId = $guest->id;
            unset($guest->id);
            $a = $this->database->genUpdateQuery(array_keys((array)$guest), array_values((array)$guest), "guest", $guestId);
            $query = $this->database->db->prepare($a[0]);
            $query->execute($a[1]);
            return array('message' => 'Гость обновлен');
        }

        public function AddToLink($guest){
            if($guest == null || !isset($guest->guestId) || !isset($guest->linkId)){
                //http_response_code(500);
                return array("message" => "Укажите id гостя и ссылки", "method" => "AddToLink", "requestData" => $guest);
            }
            $this->UpdateGuest((object) array('id' => $guest->guestId, 'linkId' => $guest->linkId));
            return array("message" => "Гость добавлен в ссылку");
            
        }

        public function RemoveFromLink($guest){
            if($guest == null || !isset($guest->guestId) || !isset($guest->linkId)){
                //http_response_code(500);
                return array("message" => "Укажите id гостя и ссылки", "method" => "RemoveFromLink", "requestData" => $guest);
            }
            $this->UpdateGuest((object) array('id' => $guest->guestId, 'linkId' => null));
            $this->CheckEmptyLink($guest->linkId);
            return array("message" => "Гость убран из ссылки");
        }
        
        public function GetStatistics(){
            return array("message" => "Статистика");
            
        }

        public function GetQuestioningResults(){
            return array("message" => "Ответы");
            
        }

        private function GetGuestLink($linkId = null)
        {
            if($linkId != null){
                $query = $this->database->db->prepare("SELECT * FROM link WHERE id = ?");
                $query->execute(array($linkId));
                $query->setFetchMode(PDO::FETCH_CLASS, 'Link');
                return $query->fetch();
            }
            return null;
        }

        private function GetGuestChildren($guestId = null)
        {
            if($guestId != null){
                $query = $this->database->db->prepare("SELECT * FROM child WHERE guestId = ?");
                $query->execute(array($guestId));
                $query->setFetchMode(PDO::FETCH_CLASS, 'Child');
                return $query->fetchAll();
            }
            return array();
        } 

        private function GetGuestNeighbours($guestId = null)
        {
            if($guestId != null){
                $query = $this->database->db->prepare("SELECT n.id, neighbourId, guestId, g.name as neighbourName FROM neighbour n JOIN guest g ON n.neighbourId=g.id WHERE n.guestId = ?");
                $query->execute(array($guestId));
                $query->setFetchMode(PDO::FETCH_CLASS, 'Neighbour');
                return $query->fetchAll();
            }
            return array();
        } 

        private function AddGuestChild($child)
        {
            $insert = $this->database->genInsertQuery((array)$child, 'child');
            $query = $this->database->db->prepare($insert[0]);
            if($insert[1][0]!=null){
                $query->execute($insert[1]);
            }
        }

        private function AddGuestNeighbour($neighbour)
        {
            $insert = $this->database->genInsertQuery((array)$neighbour, 'neighbour');
            $query = $this->database->db->prepare($insert[0]);
            if($insert[1][0]!=null){
                $query->execute($insert[1]);
            }
        }

        private function LinkExists($guestId){
            $query = "SELECT linkId FROM guest WHERE id = ?";
 
            // подготовка запроса 
            $stmt = $this->database->db->prepare( $query );
            // выполняем запрос 
            $stmt->execute(array($guestId));

            $guest = $stmt->fetch();
            return isset($guest['linkId']) && $guest['linkId'] != null;
        }

        private function CheckEmptyLink($linkId){
            $query = "SELECT * FROM guest WHERE linkId = ?";
 
            // подготовка запроса 
            $stmt = $this->database->db->prepare( $query );
            // выполняем запрос 
            $stmt->execute(array($linkId));

            $count = $stmt->rowCount();
            if($count == 0){
                $query = "DELETE FROM link WHERE id = ?";
 
                // подготовка запроса 
                $stmt = $this->database->db->prepare( $query );
                // выполняем запрос 
                $stmt->execute(array($linkId));
            }
        }

        private function RemoveGuestChildren($guestId){
            $query = "DELETE FROM child WHERE guestId = ?";
            $stmt = $this->database->db->prepare( $query );
            $stmt->execute(array($guestId));
        }
        
        private function RemoveGuestNeighbours($guestId){
            $query = "DELETE FROM neighbour WHERE guestId = ?";
            $stmt = $this->database->db->prepare( $query );
            $stmt->execute(array($guestId));
        }

    }
?>