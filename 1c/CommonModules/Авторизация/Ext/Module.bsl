//Авторизация
Функция Логин(ИдентификаторПользователя, Пароль) Экспорт
	
	Ответ = Новый Структура("error, accessToken, refreshToken");
	
	СтруктураПользователя = ПолучитьПользователяПоИдентификатору(ИдентификаторПользователя);
	
	Если ЗначениеЗаполнено(СтруктураПользователя.Ошибка) Тогда
		Ответ.error	= СтруктураПользователя.Ошибка;
		Возврат Ответ;
	КонецЕсли;
	
	Запрос = Новый Запрос;
	Запрос.Текст = "ВЫБРАТЬ
	|	ПаролиВнешнихПользователей.Пользователь
	|ИЗ
	|	РегистрСведений.ПаролиВнешнихПользователей КАК ПаролиВнешнихПользователей
	|ГДЕ
	|	ПаролиВнешнихПользователей.Пользователь = &Пользователь
	|	И ПаролиВнешнихПользователей.Пароль = &ПарольMD5";
	

	Запрос.УстановитьПараметр("Пользователь", СтруктураПользователя.Пользователь);
	Запрос.УстановитьПараметр("ПарольMD5", ПолучитьMD5Строки(Пароль, Истина));
		
	Выборка = Запрос.Выполнить().Выбрать();
	
	Если Выборка.Следующий() Тогда
		
		Токены = СформироватьТокены(СтруктураПользователя.Пользователь, ИдентификаторПользователя);
		Ответ.accessToken = Токены.accessToken;
		Ответ.refreshToken = Токены.refreshToken;
	
	Иначе
		Ответ.error = "Неверное имя пользователя или пароль";
	КонецЕсли;
	
	Возврат Ответ;
	
КонецФункции

Функция СформироватьТокены(Пользователь, ИмяПользователя, fingerprint="")
	
	МаксКолТокенов = 3;
	
	Результат = Новый Структура("accessToken, refreshToken");
	
	Набор = РегистрыСведений.КлючиАвторизацииВнешнихПользователей.СоздатьНаборЗаписей();
	Набор.Отбор.Пользователь.Установить(Пользователь);
	Набор.Прочитать();
	
	тзТокены = Набор.Выгрузить();
	тзТокены.Сортировать("ДатаФормирования убыв");		
	Набор.Очистить();		
	
		
	Для Каждого СтрокаТЗ ИЗ тзТокены Цикл
		
		МаксКолТокенов = МаксКолТокенов - 1;
		
		Если МаксКолТокенов = 0 Тогда
			Прервать;
		КонецЕсли;
		
		Если fingerprint <> "" Тогда
			Если fingerprint = СтрокаТЗ.fingerprint Тогда
				Продолжить;
			КонецЕсли;
		КонецЕсли;
		
		Если  СтрокаТЗ.СменаПароля Тогда
			Продолжить;
		КонецЕсли;
		
		ЗаполнитьЗначенияСвойств(Набор.Добавить(), СтрокаТЗ)
		
	КонецЦикла;		
	

	jti = Строка(Новый УникальныйИдентификатор);
	accessToken = СформироватьКлючДоступа(ИмяПользователя, jti, "accessToken");
	refreshToken = СформироватьКлючДоступа(ИмяПользователя, jti, "refreshToken");
	
	НоваяСтрока = Набор.Добавить();
	НоваяСтрока.Пользователь 		= Пользователь;
	НоваяСтрока.ДатаФормирования 	= ТекущаяДата();
	НоваяСтрока.Ключ 				= ПолучитьMD5Строки(jti);
	НоваяСтрока.fingerprint 		= fingerprint;
	
	Набор.Записать();
	
	Результат.accessToken = accessToken;
	Результат.refreshToken = refreshToken;
	Возврат Результат;
	
КонецФункции

