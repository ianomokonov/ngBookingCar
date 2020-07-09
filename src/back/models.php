<?php
    class User {
        public $id;
        public $name;
        public $surname;
        public $middlename;
        public $phone;
        public $email;
    }
    
    class Feedback {
        public $id;
        public $userName;
        public $car;
        public $raiting;
        public $message;
    }

    class Car {
        public $id;
        public $img;
        public $name;
        public $description;
        public $description_eng;
        public $price;
        public $fuelType;
        public $bodyType;
        public $engineVolume;
        public $enginePower;
        public $speed;
        public $time;
        public $consumption;
        public $kpp;
        public $driveUnit;
        public $places;
        public $backVolume;
        public $license;
        public $createYear;
        public $minAge;
        public $ac;
        public $abs;
        public $airBags;
        public $winterPrice;
        public $summerPrice;
        public $doors;
    }

    class Place {
        public $id;
        public $name;
    }
    
    class PlaceOfInterest {
        public $id;
        public $name;
        public $name_eng;
        public $deacription_eng;
        public $description;
        public $road;
        public $road_eng;
        public $img;
        public $rating;
    }

    class Order {
        public $id;
        public $userId;
        public $carId;
        public $placeFromId;
        public $placeToId;
        public $dateFrom;
        public $dateTo;
        public $orderSum;
        public $timeFrom;
        public $timeTo;
        public $isCarFree;

        public $user;
        public $car;
        public $placeFrom;
        public $placeTo;
    }

    class DateRange {
        public $dateFrom;
        public $dateTo;
    }
    
    class Prices{
        public $oneDayPrice;
        public $twoDaysPrice;
        public $threeDaysPrice;
        public $fourDaysPrice;
        public $fiveDaysPrice;
        public $sixDaysPrice;
        public $sevenDaysPrice;
    }
?>