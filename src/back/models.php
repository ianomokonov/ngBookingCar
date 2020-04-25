<?php
    class User {
        public $id;
        public $name;
        public $phone;
        public $email;
    }

    class Link{
        public $id;
        public $url;
        public $header;
    }

    class Child{
        public $id;
        public $name;
        public $age;
        public $guestId;
    }

    class Neighbour{
        public $id;
        public $neighbourId;
        public $guestId;
    }
?>