Функция ПолучитьТокен(refreshToken) Экспорт
	
	Ответ = Новый Структура("error, accessToken, refreshToken");
	
	Если НЕ ЗначениеЗаполнено(refreshToken) Тогда
		Ответ.error = "Не заполнено значение refreshToken";
		Возврат Ответ;
	КонецЕсли;
	
	Попытка
		DecodedPayload = Decode(refreshToken, ПолучитьSecretKey());
	Исключение
		Ответ.error = "Не правильный ключ";
		Возврат Ответ;
	КонецПопытки;
	
	UnixtimeТекущаяДата = ПолучитьUnixtime(ТекущаяДата());
	
	Если UnixtimeТекущаяДата > DecodedPayload.exp Тогда
		Ответ.error = "Ключ просрочен";
		Возврат Ответ;
	КонецЕсли;

	Если DecodedPayload.type <>  "refreshToken" Тогда	
		Ответ.error = "Не правильный ключ";
		Возврат Ответ;
	КонецЕсли;
	
	СтруктураПользователя = ПолучитьПользователяПоИдентификатору(DecodedPayload.user);
			
	Если ЗначениеЗаполнено(СтруктураПользователя.Ошибка) Тогда
		Ответ.error	= СтруктураПользователя.Ошибка;
		Возврат Ответ;
	КонецЕсли;
	
	Запрос = Новый Запрос;
	Запрос.Текст = "ВЫБРАТЬ ПЕРВЫЕ 1
	               |	КлючиАвторизацииВнешнихПользователей.Ключ
	               |ИЗ
	               |	РегистрСведений.КлючиАвторизацииВнешнихПользователей КАК КлючиАвторизацииВнешнихПользователей
	               |ГДЕ
	               |	КлючиАвторизацииВнешнихПользователей.Ключ = &Ключ
	               |	И КлючиАвторизацииВнешнихПользователей.Пользователь = &Пользователь";
	
	Запрос.УстановитьПараметр("Пользователь", СтруктураПользователя.Пользователь);	
	Запрос.УстановитьПараметр("Ключ", ПолучитьMD5Строки(DecodedPayload.jti));
	
	Выборка = Запрос.Выполнить().Выбрать();
	
	Если Выборка.Следующий()  Тогда
		
		// здесь еще дополнительно можно проверить fingerprint и ua
		
		Токены = СформироватьТокены(СтруктураПользователя.Пользователь, DecodedPayload.user);
		Ответ.accessToken = Токены.accessToken;
		Ответ.refreshToken = Токены.refreshToken;
	Иначе
		Ответ.error = "Ключ не актуален";	
	КонецЕсли;
	
	Возврат Ответ;
	
КонецФункции

Функция ПолучитьUnixtime(ДатаВремя)
	
	unixtime = Формат(ДатаВремя - дата(1970,1,1,1,0,0), "ЧГ=0");   
	Возврат  unixtime;
	
КонецФункции

Функция СформироватьКлючДоступа(ИдентификаторПользователя, jti, type) Экспорт
		
		Payload = New Structure;
		Payload.Insert("user", ИдентификаторПользователя);
		Payload.Insert("sub", "auth");
		Payload.Insert("jti", jti);
		Payload.Insert("exp", ПолучитьUnixtime(ТекущаяДата()+ПолучитьВремяЖизниТокенаСек(type)));
		Payload.Insert("type", type);
		Возврат Encode(ПолучитьSecretKey(), Payload);

КонецФункции

Функция ПолучитьSecretKey()
	
	Возврат "wEVxzfdsgh5rtrtgrrgrc1RR12%*@qQ54_infostart";
	
КонецФункции

