CREATE DATABASE db_text_tags;
USE db_text_tags;
drop table if exists tags;
CREATE TABLE tags(
    id INT(11) unsigned auto_increment,
    title VARCHAR(30) NOT NULL,
    contents TEXT NOT NULL,
    anotations varchar(10) ,
    PRIMARY KEY (id)
); 
drop table if exists users;
create table users(
    user_id int(11) not null,
    user_name varchar(30)
);
