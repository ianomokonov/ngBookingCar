CREATE TABLE IF NOT EXISTS user(
    id int(10) PRIMARY KEY AUTO_INCREMENT,
    isAdmin bit DEFAULT 0,
    name varchar(255) NOT NULL,
    surname varchar(255) NOT NULL,
    middlename varchar(255),
    email varchar(255) NOT NULL,
    phone varchar (20),
    password varchar(255) NOT NUll
);

CREATE TABLE IF NOT EXISTS car(
    id int(10) PRIMARY KEY AUTO_INCREMENT,
    img varchar(255) NOT NULL,
    name varchar(255) NOT NULL,
    description text NOT NULL,
    description_eng text NOT NULL,
    description_de text NULL,
    fuelType varchar(100) NOT NULL,
    bodyType varchar(100) NOT NULL,
    engineVolume float,
    enginePower int(10),
    speed float,
    time float,
    volumePerHundred float,
    kpp varchar(100)  NOT NULL,
    driveUnit varchar(100)  NOT NULL,
    places int(2)  NOT NULL,
    backVolume float,
    license varchar(10),
    createYear int(4),
    class varchar(255),
    ac bit(1) DEFAULT 0,
    abs bit(1) DEFAULT 0,
    airBags bit(1) DEFAULT 0,
    doors int(10),
    minAge int(10),
    winterPrice float NOT NULL,
    summerPrice float NOT NULL
);

CREATE TABLE IF NOT EXISTS place(
    id int PRIMARY KEY AUTO_INCREMENT,
    name varchar(255) NOT NULL,
    name_eng varchar(255) NOT NULL,
    name_de varchar(255) NULL
);

CREATE TABLE IF NOT EXISTS feedback(
    id int PRIMARY KEY AUTO_INCREMENT,
    userName varchar(255) NOT NULL,
    carId int(10) NOT NULL,
    raiting float DEFAULT 0,
    date datetime DEFAULT CURRENT_TIMESTAMP,
    message text NOT NULL,

    FOREIGN KEY (carId) REFERENCES car(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS placeOfInterest(
    id int PRIMARY KEY AUTO_INCREMENT,
    img varchar(255) NOT NULL,
    name varchar(255) NOT NULL,
    name_eng varchar(255) NOT NULL,
    name_de varchar(255) NULL,
    description text NOT NULL,
    description_eng text NOT NULL,
    description_de text NULL,
    road text NOT NULL,
    road_eng text NOT NULL,
    road_de text NULL,
    rating int(10) DEFAULT 0
);

CREATE TABLE IF NOT EXISTS MainSlide(
    id int PRIMARY KEY AUTO_INCREMENT,
    img varchar(255) NOT NULL,
    title varchar(255) NOT NULL,
    title_eng varchar(255) NOT NULL,
    title_de varchar(255) NULL,
    description text NOT NULL,
    description_eng text NOT NULL,
    description_de text NULL
);

CREATE TABLE IF NOT EXISTS carOrder(
    id int PRIMARY KEY AUTO_INCREMENT,
    userId int(255) NOT NULL,
    carId int(100) NOT NULL,
    placeFromId int(100) NULL,
    placeToId int(100) NULL,
    dateFrom DATE NOT NULL,
    dateTo DATE NULL,
    orderSum int(10) NOT NULL,
    timeFrom varchar(50) NOT NULL,
    timeTo varchar(50) NOT NULL,
    status int(2) DEFAULT 1,
    isCarFree bit(1) DEFAULT 1
    
    FOREIGN KEY (userId) REFERENCES user(id),
    FOREIGN KEY (carId) REFERENCES car(id) ON DELETE CASCADE,
    FOREIGN KEY (placeFromId) REFERENCES place(id) ON DELETE CASCADE,
    FOREIGN KEY (placeToId) REFERENCES place(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS RentLocation(
    id int PRIMARY KEY AUTO_INCREMENT,
    path varchar(255) NOT NULL,
    title varchar(255) NOT NULL,
    title_eng varchar(255) NOT NULL,
    title_de varchar(255) NULL
);

CREATE TABLE IF NOT EXISTS RentLocationSection(
    id int PRIMARY KEY AUTO_INCREMENT,
    locationId int(10) NOT NULL,
    title varchar(255) NULL,
    title_eng varchar(255) NOT NULL,
    title_de varchar(255) NULL,
    description text NULL,
    description_eng text NOT NULL,
    description_de text NULL,
    img varchar(255) NULL,

    FOREIGN KEY (locationId) REFERENCES RentLocation(id) ON DELETE CASCADE
);