Функция УстановитьПароль(КлючСменыПароля, Пароль) Экспорт
	
	Ответ = Новый Структура("error, accessToken, refreshToken, userID");
	
	Если НЕ ЗначениеЗаполнено(КлючСменыПароля) Тогда
		Ответ.error = "Не заполнен ключ смены пароля";
		Возврат Ответ;
	КонецЕсли;
	
	Если НЕ ЗначениеЗаполнено(Пароль) Тогда
		Ответ.error = "Не заполнен пароль";
		//нужно проверить регулярным выражением
		Возврат Ответ;
	КонецЕсли;
	
	Запрос = Новый Запрос;
	Запрос.Текст = "ВЫБРАТЬ ПЕРВЫЕ 1
	               |	КлючиАвторизацииВнешнихПользователей.Пользователь,
	               |	КлючиАвторизацииВнешнихПользователей.Пользователь.Код КАК userID,
	               |	КлючиАвторизацииВнешнихПользователей.Пользователь.ВнешнийПользовательЗаблокирован как ВнешнийПользовательЗаблокирован 
	               |ИЗ
	               |	РегистрСведений.КлючиАвторизацииВнешнихПользователей КАК КлючиАвторизацииВнешнихПользователей
	               |ГДЕ
	               |	КлючиАвторизацииВнешнихПользователей.ДатаФормирования >= &ПредельнаяДата
	               |	И КлючиАвторизацииВнешнихПользователей.Ключ = &КлючСменыПароля
	               |	И КлючиАвторизацииВнешнихПользователей.СменаПароля = ИСТИНА";
	
	Запрос.УстановитьПараметр("ПредельнаяДата",  ДатаАктуальностиКлючей());
	Запрос.УстановитьПараметр("КлючСменыПароля", ПолучитьMD5Строки(КлючСменыПароля));
	
	Выборка = Запрос.Выполнить().Выбрать();
	Если Выборка.Следующий() Тогда
		
		Если Выборка.ВнешнийПользовательЗаблокирован Тогда
			Ответ.error = "Пользователь заблокирован";
			Возврат Ответ;
			
		Иначе
			
			
			//Очишаем ключи доступа
			Набор = РегистрыСведений.КлючиАвторизацииВнешнихПользователей.СоздатьНаборЗаписей();
			Набор.Отбор.Пользователь.Установить(Выборка.Пользователь);
			Набор.Записать();
			
			
			//Изменяем пароль
			МЗПароли = РегистрыСведений.ПаролиВнешнихПользователей.СоздатьМенеджерЗаписи();
			МЗПароли.Пользователь = Выборка.Пользователь;
			МЗПароли.Пароль = ПолучитьMD5Строки(Пароль, Истина);
			МЗПароли.ДатаИзменения = ТекущаяДата();
			МЗПароли.Записать();
							
			Результат = СформироватьТокены(Выборка.Пользователь, Выборка.userID);
		
			Ответ.accessToken = Результат.accessToken;
			Ответ.refreshToken = Результат.refreshToken;
			
			Ответ.userID = Выборка.userID;
			
		КонецЕсли;		
		
	Иначе
		Ответ.error = "Недействительная ссылка смены пароля";
	КонецЕсли;
	
	Возврат Ответ;
	
КонецФункции

Функция ПолучитьПользоватеяПоКлючу(token) Экспорт
	
	Ответ = Новый Структура("error, user");
	
	Если НЕ ЗначениеЗаполнено(token) Тогда
		Ответ.error = "Не заполнено значение token";
		Возврат Ответ;
	КонецЕсли;
	
	Попытка
		DecodedPayload = Decode(token, ПолучитьSecretKey());
	Исключение
		Ответ.error = "Не правильный ключ";
		Возврат Ответ;
	КонецПопытки;
	
	UnixtimeТекущаяДата = ПолучитьUnixtime(ТекущаяДата());
	
	Если UnixtimeТекущаяДата > DecodedPayload.exp Тогда
		Ответ.error = "Ключ доступа просрочен";
		Возврат Ответ;
	КонецЕсли;

	Если DecodedPayload.type <>  "accessToken" Тогда	
		Ответ.error = "Неправильный тип ключа";
		Возврат Ответ;
	КонецЕсли;
	
	СтруктураПользователя = ПолучитьПользователяПоИдентификатору(DecodedPayload.user);
			
	Если ЗначениеЗаполнено(СтруктураПользователя.Ошибка) Тогда
		Ответ.error	= СтруктураПользователя.Ошибка;
		Возврат Ответ;
	КонецЕсли;
	
	Запрос = Новый Запрос;
	Запрос.Текст = "ВЫБРАТЬ ПЕРВЫЕ 1
	               |	КлючиАвторизацииВнешнихПользователей.Ключ
	               |ИЗ
	               |	РегистрСведений.КлючиАвторизацииВнешнихПользователей КАК КлючиАвторизацииВнешнихПользователей
	               |ГДЕ
	               |	КлючиАвторизацииВнешнихПользователей.Ключ = &Ключ
	               |	И КлючиАвторизацииВнешнихПользователей.Пользователь = &Пользователь";
	
	Запрос.УстановитьПараметр("Пользователь", СтруктураПользователя.Пользователь);	
	Запрос.УстановитьПараметр("Ключ", ПолучитьMD5Строки(DecodedPayload.jti));
	
	Выборка = Запрос.Выполнить().Выбрать();
	Если Выборка.Следующий()  Тогда
		Ответ.user = СтруктураПользователя.Пользователь;
	Иначе
		Ответ.error = "Ключ не актуален";	
	КонецЕсли;
	
	Возврат Ответ;
	
КонецФункции

