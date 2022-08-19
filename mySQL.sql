CREATE DATABASE hotel;
use hotel;

create table receptionist(
Re_name varchar(50),
Re_phone_number varchar(12),
Re_dob date,
Re_email varchar(100),
Re_address varchar(50),
Re_passcode varchar(50),
Re_status varchar(50),
Re_id int primary key  auto_increment
);


INSERT INTO receptionist (Re_id,Re_name,Re_phone_number,Re_dob,Re_email,Re_address,Re_passcode,Re_status)
VALUES ('1','Abhishek','9914068761','2002-07-21','abhi@gmail.com', 'Jaunpur',md5('1234'),'Owner');


CREATE TABLE house_keeper(
hk_id INT PRIMARY KEY AUTO_INCREMENT,
hk_name varchar(50),
hk_address Varchar(50),
hk_phone_number varchar(12),
hk_email varchar(100),
hk_dob date,
hk_status varchar(50),
hk_password varchar(50)
);

create table restaurant_manager(
rm_id int primary key AUTO_INCREMENT,
rm_name varchar(100),
rm_address varchar(100),
rm_phone_number varchar(12),
rm_email varchar(100),
rm_dob date,
rm_status varchar(100),
rm_password varchar(200)
);

create table guest(
 guest_fname varchar(50),
 guest_lname varchar(50),
 guest_address varchar(100),
 guest_email varchar(100),
 guest_phone_number varchar(12),
 room_type int(10),
 guest_adults int,
 guest_child int,
 room_number varchar(10),
 guest_id int primary key auto_increment,
 checkin date,
 checkout date,
 ID_proof longblob,
 guest_password varchar(100),
 number_of_rooms int
 );
 
 CREATE TABLE Rooms (
    RoomId int NOT NULL,
    Type varchar(50) NOT NULL,
    guest_id int,
    PRIMARY KEY (RoomId),
    FOREIGN KEY (guest_id) REFERENCES guest(guest_id)
);