/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;


# Дамп таблицы users
# ------------------------------------------------------------

DROP TABLE IF EXISTS `users`;

CREATE TABLE `users` (
  `id` int(11) unsigned NOT NULL AUTO_INCREMENT,
  `first_name` varchar(100) NOT NULL DEFAULT '',
  `last_name` varchar(100) NOT NULL DEFAULT '',
  `nickname` varchar(100) NOT NULL DEFAULT '',
  `photo` varchar(200) NOT NULL DEFAULT '',
  PRIMARY KEY (`id`),
  KEY `full_name` (`first_name`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;

INSERT INTO `users` (`id`, `first_name`, `last_name`, `nickname`, `photo`)
VALUES
	(1,'Павел','Дуров','durov','https://pp.vk.me/c629231/v629231001/c542/fcMCbfjDsv0.jpg'),
	(6492,'Андрей','Рогозов','andrew','https://pp.vk.me/c622816/v622816492/13346/NWsMj3mL6Rk.jpg'),
	(30942,'Марина','Кравец','id30942','https://pp.vk.me/c622620/v622620942/36c16/ugiD6e-Ss8E.jpg'),
	(45376,'Ира','Ира','i_r_e_n_a','https://cs7059.vk.me/c540104/v540104376/1cbcc/osheCnwpuHY.jpg'),
	(45557,'Валерия','Лапенко','topofthescore','https://pp.vk.me/c630720/v630720557/3547b/CPI5LeLlVew.jpg'),
	(76455,'Екатерина','Миллен','ekaterinamillen','https://pp.vk.me/c631930/v631930455/20af8/xyaeUxA8Tpk.jpg'),
	(85582,'Гарри','Александров','topordybenko','https://pp.vk.me/c635101/v635101582/4b02/Lwz8LaNZDus.jpg'),
	(93388,'Владислав','Цыплухин','vlad','https://pp.vk.me/c309119/v309119388/10873/ZuyheR0kCLQ.jpg'),
	(178679,'Евгений','DJ Magnit','djmagnit','https://pp.vk.me/c627119/v627119679/40a60/50kJ33sXNO8.jpg'),
	(190868,'Руслан','Усачев','usachevruslan','https://pp.vk.me/c628716/v628716868/458e4/dI1sWUPK76I.jpg'),
	(204092,'Глеб','Волков','realkripakrip','https://pp.vk.me/c617929/v617929092/1e318/k1gKaliq_1E.jpg'),
	(220692,'Юлия','Коловангина','yuliasaxar','https://pp.vk.me/c7008/v7008692/144ab/h3vzaxwOnhw.jpg'),
	(281237,'Антон','Иванов','banderas_spb','https://pp.vk.me/c623230/v623230237/125d1/xlvEhhXGYoM.jpg'),
	(291865,'Катрин','Рвиза','rwiza','https://pp.vk.me/c615718/v615718865/16615/geuA-GMOkYI.jpg'),
	(336279,'Женя','Петрова','idjenya_petrova','https://pp.vk.me/c630323/v630323279/41e71/0Y6-7OnJdSw.jpg'),
	(354444,'Стёпа','Ледков','stepamarsel','https://pp.vk.me/c626719/v626719444/6b72/1GdfLYWWXZo.jpg'),
	(421848,'Артем','Скоробогатый','skorobogatiy','https://pp.vk.me/c627217/v627217848/2ee81/IzC-EJkr0vs.jpg'),
	(455581,'Сергей','Румянцев','djcosmo','https://pp.vk.me/c608118/v608118581/82ce/d3l6uuKkUJQ.jpg'),
	(562406,'Влада','Чупрова','vladachuprova','https://pp.vk.me/c630924/v630924406/43215/PiWAslOmlhc.jpg'),
	(631602,'Александр','Муратаев','murataev','https://pp.vk.me/c406624/v406624602/a997/0VpLTJjeV8s.jpg'),
	(638689,'Юлия','Коган','yulkastar','https://pp.vk.me/c633323/v633323689/3bf8b/8zDx4WZSN-M.jpg'),
	(665623,'Кажэ','Обойма','kajeworldwide','https://pp.vk.me/c630620/v630620623/38551/yd5GP5bfryo.jpg'),
	(667283,'Илья','Ларионов','larionchik','https://pp.vk.me/c620116/v620116283/a1be/0weSz0NWdww.jpg'),
	(668132,'Александр','Жданов','alexander.zhdanov','https://pp.vk.me/c629129/v629129132/3a705/T_LmSaI2qM8.jpg'),
	(715211,'Василий','Васин','tzarvasilich','https://pp.vk.me/c631922/v631922211/3277c/a4j1opLJpas.jpg'),
	(752384,'Станислав','Лиепа','liepa','https://pp.vk.me/c631129/v631129384/2cbea/Pijlc_8Tpx0.jpg'),
	(763347,'Кирилл','DJ Slider','djslider','https://pp.vk.me/c626620/v626620347/198a8/sYg7iHF1qoU.jpg'),
	(1117105,'Алиса','Вокс','alisavox','https://pp.vk.me/c626330/v626330105/11f25/pBUSSmDfeig.jpg'),
	(1129570,'Ольга','Маркес','olymarkes','https://pp.vk.me/c543108/v543108570/1c6c5/SHzAtpljmn4.jpg'),
	(1150167,'Дмитрий','Сыендук','siend_k','https://pp.vk.me/c630524/v630524167/347f5/NvMdR-m7vLo.jpg'),
	(1418629,'Тарас','Уманский','tarasmetal','https://pp.vk.me/c307311/v307311629/8c8e/ywXpzco09vM.jpg'),
	(1447159,'Дмитрий','Пучков','goblin','https://pp.vk.me/c629204/v629204159/254b9/0TbZtKkVfmg.jpg'),
	(1718916,'Андрей','Нифёдов','topblogger','https://pp.vk.me/c633921/v633921916/20eda/SKanAPPmMqM.jpg'),
	(1770436,'Юрий','Хованский','hovan','https://pp.vk.me/c636016/v636016436/1547f/LoZOIdzO48I.jpg'),
	(1858632,'Илья','Стрекаловский','ilya_nevzatyag','https://pp.vk.me/c626726/v626726632/227c/jCPxsG4_3SU.jpg'),
	(2159579,'Вадим','Соломинов','vabim','https://pp.vk.me/c636322/v636322579/1d487/mtQINIiLjBY.jpg'),
	(2183360,'Николай','Соболев','sobolevbro','https://pp.vk.me/c624416/v624416360/4b45a/OQVSt9Gh-d4.jpg'),
	(2230862,'Екатерина','Малафеева','malafeevam16','https://pp.vk.me/c617117/v617117862/23439/objx1C4bqkM.jpg'),
	(2449831,'Bantik','Boy','bantikboy','https://pp.vk.me/c636226/v636226831/1559e/7v1-9kYg6NI.jpg'),
	(2469321,'Гурам','Нармания','gurmania','https://pp.vk.me/c630324/v630324321/9e9d/gd2gwh2s4eQ.jpg'),
	(2731289,'Мария','Либерт','masja2912','https://pp.vk.me/c7007/v7007289/2747b/bGq7tzvs_ic.jpg'),
	(2849811,'Наталья','Антюх','id2849811','https://pp.vk.me/c629204/v629204811/42335/Ocuw628KOiM.jpg'),
	(2850237,'Miron','Федоров','norimyxxxo','https://pp.vk.me/c633217/v633217237/3c955/1YmswkPApEE.jpg'),
	(3616299,'Виктор','Агарок','cheatbanned','https://pp.vk.me/c636319/v636319299/63c6/pyUcgv4H1Og.jpg'),
	(3672456,'Клявер','Денис','denisklyaverdk','https://pp.vk.me/c630627/v630627456/1afcd/CfFzn6zV_dE.jpg'),
	(3820053,'Женя','Любич','jenia_lubich','https://pp.vk.me/c604421/v604421053/1d03d/8wpvqOwxZTY.jpg'),
	(3858933,'Дмитрий','Малышко','id3858933','https://pp.vk.me/c631319/v631319933/3abeb/iBNxstPMdJQ.jpg'),
	(4199078,'Виктория','Меккер','mekker','https://pp.vk.me/c636729/v636729078/13fd1/VRfzJRU9pzE.jpg'),
	(4364436,'Юлия','Рудина','id4364436','https://pp.vk.me/c419616/u4364436/d_67db4ab8.jpg'),
	(5036154,'Боб','Джек','bob_jack','https://pp.vk.me/c636020/v636020154/c713/B9pfnFvAaZg.jpg'),
	(5390784,'Юлия','Топольницкая','juliatopolnitskaya','https://pp.vk.me/c629415/v629415784/2bfe5/5rauYgw5jTI.jpg'),
	(6858371,'Даниил','Школьник','id6858371','https://pp.vk.me/c622631/v622631371/27fe/7mx7RvEXDos.jpg'),
	(6878183,'Александр','Булкин','bulkin1','https://pp.vk.me/c626327/v626327183/187ac/qIe4Nda8ZTs.jpg'),
	(7064629,'Татьяна','Ларина','tatiana_psychic','https://pp.vk.me/c626324/v626324629/1a29e/vhKigjxJNDk.jpg'),
	(7148238,'Мария','Шатрова','masha_24_shatrova','https://pp.vk.me/c626426/v626426238/1a803/0daGBbEmN8I.jpg'),
	(7163432,'Денис','Животовский','bigdenver','https://pp.vk.me/c630019/v630019432/3b952/lYCGTSxp3PI.jpg'),
	(7168684,'Даниил','Светлов','amatorystewart','https://pp.vk.me/c626722/v626722684/176f4/pPEgvecAAbc.jpg'),
	(8282458,'Андрей','Князев','knyazevandrey_knazz','https://pp.vk.me/c636725/v636725458/7107/7RkuKGWmFMg.jpg'),
	(10050301,'Данила','Поперечный','spoontamer','https://pp.vk.me/c630030/v630030301/3e4cf/vlySCUxAnHs.jpg'),
	(10559979,'Виталий','Гиберт','gibertmagic','https://pp.vk.me/c302114/v302114979/5a88/qpkn6wIYC28.jpg'),
	(11527726,'Евгения','Некрасова','evgenia.nekrasova','https://pp.vk.me/c622925/v622925726/4c521/MrCTgEgHQW4.jpg'),
	(12299826,'Катя','Иванчикова','id12299826','https://pp.vk.me/c633429/v633429826/3a490/B0jNSlNeQJg.jpg'),
	(18153228,'Покрас','Лампас','pokraslampas','https://pp.vk.me/c631431/v631431228/309c3/MV2gy0KwERE.jpg'),
	(18195959,'Игорь','Чехов','id18195959','https://pp.vk.me/c625323/v625323959/2ecb0/D_N4L8SfAvI.jpg'),
	(19184342,'Елена','Шейдлина','sheidlin','https://pp.vk.me/c630730/v630730342/2f454/Ttx9D1ofh8s.jpg'),
	(19902804,'Роман','Фильченков','mrlololoshka','https://pp.vk.me/c630222/v630222804/3bb05/1KdIdJdjBWw.jpg'),
	(20114959,'Билли','Новик','billynovik','https://pp.vk.me/c626516/v626516959/24437/t1PFYJMHySs.jpg'),
	(23379958,'Эльдар','Джарахов','d.l.greez','https://pp.vk.me/c630122/v630122958/2d673/EL4i0wnwkKs.jpg'),
	(27566516,'Fuze','Krec','fuzekrec','https://pp.vk.me/c630530/v630530516/4a737/URDLx02tv6Q.jpg'),
	(28138864,'Dasha','Egorova','egorova_dasha','https://pp.vk.me/c411727/v411727864/88b6/soIzufVxrwI.jpg'),
	(30037100,'Екатерина','Енокаева','e_enokaeva','https://pp.vk.me/c633430/v633430100/3741a/JwMhOP7A8pc.jpg'),
	(30313225,'Михаил','Совергон','sovergonm','https://pp.vk.me/c630127/v630127225/3612f/nIrTGxODCWg.jpg'),
	(32707600,'Ольга','Бузова','olgabuzova','https://pp.vk.me/c630525/v630525600/35eb8/cO4RhNwezX0.jpg'),
	(35057592,'Стас','Пьеха','id35057592','https://pp.vk.me/c408420/v408420592/7f7e/tDTTcq4mDRQ.jpg'),
	(35340109,'Илья','Соболев','sobolevilya','https://pp.vk.me/c626525/v626525109/189d6/PAaWObt-VBQ.jpg'),
	(38194205,'Елена','Ясевич','lena.yasevich','https://pp.vk.me/c630028/v630028205/be0f/DjMJzZpr25Y.jpg'),
	(38537529,'Елизавета','Туктамышева','id38537529','https://pp.vk.me/c630623/v630623529/41075/VOomyDh3PF0.jpg'),
	(63230244,'Михаил','Кукота','kukot','https://pp.vk.me/c629229/v629229244/299fe/_qz8K6FV3ak.jpg'),
	(66077817,'Кристина','Хованских','kristi_hova','https://pp.vk.me/c543107/v543107817/27757/Fzo87u-oZWg.jpg'),
	(66194945,'Сергей','Адамов','adamsergey','https://pp.vk.me/c622029/v622029945/37c21/skvJT_jCLrU.jpg'),
	(72155373,'Наталья','Бантеева','banteevanat','https://pp.vk.me/c628522/v628522373/46c13/uk0VGfdmPFs.jpg'),
	(84812120,'Дарья','Юргенс','darya68','https://pp.vk.me/c628227/v628227120/4849f/YMncYHElDd0.jpg'),
	(87800684,'Макс','Тарасенко','thebrianmaps','https://pp.vk.me/c633626/v633626684/35fdd/CoPNeRz7xWc.jpg'),
	(89941395,'Артём','Решетило','warmix','https://pp.vk.me/c607522/v607522395/332/SLpF-YReqag.jpg'),
	(89947067,'Maxim','Kanunnikov','kanun99','https://pp.vk.me/c633618/v633618067/13565/dctQ5pQesZU.jpg'),
	(99983274,'Вячеслав','Бутусов','v_butusov','https://pp.vk.me/c621618/v621618274/29d0b/YgnYWcxRWIg.jpg'),
	(102436396,'Алиса','Кожикина','id102436396','https://pp.vk.me/c636120/v636120396/17fee/Pel3Cmu5Iy8.jpg'),
	(135454327,'Анастасия','Волочкова','volochkova_a','https://pp.vk.me/c412430/v412430327/af22/qt7SCXhwuLg.jpg'),
	(146115663,'Ник','Фёдоров','nickfedorovru','https://pp.vk.me/c621323/v621323663/20101/dkExHGsaoKE.jpg'),
	(153151548,'Юрий','Шевчук','ddt','https://pp.vk.me/c10029/u153151548/d_38354b0e.jpg'),
	(154686894,'Stil','Ryder','stil_ryder','https://pp.vk.me/c627728/v627728894/467ae/vNKiYexYRy8.jpg'),
	(155990526,'Татьяна','Рыбакова','tanya_rybakova','https://pp.vk.me/c417728/v417728526/1a79/XhOpriPlZ8Q.jpg'),
	(167693353,'Виктория','Райдос','vraidos','https://pp.vk.me/c309231/v309231353/1a45/fQ2kwox_6tM.jpg'),
	(186607425,'Эвелина','Хромченко','evelinakhromtchenko','https://pp.vk.me/c630831/v630831425/40838/KRJcVvM-pJg.jpg'),
	(188215040,'Масяня','Куваева','masyanyaofficial','https://pp.vk.me/c320721/v320721040/8ed2/BRNXF-ATiEU.jpg'),
	(227886898,'Анатолий','Тимощук','t44','https://pp.vk.me/c627821/v627821898/3e17e/k4Op-asM5oc.jpg'),
	(274999264,'Вячеслав','Малафеев','malafeev16ru','https://pp.vk.me/c624829/v624829264/3985f/wtop1PeOmyU.jpg'),
	(294635757,'Серхио','Блогер','blogerserhio','https://pp.vk.me/c636126/v636126757/184db/6zW9tCY-U_0.jpg'),
	(302027280,'Александр','Кержаков','akerzhakov_11','https://pp.vk.me/c615721/v615721280/18d6c/vQx54h9J6So.jpg'),
	(304302303,'Зара','Мгоян','zarasinger','https://pp.vk.me/c625320/v625320303/3448a/fo42cAnPEnQ.jpg');

/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;



/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;
/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