Функция УстановитьКлючСменыПароля(Пользователь) Экспорт
	
	//Удаляем текущие   ключи
	Набор = РегистрыСведений.КлючиАвторизацииВнешнихПользователей.СоздатьНаборЗаписей();
	Набор.Отбор.Пользователь.Установить(Пользователь);
	Набор.Записать();
	
		
	//Удаляем текущий пароль
	Набор = РегистрыСведений.ПаролиВнешнихПользователей.СоздатьНаборЗаписей();
	Набор.Отбор.Пользователь.Установить(Пользователь);
	Набор.Записать();
	
	//Записываем ключ смены пароля
	КлючСменыПароля = Строка(Новый УникальныйИдентификатор);
	МЗ = РегистрыСведений.КлючиАвторизацииВнешнихПользователей.СоздатьМенеджерЗаписи();
	МЗ.Ключ 			        = ПолучитьMD5Строки(КлючСменыПароля);
	МЗ.СменаПароля 				= Истина;
	МЗ.Пользователь 		  	= Пользователь;
	МЗ.ДатаФормирования 	    = ТекущаяДата();
	МЗ.Ключ 					= ПолучитьMD5Строки(КлючСменыПароля);
	МЗ.СменаПароля 				= Истина;
	МЗ.Записать();
	
	Возврат КлючСменыПароля;
	
КонецФункции

Функция ПолучитьКодПодтверждения(ИдентификаторПользователя) Экспорт
	
	Ответ = Новый Структура("error, requestKey");
	
	Если НЕ ЗначениеЗаполнено(ИдентификаторПользователя) Тогда
		Ответ.error = "Не заполнен адрес электронной почты пользователя";
		Возврат Ответ;
	КонецЕсли;

	СтруктураПользователя = ПолучитьПользователяПоИдентификатору(ИдентификаторПользователя);
	
	Если ЗначениеЗаполнено(СтруктураПользователя.Ошибка) Тогда
		Ответ.error	= СтруктураПользователя.Ошибка;
		Возврат Ответ;
	КонецЕсли;
	
	
	КлючЗапроса = Строка(Новый УникальныйИдентификатор);
	Ответ.requestKey = КлючЗапроса;
	
	
	МЗ = РегистрыСведений.КодыПодтвержденияВнешнихПользователей.СоздатьМенеджерЗаписи();
	МЗ.Пользователь =  СтруктураПользователя.Пользователь;
	МЗ.КлючЗапроса  =  ПолучитьMD5Строки(КлючЗапроса);
	Код = СформироватьКодПодтверждения();
	
	МЗ.ДатаФормирования =  ТекущаяДата();
	МЗ.Код =  ПолучитьMD5Строки(Код, Истина);
	МЗ.Записать();
	
	Тема = "Запрос на сброс пароля";
	
	ШаблонHTML = ПолучитьОбщийМакет("ПисьмоСбросаПароля").ПолучитьТекст();
	
	ТекстСообщенияHTML = СтрЗаменить(ШаблонHTML, "&КодПодтверждения", Код);
	ТекстСообщенияHTML = СтрЗаменить(ТекстСообщенияHTML, "&ИмяПользователя", ИдентификаторПользователя);
	
	Тема = "Запрос на сброс пароля";
	Авторизация.ОтправитьПользователюПисьмо(ИдентификаторПользователя, ТекстСообщенияHTML, Тема, ТипТекстаПочтовогоСообщения.HTML);
	
	Возврат Ответ;
	
КонецФункции

