create schema `mdeploye_1`;

create table `mdeploye_1`.`2023 entrées et sorties`(IDIndividu varchar(255),Date Date,Entrées Time NOT NULL,Sorties VARCHAR(10) DEFAULT NULL, PRIMARY KEY(Date,Entrées,IDIndividu));

create table `mdeploye_1`.`2023 état de l'individu` (IDIndividu varchar(255),Date Date,Absence BOOLEAN,Maladie BOOLEAN,Mission BOOLEAN,Congès BOOLEAN,PRIMARY KEY(Date,IDIndividu));

create table `mdeploye_1`.`appartenance` (IDIndividu varchar(255),IDBureau integer,PRIMARY KEY(IDBureau,IDIndividu));

create table `mdeploye_1`.`individu` (img Text,ID varchar(255),Prenom varchar(255),Nom varchar(255),Genre varchar(255),`Date de naissance` date,Profession varchar(255),Début Date,Fin Date,PRIMARY KEY(ID)); 

create table `mdeploye_1`.`location du bureau` (ID integer,`Nom du Bureau` varchar(255),Addresse varchar(255),Région varchar (255),Latitude decimal(12,10),Longitude decimal(12,10),PRIMARY KEY (ID));

create table `mdeploye_1`.`login` (IDIndividu varchar(255),Password varchar(255),SuperAdmin BOOLEAN,Admin BOOLEAN,User BOOLEAN,`Key Admin` BOOLEAN,PRIMARY KEY(IDIndividu));

create table `mdeploye_1`.`manuel des tables d'entrées et de sorties` (Année integer,`Etat de l'individu` varchar(255),Nom varchar(255));




INSERT INTO `individu` (`Date de naissance`, `Début`, `Fin`, `Genre`, `ID`, `img`, `Nom`, `Profession`, `Prenom`) VALUES ('1993-10-06', '2023-01-02', '2024-04-30', 'Homme', '1-23', 'src\\assets\\images\\MamadouMassalyphotodeprofil.jpg', 'Massaly', 'Développeur', 'Mamadou');
SET PASSWORD FOR 'root'@'localhost' IDENTIFIED BY PASSWORD('dbpwd--93')

 insert into `cliques entrées et sorties`.`2023 entrées et sorties` values ('1-23','2023-9-14','11:53:26',NULL);
 insert into `cliques entrées et sorties`.`2023 entrées et sorties` values ('1-23','2023-9-14','11:53:26','11:57:26') ON DUPLICATE KEY UPDATE `cliques entrées et sorties`.`2023 entrées et sorties`.Sorties='11:57:26';
 
 
 
 POSTGRESS ADAPTATIONS
 
 `2023 entrées et sorties` into entréesetsorties2023
 `2023 état de l'individu` to 2023IndividualState
 `Date de naissance` into Datedenaissance
  `Nom du Bureau` into NomduBureau
  `location du bureau` locationdubureau
  `Key Admin` into KeyAdmin
  User into Users
  `Etat de l'individu` into Etatdelindividu
  
create table entréesetsorties2023 (IDIndividu varchar(255),Date Date,Entrées Time NOT NULL,Sorties VARCHAR(10) DEFAULT NULL, PRIMARY KEY(Date,Entrées,IDIndividu));
create table étatdelindividu2023  (IDIndividu varchar(255),Date Date,Absence BOOLEAN,Maladie BOOLEAN,Mission BOOLEAN,Congès BOOLEAN,PRIMARY KEY(Date,IDIndividu));
create table appartenance (IDIndividu varchar(255),IDBureau integer,PRIMARY KEY(IDBureau,IDIndividu));
create table individu (img Text,ID varchar(255),Prenom varchar(255),Nom varchar(255),Genre varchar(255),Datedenaissance date,Profession varchar(255),Début Date,Fin Date,PRIMARY KEY(ID)); 
create table locationdubureau (ID integer,NomduBureau varchar(255),Addresse varchar(255),Région varchar (255),Latitude decimal(12,2),Longitude decimal(12,2),PRIMARY KEY (ID));
create table login (IDIndividu varchar(255),Password varchar(255),SuperAdmin BOOLEAN,Admin BOOLEAN,Users BOOLEAN,`Key Admin` BOOLEAN,PRIMARY KEY(IDIndividu));
create table manueldestablesdentréesetdesorties (Année integer,Etatdelindividu varchar(255),Nom varchar(255));


create table "2023 entrées et sorties"(IDIndividu varchar(255),Date Date,Entrées Time NOT NULL,Sorties VARCHAR(10) DEFAULT NULL, PRIMARY KEY(Date,Entrées,IDIndividu));

create table "2023 état de l'individu" (IDIndividu varchar(255),Date Date,Absence BOOLEAN,Maladie BOOLEAN,Mission BOOLEAN,Congès BOOLEAN,PRIMARY KEY(Date,IDIndividu));

create table "appartenance" (IDIndividu varchar(255),IDBureau integer,PRIMARY KEY(IDBureau,IDIndividu));

create table "individu" (img Text,ID varchar(255),Prenom varchar(255),Nom varchar(255),Genre varchar(255),"Date de naissance" date,Profession varchar(255),Début Date,Fin Date,PRIMARY KEY(ID)); 

create table "location du bureau" (ID integer,"Nom du Bureau" varchar(255),Addresse varchar(255),Région varchar (255),Latitude decimal(12,2),Longitude decimal(12,2),PRIMARY KEY (ID));

create table "login" (IDIndividu varchar(255),Password varchar(255),SuperAdmin BOOLEAN,Admin BOOLEAN,User BOOLEAN,"Key Admin" BOOLEAN,PRIMARY KEY(IDIndividu));

create table "manuel des tables d'entrées et de sorties" (Année integer,"Etat de l'individu" varchar(255),Nom varchar(255));

INSERT INTO individu ("Date de naissance", Début, Fin, Genre, ID, img, Nom, Profession, Prenom) VALUES ('1993-10-06', '2023-01-02', '2024-04-30', 'Homme', '1-23', 'src\\assets\\images\\MamadouMassalyphotodeprofil.jpg', 'Massaly', 'Développeur', 'Mamadou');