Функция ПолучитьКлючСменыПароляПоКодуПодтверждения(ИдентификаторПользователя, КлючЗапроса, КодПодтверждения) Экспорт
	
	Ответ = Новый Структура("error, key");
	
	МаксКоличествоПопыток = 3;
	
	
	Если НЕ ЗначениеЗаполнено(ИдентификаторПользователя) Тогда
		Ответ.error = "Не заполнен адрес электронной почты пользователя";
		Возврат Ответ;
	КонецЕсли;
	
	Если НЕ ЗначениеЗаполнено(КлючЗапроса) Тогда
		Ответ.error = "Не заполнен ключ запроса";
		Возврат Ответ;
	КонецЕсли;
	
	Если НЕ ЗначениеЗаполнено(КодПодтверждения) Тогда
		Ответ.error = "Не заполнен код подтверждения";
		Возврат Ответ;
	КонецЕсли;
	
	
	СтруктураПользователя = ПолучитьПользователяПоИдентификатору(ИдентификаторПользователя);
	
	Если ЗначениеЗаполнено(СтруктураПользователя.Ошибка) Тогда
		Ответ.error	= СтруктураПользователя.Ошибка;
		Возврат Ответ;
	КонецЕсли;
	
	КодMD5 = ПолучитьMD5Строки(КодПодтверждения, Истина);
	КлючЗапросаMD5 =  ПолучитьMD5Строки(КлючЗапроса);
	
	
	МЗ = РегистрыСведений.КодыПодтвержденияВнешнихПользователей.СоздатьМенеджерЗаписи();
	МЗ.Пользователь =  СтруктураПользователя.Пользователь;
	МЗ.КлючЗапроса  =  КлючЗапросаMD5;
	МЗ.Прочитать();
	
	Если НЕ МЗ.Выбран() Тогда
		Ответ.error = "Неактуальный запрос";
		Возврат Ответ;
	КонецЕсли;
	
	МЗ.КоличествоПопыток = МЗ.КоличествоПопыток +1;
	МЗ.Записать();
	
	Если  МЗ.КоличествоПопыток>МаксКоличествоПопыток Тогда
		
		Ответ.error = "Превышено количество попыток";	
		Возврат Ответ;
		
	ИначеЕсли  МЗ.ДатаФормирования < ДатаАктуальностиКодаПодтверждения() Тогда
		
		Ответ.error = "Истекло время действия кода подтверждения";
		Возврат Ответ;
		
		
	ИначеЕсли МЗ.Код <> КодMD5 Тогда
		
		Ответ.error = "Неправильный код подтверждения";	   
		Возврат Ответ;
		
	Иначе
		
		Ответ.key = УстановитьКлючСменыПароля(СтруктураПользователя.Пользователь);
		УдалитьКодыПодтвержденияПользователя(СтруктураПользователя.Пользователь);
		Возврат Ответ;
		
	КонецЕсли;
	
	
	
КонецФункции

Функция ПолучитьMD5Строки(Знач Стр, ДвойнойХеш = Ложь)
	
	Хеш = Новый ХешированиеДанных(ХешФункция.MD5);
	Хеш.Добавить(Стр);
	ХешСуммаСтр =  СтрЗаменить(Строка(Хеш.ХешСумма)," ","");
	
	Если ДвойнойХеш Тогда
		ХешСуммаСтр = ПолучитьMD5Строки(ХешСуммаСтр);
	КонецЕсли;
	
	Возврат  ХешСуммаСтр;
	
КонецФункции

Функция ПолучитьПользователяПоИдентификатору(ИдентификаторПользователя)
	
	Результат = Новый Структура("Пользователь, Ошибка","","");
	Пользователь = Справочники.Пользователи.НайтиПоКоду(ИдентификаторПользователя);		
	
	Если Пользователь = Справочники.Пользователи.ПустаяСсылка() Тогда
		Результат.Ошибка	= "В системе не зарегистрирована учетная запись связанная с " + ИдентификаторПользователя;		
	Иначе
		Если ПользовательЗаблокирован(Пользователь) Тогда
			Результат.Ошибка	= "Учетная запись заблокирована";			
		КонецЕсли;
	КонецЕсли;
	
	Результат.Пользователь	= Пользователь;
	Возврат Результат;
	
КонецФункции

Функция ПользовательЗаблокирован(Пользователь)
	
	Возврат Пользователь.ВнешнийПользовательЗаблокирован;
	
КонецФункции

Функция СформироватьКодПодтверждения()
	
	
	ДлинаКода = 6;
	Возврат  Сред(СтрЗаменить(Строка(Новый УникальныйИдентификатор),"-",""),1, ДлинаКода);
	
КонецФункции

Функция ОтправитьПользователюПисьмо(ПочтовыйАдрес, ТекстСообщения, Тема, ТипТекстаПочтовогоСообщения) Экспорт
	
	лУчетнаяЗаписьЭлектроннойПочты =  Справочники.УчетныеЗаписиЭлектроннойПочты.СистемнаяУчетнаяЗаписьЭлектроннойПочты;
	
	лПочта = Новый ИнтернетПочта;
	лПочта.Подключиться(Справочники.УчетныеЗаписиЭлектроннойПочты.СформироватьИнтернетПрофиль(лУчетнаяЗаписьЭлектроннойПочты));
	
	лПисьмо = Новый ИнтернетПочтовоеСообщение;
	лПисьмо.Тема = Тема;
	лПисьмо.Тексты.Добавить(ТекстСообщения, ТипТекстаПочтовогоСообщения);
	
	лПисьмо.Получатели.Добавить(ПочтовыйАдрес);
	лПисьмо.ИмяОтправителя              = лУчетнаяЗаписьЭлектроннойПочты.Наименование;
	лПисьмо.Отправитель.ОтображаемоеИмя = лУчетнаяЗаписьЭлектроннойПочты.Наименование;
	лПисьмо.Отправитель.Адрес           = лУчетнаяЗаписьЭлектроннойПочты.Логин;
	лПочта.Послать(лПисьмо);
	
	
КонецФункции

Функция ДатаАктуальностиКлючей() Экспорт
	
	ВремяЖизниКлючаДней = 7;
	Возврат  НачалоДня(ТекущаяДата()) - ВремяЖизниКлючаДней*86400;
	
КонецФункции

Функция ПолучитьВремяЖизниТокенаСек(ТипТокена) Экспорт
	
	Если ТипТокена  = "accessToken" Тогда		
		Возврат 5;
	ИначеЕсли  ТипТокена  = "refreshToken" Тогда
		 Возврат 864000;
	КонецЕсли;

КонецФункции

Функция ДатаАктуальностиКодаПодтверждения() Экспорт
	
	ВремяЖизниКлючейСек = 1000;
	Возврат  ТекущаяДата()-ВремяЖизниКлючейСек;
	
КонецФункции

Процедура УдалитьКодыПодтвержденияПользователя(Пользователь)
	
	Набор = РегистрыСведений.КодыПодтвержденияВнешнихПользователей.СоздатьНаборЗаписей();
	Набор.Отбор.Пользователь.Установить(Пользователь);
	Набор.Записать();
	
КонецПроцедуры

 Процедура ОтправитьПриглашение(Пользователь) Экспорт
	
	КлючСменыПароля = УстановитьКлючСменыПароля(Пользователь);
	
	АдресПортала = Константы.Ф_АдресПортала.Получить();
	
	Тема = "Доступ в систему " + АдресПортала;
	
	УказательСсылки = АдресПортала + "password-change/"+КлючСменыПароля;
	
	ТекстСообщения = "<html><head></head>
	|<body>
	|<div>Здравствуйте, &ФИО </div>	
	|<div>Вам предоставлен доступ в систему Авторизация</div>
	|<div>Для начальной установки пароля перейдите по ссылке ниже</div>
	|<div><a href=""&УказательСсылки"">&УказательСсылки</a></div></body></html>";
	
	ТекстСообщения = СтрЗаменить(ТекстСообщения,"&УказательСсылки",УказательСсылки);
	ТекстСообщения = СтрЗаменить(ТекстСообщения,"&ФИО",Пользователь.Наименование);
	ОтправитьПользователюПисьмо(СокрЛП(Пользователь.Код), ТекстСообщения, Тема, ТипТекстаПочтовогоСообщения.HTML);
		
КонецПроцедуры                                     

////////////////////////////////////////////////////////////////////////////////////////
Function Encode(Val SecretKey, Val Payload = Undefined, Val ExtraHeaders = Undefined) Export
	
	If Payload = Undefined Then
		Payload = New Structure;
	EndIf;
	
	header = New Structure;
	header.Insert("typ", "JWT");
	header.Insert("alg", "HS256");
	If ExtraHeaders <> Undefined Then
		For Each eh In ExtraHeaders Do
			header.Insert(eh.Key, eh.Value);
		EndDo;	
	EndIf;
	
	headerBytes = GetBinaryDataFromString(ComposeJSON(header));
	payloadBytes = GetBinaryDataFromString(ComposeJSON(Payload));
	
	segments = New Array;
	segments.Add(Base64UrlEncode(headerBytes));
	segments.Add(Base64UrlEncode(payloadBytes));
	
	stringToSign = StrConcat(segments, ".");
	
	signature = HMAC(
	GetBinaryDataFromString(SecretKey),
	GetBinaryDataFromString(stringToSign),
	HashFunction.SHA256);
	
	segments.Add(Base64UrlEncode(signature));
	
	res = StrConcat(segments, ".");
	
	
	//res = СтроковыеФункцииКлиентСервер.ПолучитьСтрокуИзМассиваПодстрок(segments, ".");
	
	Return res;
	
EndFunction

//Функция StrConcat(Массив, Разделитель)
//	
//	Возврат СтроковыеФункцииКлиентСервер.ПолучитьСтрокуИзМассиваПодстрок(Массив, Разделитель);
//	
//КонецФункции

//Функция StrSplit(Строка, Разделитель)
//	
//	Возврат СтроковыеФункцииКлиентСервер.РазложитьСтрокуВМассивПодстрок(Строка, Разделитель, Истина);
//	
//КонецФункции

Function Decode(Val Token, Val SecretKey, Val Verify = True) Export
	
	parts = StrSplit(Token, ".");
	If parts.Count() <> 3 Then
		Raise "JWT.Decode: Token must consist from 3 delimited by dot parts";
	EndIf;
	
	header = parts[0];
	payload = parts[1];
	crypto = Base64UrlDecode(parts[2]);
	
	headerJson = GetStringFromBinaryData(Base64UrlDecode(header));
	payloadJson = GetStringFromBinaryData(Base64UrlDecode(payload));
	
	headerData = ParseJSON(headerJson);
	payloadData = ParseJSON(payloadJson);
	
	If Verify Then
		If headerData.Property("alg") Then
			If headerData.alg <> "HS256" Then
				Raise "JWT.Decode: unsopported algorithm: " + headerData.alg;
			EndIf;
		Else
			Raise "JWT.Decode: header doesn't contain field 'alg'";
		EndIf;
		
		signature = HMAC(
		GetBinaryDataFromString(SecretKey),
		GetBinaryDataFromString(header + "." + payload),
		HashFunction.SHA256);
		
		If Base64String(crypto) <> Base64String(signature) Then
			Raise "JWT.Decode: Invalid signature";
		EndIf;
		
	EndIf;
	
	Return payloadData;
	
EndFunction

Function Base64UrlEncode(Val input)
	
	output = Base64String(input);
	output = StrSplit(output, "=")[0]; // Remove any trailing '='s
	output = StrReplace(output, Chars.CR + Chars.LF, "");
	output = StrReplace(output, "+", "-"); // 62nd char of encoding
	output = StrReplace(output, "/", "_"); // 63rd char of encoding
	Return output;
	
EndFunction

Function Base64UrlDecode(Val input)
	
	res = input;
	res = StrReplace(input, "-", "+"); // 62nd char of encoding
	res = StrReplace(res, "_", "/"); // 63rd char of encoding
	m = StrLen(res) % 4;
	If m = 1 Then
		Raise "JWT.Base64UrlDecode: Illegal base64url string: " + input;
	ElsIf m = 2 Then
		res = res + "=="; // Two pad chars
	ElsIf m = 3 Then
		res = res + "="; // One pad char
	EndIf;
	return Base64Value(res);
	
EndFunction

Function ComposeJSON(Obj, LineBreak = Undefined) Export
	
	If Not ValueIsFilled(Obj) Then
		Return "";
	EndIf;
	
	If LineBreak = Undefined Then
		LineBreak = JSONLineBreak.None;
	EndIf;
	
	JSONWriter = New JSONWriter;
	Settings = New JSONWriterSettings(LineBreak);
	JSONWriter.SetString(Settings);
	WriteJSON(JSONWriter, Obj);
	Return JSONWriter.Close();
	
EndFunction

Function ParseJSON(Json) Export
	
	If Not ValueIsFilled(Json) Then
		Return Undefined;
	EndIf;
	
	JSONReader = New JSONReader;
	JSONReader.SetString(Json);
	Return ReadJSON(JSONReader, False);
	
EndFunction

Procedure Test() Export
	
	SecretKey = "secret";
	Payload = New Structure;
	Payload.Insert("sub", "1234567890");
	Payload.Insert("name", "John Doe");
	Payload.Insert("admin", True);
	
	Token = Encode(SecretKey, Payload);
	
	DecodedPayload = Decode(Token, SecretKey);
	
EndProcedure


// Computes a Hash-based Message Authentication Code (HMAC)
// RFC 2104 https://www.ietf.org/rfc/rfc2104.txt
//
// Parameters:
//  Key			- BinaryData	- the key to use in the hash algorithm
//  Message		- BinaryData	- the input to compute the hash code for
//  HashFunc	- HashFunction	- the name of the hash algorithm to use for hashing
// 
// Returns:
//  BinaryData - The computed hash code
//

Function HMAC(Val SecretKey, Val Message, Val HashFunc) Export
	
	CheckHashFuncIsSupported(HashFunc);
	
	BlSz = 64;
	
	If SecretKey.Size() > BlSz Then
		SecretKey = Hash(SecretKey, HashFunc);
	EndIf;
	
	EmptyBin = GetBinaryDataFromString("");
	SecretKey = BinLeft(SecretKey, BlSz);
	
	Ê0 = BinRightPad(SecretKey, BlSz, "0x00");
	
	ipad = BinRightPad(EmptyBin, BlSz, "0x36");
	k_ipad = BinBitwiseXOR(Ê0, ipad);
	
	opad = BinRightPad(EmptyBin, BlSz, "0x5C");
	k_opad = BinBitwiseXOR(Ê0, opad);
	
	k_ipad_Message = BinConcat(k_ipad, Message);
	k_opad_Hash = BinConcat(k_opad, Hash(k_ipad_Message, HashFunc));
	res = Hash(k_opad_Hash, HashFunc);
	
	Return res;
	
EndFunction

Procedure CheckHashFuncIsSupported(HashFunc)
	
	If HashFunc <> HashFunction.MD5 And	HashFunc <> HashFunction.SHA1 And HashFunc <> HashFunction.SHA256 Then
		Raise "HMAC: unsupported hash function: " + HashFunc;
	EndIf;
	
EndProcedure

Function BinLeft(Val BinaryData, Val CountOfBytes)
	
	DataReader = New DataReader(BinaryData);
	
	MemoryStream = New MemoryStream();
	DataWriter = New DataWriter(MemoryStream);
	
	Buffer = DataReader.ReadIntoBinaryDataBuffer(CountOfBytes);
	DataWriter.WriteBinaryDataBuffer(Buffer);
	
	Return MemoryStream.CloseAndGetBinaryData();
	
EndFunction

Function BinRightPad(Val BinaryData, Val Length, Val HexString)
	
	PadByte = NumberFromHexString(HexString);
	
	DataReader = New DataReader(BinaryData);
	
	MemoryStream = New MemoryStream();
	DataWriter = New DataWriter(MemoryStream);
	
	Buffer = DataReader.ReadIntoBinaryDataBuffer();
	If Buffer.Size > 0 Then
		DataWriter.WriteBinaryDataBuffer(Buffer);
	EndIf;
	
	For n = Buffer.Size + 1 To Length Do
		DataWriter.WriteByte(PadByte);
	EndDo;
	
	Return MemoryStream.CloseAndGetBinaryData();
	
EndFunction

Function BinBitwiseXOR(Val BinaryData1, Val BinaryData2)
	
	MemoryStream = New MemoryStream();
	DataWriter = New DataWriter(MemoryStream);
	
	DataReader1 = New DataReader(BinaryData1);
	DataReader2 = New DataReader(BinaryData2);
	
	Buffer1 = DataReader1.ReadIntoBinaryDataBuffer();
	Buffer2 = DataReader2.ReadIntoBinaryDataBuffer();
	
	If Buffer1.Size > Buffer2.Size Then
		Buffer1.WriteBitwiseXor(0, Buffer2, Buffer2.Size);
		DataWriter.WriteBinaryDataBuffer(Buffer1);
	Else 
		Buffer2.WriteBitwiseXor(0, Buffer1, Buffer1.Size);
		DataWriter.WriteBinaryDataBuffer(Buffer2);
	EndIf;
	
	res = MemoryStream.CloseAndGetBinaryData();
	Return res;
	
EndFunction

Function Hash(Val Value, Val HashFunc) Export
	DataHashing = New DataHashing(HashFunc);
	DataHashing.Append(Value);
	Return DataHashing.HashSum;
EndFunction

Function BinConcat(Val BinaryData1, Val BinaryData2)
	
	MemoryStream = New MemoryStream();
	DataWriter = New DataWriter(MemoryStream);
	
	DataReader1 = New DataReader(BinaryData1);
	DataReader2 = New DataReader(BinaryData2);
	
	Buffer1 = DataReader1.ReadIntoBinaryDataBuffer();
	Buffer2 = DataReader2.ReadIntoBinaryDataBuffer();
	
	DataWriter.WriteBinaryDataBuffer(Buffer1);
	DataWriter.WriteBinaryDataBuffer(Buffer2);
	
	res = MemoryStream.CloseAndGetBinaryData();
	Return res;
	
EndFunction