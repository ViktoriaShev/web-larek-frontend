# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:

- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:

- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/styles/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск

Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```

## Сборка

```
npm run build
```

или

```
yarn build
```

##Архитектура

При проектировании архитектуры используется паттерн MVP. Презентером, управляющим всеми событиями проекта, является класс EventEmitter. В модуле-точке входа в проект index.ts вызывается на выполнение метод on класса EventEmitter с различными аргументами - именем события и функцией-слушателем события, в результате чего происходит подписка этой функции-слушателя на указанное событие.

# Типы и интерфейсы модели данных

В коде определены различные типы и интерфейсы, которые используются в модели данных.

1. type ProductStatus: тип, который может принимать одно из двух значений: 'active' или 'inBasket'. Он используется для указания статуса продукта.

2. interface IProduct: интерфейс определяет структуру объекта продукта. Он содержит следующие свойства:
   id: уникальный идентификатор продукта типа string.

   description: описание продукта типа string.

   image: ссылка на изображение продукта типа string.

   title: название продукта типа string.

   category: категория продукта типа string.

   price: цена продукта типа number.

3. interface IAppState определяет структуру объекта состояния приложения. Он содержит следующие свойства:

   catalog: массив продуктов типа IProduct[].

   preview: ссылка на превью продукта типа string или null.

   order: объект заказа типа IOrder или null.

4. IOrderFormPersonalData и IOrderFormPayMethodAddress определяют структуру данных для формы персональных данных и формы выбора метода оплаты и адреса соответственно. Они содержат свойства, такие как email, phone, payment и address, с соответствующими типами данных(string).

5. type OrderForm представляет объединение интерфейсов IOrderFormPersonalData и IOrderFormPayMethodAddress. Он используется для определения типа данных, ожидаемых в форме заказа.

6. interface IOrder определяет структуру объекта заказа. Он расширяет тип OrderForm и добавляет дополнительные свойства:

   items: массив идентификаторов продуктов в заказе типа string[].

   total: общая стоимость заказа типа number.

7. type FormErrors представляет собой частичный объект, где ключами являются свойства объекта IOrder, а значениями являются строки ошибок. Он используется для отображения ошибок в форме.

8. interface IOrderResult определяет структуру объекта результата заказа. Он содержит свойство id, которое представляет собой уникальный идентификатор заказа типа string.

# Базовый код

1. class Api
   type ApiListResponse<Type> - oбобщенный тип, представляющий ответ API, содержащий общее количество элементов и массив элементов указанного типа.
   type ApiListResponse<Type> - тип, представляющий разрешенные методы HTTP-запросов - 'POST', 'PUT' или 'DELETE'.

   Класс Api имеет 2 параметра, конструктор и 2 метода:

   baseUrl: Строка, представляющая базовый URL для всех запросов.

   options: Объект RequestInit, содержащий настройки запроса по умолчанию.

   Конструктор класса Api, принимает базовый URL и настройки запроса.

   handleResponse(response: Response): Promise<object>: Метод для обработки ответа от сервера. Если ответ успешный, возвращает промис с объектом JSON. Если ответ содержит ошибку, возвращает промис с ошибкой.

   get(uri: string): Метод для выполнения GET-запроса по указанному URI. Возвращает промис с объектом JSON.

   post(uri: string, data: object, method: ApiPostMethods = 'POST'): Метод для выполнения POST-запроса по указанному URI с переданными данными. По умолчанию используется метод 'POST', но можно указать другой метод. Возвращает промис с объектом JSON.

2. class EventEmitter
   Класс реализует патерн "EventEmitter и работает как брокер событий

   Типы в классе:

   EventName: Тип, представляющий имя события, которое может быть строкой или регулярным выражением.

   Subscriber: Тип, представляющий функцию-подписчика на событие.

   EmitterEvent: Тип, представляющий объект события, содержащий имя события и данные неизвестного типа.

   Интерфейс IEvents:

   on<T extends object>(event: EventName, callback: (data: T) => void): void: Метод для подписки на событие. Принимает имя события и функцию обратного вызова, которая принимает данные события типа T.

   emit<T extends object>(event: string, data?: T): void: Метод для генерации события. Принимает имя события и необязательные данные события типа T.

   trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void: Метод для создания триггера, который генерирует событие при вызове. Принимает имя события и необязательный контекст типа Partial<T>. Возвращает функцию, которая принимает данные события типа T и генерирует событие с объединенными данными и контекстом.

   Класс EventEmitter:

   Методы класса:

   on<T extends object>(eventName: EventName, callback: (event: T) => void): Метод для подписки на событие. Создает новый сет подписчиков для указанного события и добавляет в него функцию обратного вызова.

   off(eventName: EventName, callback: Subscriber): Метод для отписки от события. Удаляет указанного подписчика из сета подписчиков для указанного события. Если после удаления сет становится пустым, удаляет его из \_events.

   emit<T extends object>(eventName: string, data?: T): Метод для генерации события. Перебирает все события в \_events и вызывает всех подписчиков, чье имя события соответствует указанному имени или регулярному выражению.

   onAll(callback: (event: EmitterEvent) => void): Метод для подписки на все события. Вызывает метод on с именем события "\*", что позволяет подписаться на все события.

   offAll(): Метод для отписки от всех событий. Просто переинициализирует \_events пустой мапой.
   данными и контекстом.

3. abstract class Component<T>
   Класс Component<T> является абстрактным и предоставляет инструментарий для работы с DOM в дочерних компонентах.

   container: Защищенное свойство, представляющее корневой элемент компонента.

   constructor(container: HTMLElement): Конструктор класса Component, принимает контейнерный элемент компонента.

   Методы класса:

   toggleClass(element: HTMLElement, className: string, force?: boolean): Метод для переключения класса у элемента.

   setText(element: HTMLElement, value: unknown): Метод для установки текстового содержимого элемента.

   setDisabled(element: HTMLElement, state: boolean): Метод для изменения состояния блокировки элемента.

   setHidden(element: HTMLElement): Метод для скрытия элемента.

   setVisible(element: HTMLElement): Метод для отображения элемента.

   setImage(element: HTMLImageElement, src: string, alt?: string): Метод для установки изображения с альтернативным текстом.

   render(data?: Partial<T>): HTMLElement: Метод для отрисовки компонента. Принимает необязательные данные типа Partial<T>, которые могут быть присвоены свойствам компонента. Возвращает корневой элемент компонента.

4. abstract class Model -
   это класс нужен для связи классов модели данных с классом EventEmitter, который реализует паттерн «Наблюдатель» и позволяет подписываться на события и уведомлять подписчиков о наступлении события.

   Функция isModel:
   Это функция, которая принимает аргумент типа unknown и возвращает булево значение, указывающее, является ли объект экземпляром класса Model<any>.

   Класс Model<T>:

   Конструктор класса:
   Конструктор класса принимает частичные данные типа T и защищенное свойство events типа IEvents. Метод Object.assign(this, data) используется для копирования свойств из объекта data в текущий объект.

   Методы класса:
   Метод emitChanges предназначен для сообщения всем подписчикам, что модель изменилась. Он генерирует событие с указанным именем и данными, используя свойство events.

# Компоненты модели данных

1. class ProductItem
   Класс ProductItem представляет модель продукта и наследуется от абстрактного класса Model<IProduct>.

   Свойства класса:

   category: Строка, представляющая категорию продукта.

   description: Строка, содержащая описание продукта.

   id: Строка, представляющая идентификатор продукта.

   image: Строка, содержащая путь к изображению продукта.

   title: Строка, представляющая название продукта.

   price: Число, представляющее цену продукта.

   \_status: Защищенное свойство, представляющее статус продукта.

   Методы класса:

   status: Геттер и сеттер для свойства \_status, предоставляющие доступ к статусу продукта.

   labelPrice: Метод, возвращающий строку, представляющую цену продукта вместе с единицей измерения.

2. class AppState
   Класс AppState представляет собой основную модель данных приложения, работает только с данными и наследуется от абстрактного класса Model<AppState>.

   Свойства класса:

   catalog: Массив элементов типа ProductItem, представляющий каталог продуктов.

   order: Объект, представляющий заказ, содержащий информацию о почте, телефоне, адресе, способе оплаты, выбранных товарах и общей сумме.

   preview: Строка или null, представляющая идентификатор предпросмотра продукта.

   formErrors: Объект, представляющий ошибки формы.

   Методы класса:

   setCatalog(items: ProductItem[], status: ProductStatus = 'active'): Метод для установки каталога продуктов. Принимает массив элементов ProductItem и статус продукта. Создает новые экземпляры ProductItem с указанным статусом и устанавливает их в каталог. Затем генерирует событие об изменении каталога.

   changeCatalog(item: ProductItem, status: ProductStatus): Метод для изменения статуса продукта в каталоге. Изменяет статус указанного продукта и генерирует событие об изменении каталога.

   toggleOrderedProduct(item: ProductItem): Метод для переключения выбранного продукта в заказе. Если продукт уже в заказе, удаляет его, в противном случае добавляет.

   getProductInBasket(): Метод для получения продуктов, находящихся в корзине.

   clearBasket(): Метод для очистки корзины. Удаляет все продукты из заказа, сбрасывает их статусы в каталоге а также для каждой картоки, которая была в заказе вызывает событие "item:changed", тем самым обновляя их в каталоге.Также вызывает событие "basket:changed", которое обновляет корзину.

   getTotal(): Метод для вычисления общей суммы заказа.

   setPreview(item: IProduct): Метод для установки предпросмотра продукта. Устанавливает идентификатор продукта в предпросмотре и генерирует событие об изменении предпросмотра.

   setOrderField(field: keyof (IOrderFormPayMethodAddress & IOrderFormPersonalData), value: string): Метод для установки значения поля заказа. Проверяет тип поля и вызывает соответствующий метод валидации.

   validateOrder(): Метод для валидации заказа. Проверяет адрес доставки и способ оплаты, устанавливает ошибки формы и генерирует событие об изменении ошибок формы.

   validateContact(): Метод для валидации контактной информации. Проверяет электронную почту и телефон, устанавливает ошибки формы и генерирует событие об изменении ошибок формы.

3. class LarekAPI
   Класс LarekAPI является реализацией интерфейса ILarekAPI и расширяет класс Api

   Интерфейс ILarekAPI:

   getProductList: Метод, возвращающий промис с массивом элементов типа IProduct, представляющий список продуктов.

   getProductItem: Метод, принимающий идентификатор id в качестве параметра и возвращающий промис с элементом типа IProduct, представляющий конкретный продукт.

   orderItems: Метод, принимающий объект order в качестве параметра и возвращающий промис с объектом типа IOrderResult, представляющий результат заказа.

   Класс LarekAPI:

   Свойство класса:

   cdn: Свойство только для чтения, представляющее URL контентного доставчика (CDN).

   constructor(cdn: string, baseUrl: string, options?: RequestInit): Конструктор, который инициализирует свойство cdn и вызывает конструктор класса Api с указанными baseUrl и options.

   Методы класса:

   getProductItem(id: string): Метод, который выполняет GET-запрос для получения конкретного продукта по его идентификатору id. Затем модифицирует полученный элемент, добавляя URL CDN к пути изображения, и возвращает модифицированный элемент.

   getProductList(): Метод, который выполняет GET-запрос для получения списка продуктов.

   orderItems(order: IOrder): Метод, который выполняет POST-запрос для размещения заказа с использованием переданного объекта order и возвращает результат заказа.

# Классы компонентов представления, классы для глобальных переменных

1. class Page
   Класс Page расширяет класс Component. Он включает свойства и методы для управления элементами страницы и их взаимодействиями.

   Класс реализует интерфейс IPage, который определяет структуру данных страницы.

   Свойства класса:

   \_counter: защищенное свойство, которое содержит элемент разметки, представляющий собой счетчик, который отражает количество продуктов в корзине.

   \_catalog: защищенное свойство, которое содержит элемент разметки,представляющий собой контейнер, где располагаются карточки товаров.

   \_wrapper: защищенное свойство, которое представляет собой элемент страницы, который обертывает другие элементы и служит контейнером для них.

   \_basket: защищенное свойство, коротое представляет собой элемент страницы: иконку корзины. Оно используется для обработки событий, связанных с корзиной: при клике на элемент корзины, генерируется событие "basket:open" с помощью объекта events.

   Конструктор принимает элемент container и объект events в качестве параметров. Он инициализирует свойства, выбирая конкретные элементы внутри контейнера с помощью утилитной функции ensureElement. Также в классе добавляется слушатель на свойство \_basket, который при срабатывании, инициализирует событие 'basket:open'

   Методы класса:

   Методы-аксессоры set (counter, catalog и locked) используются для обновления элементов страницы на основе предоставленных данных.

   Аксессор counter обновляет текстовое содержимое счетчика.

   Аксессор catalog заменяет дочерние элементы элемента каталога.

   Аксессор locked добавляет или удаляет CSS-класс в зависимости от предоставленного логического значения.

   Метод updateCatalogItem(): метод принимает индекс карточки и готовый HTML-елемент карточки и с помощью метода replaceChild на странице обновляется карточка.

2. class Modal
   Класс, который также расширяет класс Component. Он предоставляет функциональность для работы с модальным окном на веб-странице.

   Свойства класса:

   \_closeButton: защищенное свойство, в котором храниться элемент разметки - кнопка закрытия у модального окна;
   protected \_content: защищенное свойство, представляющее собой контейнер для отображения контента в модальном окне.

   В конструкторе класса добавляются слушатели клика на свойства \_closeButton, container, \_content, которые в случае срабатывания у \_closeButton и container вызывают метод close(), а у \_content метод stopPropagation предотвращают дальнейшую передачу события вверх по иерархии элементов (прекращает всплытие события).

   Методы класса:

   Свойство content является аксессором, который позволяет устанавливать содержимое модального окна. Оно заменяет дочерние элементы \_content на переданное значение.

   open(): метод открывает модальное окно. Метод open добавляет CSS-класс modal_active к контейнеру модального окна и генерирует событие "modal:open" с помощью объекта events.

   clode(): метод закрывает модальное окно соответственно. Метод удаляет CSS-класс modal_active из контейнера модального окна, очищает содержимое \_content и генерирует событие "modal:close".

   render(): Метод render переопределяет метод render из класса Component и вызывает метод open после рендеринга компонента.

# Классы компонентов представления, компонент карточки продукта

Компоненты карточки отражают информацию о продукте в разных частях приложения, классы CardOpened и CardBasket дополняют родительский класс новыми свойствами и методами. Эта связь родительского и дочерних классов нужна потому, что дочерним классам необходимы те же методы и те же свойства, что имеет родительский, а также они получают одинаковые данные для отображения.

1. Card

   Интерфейс ICardActions

   Интерфейс ICardActions определяет структуру объекта, который может содержать обработчик события onClick. Обработчик onClick принимает два параметра: событие MouseEvent и необязательные данные типа ProductItem.

   Интерфейс ICard

   Интерфейс ICard определяет структуру объекта, который представляет карточку. Он включает следующие свойства:

   title: строка, представляющая заголовок карточки.

   description(необязательное): строка или массив строк, представляющих описание карточки.

   image(необязательное): строка, представляющая путь к изображению карточки.

   category(необязательное): строка, представляющая категорию карточки.

   price: число, представляющее цену карточки.

   labelPrice: строка, представляющая метку цены карточки.

   Класс Card
   Класс отвечает за отображение в каталоге товаров. Он расширяет класс Component и принимает параметры blockName, container и actions в конструкторе.

   Защищенные свойства класса Card:

   \_title, \_image, \_description, \_button, \_category и \_labelPrice, которые представляют соответствующие элементы карточки.

   В конструкторе класса инициализируются защищенные свойства класса, а также добавляется слушатель события 'click' на контейнер карточки, в случае срабатывания, вызывается переданная функция onClick

   Методы класса:

   Класс Card имеет геттеры и сеттеры для каждого свойства, которые позволяют получать и устанавливать значения свойств карточки.

   Метод set id(value: string) устанавливает значение атрибута data-id контейнера карточки.

   Метод get id(): string возвращает значение атрибута data-id контейнера карточки.

   Методы set title(value: string), set image(value: string), set category(value: string), set labelPrice(value: string) устанавливают соответствующие значения элементов карточки.

   Методы get title(): string, get category(): string, get labelPrice(): string возвращают соответствующие значения элементов карточки.

2. class CardOpened
   Класс CardOpened расширяет функциональность класса Card, добавляя возможность управления открытой карточкой, включая текст кнопки добавление карточки в корзину и описание продукта.

   Защищенные свойства класса CardOpened:

   \_button: свойство, которое хранит кнопку у карточки, которая отвечает за добавление продукта в корзину.

   \_description: совйство, отвечающее за описание товара.

   Конструктор класса CardOpened принимает параметры blockName, container и actions. Он вызывает конструктор родительского класса Card и инициализирует защищенные свойства \_button и \_description с помощью функции ensureElement. Также в конструкторе добавляется слушатель события "click" на кнопку \_button и в случае срабатывания, вызывается функция onClick.

   Методы класса:

   Метод set button(value: string) устанавливает текст и состояние кнопки на основе переданного значения. Если значение равно 'inBasket', то текст кнопки будет "В корзине" и кнопка будет отключена. В противном случае, текст кнопки будет "В корзину" и кнопка будет активна.

   Метод get description(): string возвращает текстовое содержимое элемента \_description.

   Метод set description(value: string | string[]) устанавливает текстовое содержимое элемента \_description на основе переданного значения.

3. CardBasket
   Класс CardBasket расширяет функциональность класса Card, предоставляя возможности для работы с карточкой в корзине.

   Защищенные свойства класса CardBasket:
   \_buttonDelete: свойство, которое хранит кнопку удаление карточки из корзины.

   \_title и \_price: свойства, которые хранят элементы, которые отображаются в карточке в корзине.

   Конструктор класса CardBasket принимает параметры container и actions. Он вызывает конструктор родительского класса Card и инициализирует защищенное свойство \_buttonDelete с помощью функции ensureElement. Если передан обработчик события onClick в параметре actions, то устанавливается обработчик события click на элемент \_buttonDelete.

# Классы компонентов представления, компоненты формы

1. abstract class Form
   Абстрактный класс предоставляет базовую функциональность для работы с формами, расширяя класс компонент.

   свойство класса:

   \_errors: свойство является защищенным, оно представляет собой элемент HTML, который используется для отображения ошибок в форме.

   constructor(container: HTMLFormElement, events: IEvents): Конструктор класса принимает контейнерный элемент формы container и объект событий events в качестве параметров. Он вызывает конструктор родительского класса Component и инициализирует защищенное свойство \_errors с помощью функции ensureElement. Затем устанавливает обработчик события input на контейнерной форме, который вызывает метод onInputChange при изменении ввода.

   Методы класса:

   protected onInputChange<T>(field: keyof T, value: string): Метод onInputChange принимает поле field и его значение value в качестве параметров. Он использует объект событий events для генерации события изменения значения поля формы, передавая имя поля и его значение.

   set errors(value: string): Сеттер errors устанавливает текст ошибок в элементе \_errors с помощью метода setText.

   render(state: Partial<T> & IFormState): Метод render принимает частичное состояние формы state, которое включает флаг valid, массив errors и другие свойства формы. Он вызывает метод super.render родительского класса Component, передавая флаг valid и массив errors. Затем использует Object.assign для присвоения оставшихся свойств из state экземпляру класса Form.

2. class FormPersonalData
   Класс расширяет абстрактный класс Form и предоставляет реализацию формы для работы окном заполнения персональных данных, включая установку состояния доступности кнопки отправки формы в зависимости от валидности данных.

   Свойство класса:

   \_submit: свойство, которое хранит кнопку отправки формы.

   constructor(container: HTMLFormElement, events: IEvents): Конструктор класса принимает контейнерный элемент формы container и объект событий events в качестве параметров. Он вызывает конструктор родительского класса Form и инициализирует защищенное свойство \_submit с помощью функции ensureElement. Затем устанавливает обработчик события submit на контейнерной форме, который предотвращает отправку формы и генерирует событие submit с помощью объекта событий events.

   Метод класса:

   set valid(value: boolean): Сеттер valid устанавливает состояние доступности кнопки отправки формы \_submit. Если значение valid равно true, то кнопка становится доступной, а если значение valid равно false, то кнопка становится недоступной.

3. class FormPayMethodAddres
   Класс FormPayMethodAddress является расширением класса Form и добавляет дополнительные свойства и функциональность для работы с формой выбора метода оплаты и адреса.

   Свойства класса:

   \_further: свойство хранит кнопку "Далее" в разметке

   \_ payMethods: свойство хранит массив кнопок, которые отвечают за выбор способа оплаты.

   constructor(container: HTMLFormElement, events: IEvents): Конструктор класса принимает контейнерный элемент формы container и объект событий events в качестве параметров. Он вызывает конструктор родительского класса Form и инициализирует защищенные свойства \_further и \_payMethods с помощью функции ensureElement и ensureAllElements соответственно. Затем устанавливает обработчики событий click на элементы \_payMethods и \_further.
   После клика на элемент из списка \_payMethods генерируется событие выбора способа оплаты.
   После клика на элемент \_further генерируется событие, отвечающее за открытие новой формы Contact

   Метод класса:

   set valid(value: boolean): Сеттер valid устанавливает состояние доступности кнопки "Далее" \_further. Если значение valid равно true, то кнопка становится доступной, а если значение valid равно false, то кнопка становится недоступной.

4. class Order
   Класс Order является расширением класса FormPayMethodAddress и добавляет дополнительные свойства и функциональность для работы с формой заказа.

   constructor(container: HTMLFormElement, events: IEvents): Конструктор класса принимает контейнерный элемент формы container и объект событий events в качестве параметров. Он вызывает конструктор родительского класса FormPayMethodAddress с помощью ключевого слова super, передавая ему контейнер и события.

   Методы класса:

   set payment(on: string): Сеттер payment устанавливает активное состояние кнопки оплаты, указанной в параметре on. Он добавляет класс button_alt-active к кнопке с помощью метода classList.add.

   set address(value: string): Сеттер address устанавливает значение адреса в поле ввода с именем address. Он устанавливает значение поля ввода с помощью свойства value.

   setPayMethod(on: string, off: string): Метод setPayMethod устанавливает активное состояние кнопки оплаты, указанной в параметре on, и отключает активное состояние кнопки оплаты, указанной в параметре off. Он добавляет класс button_alt-active к кнопке on и удаляет класс button_alt-active у кнопки off.

5. class Contact
   Класс Contact является расширением класса FormPersonalData и добавляет дополнительные свойства и функциональность для работы с формой контактной информации.

   constructor(container: HTMLFormElement, events: IEvents): Конструктор класса принимает контейнерный элемент формы container и объект событий events в качестве параметров. Он вызывает конструктор родительского класса FormPersonalData с помощью ключевого слова super, передавая ему контейнер и события.

   Методы класса:

   set phone(value: string): Сеттер phone устанавливает значение телефонного номера в соответствующем поле ввода. Он находит элемент с именем phone в контейнере формы и устанавливает его значение равным переданному значению.

   set email(value: string): Сеттер email устанавливает значение электронной почты в соответствующем поле ввода. Он находит элемент с именем email в контейнере формы и устанавливает его значение равным переданному значению.

# Классы компонентов представления, отрисовка корзины и окна, подтверждающего успех операции

1. class Basket
   Класс Basket наследует класс Component и отвечает за отображение и взаимодействие с корзиной.

   Интерфейс IBasketView:

   items: Массив HTMLElement, представляющий элементы карточек в корзине.

   total: Число, представляющее общую стоимость элементов в корзине.

   Класс Basket

   Свойства класса:

   \_list: свойство, представляющее HTML-элемент, содержащий список элементов в корзине.

   \_total: свойство представляющее HTML-элемент, отображающий общую стоимость элементов в корзине.

   \_button: свойство, представляющее HTML-элемент для кнопки заказа.

   Конструктор принимает параметры: container: HTMLElement, events: EventEmitter и инициализирует и настраивает необходимые элементы и обработчики событий для представления корзины, такие как список элементов, общая стоимость и кнопка заказа. Если кнопка заказа существует, к ней присоединяется обработчик событий, который генерирует событие 'order:open' при щелчке на кнопке.

   Методы класса:

   set items(items: HTMLElement[]): Устанавливает элементы в представлении корзины. Если есть элементы, он заменяет существующие элементы в списке новыми элементами; в противном случае отображается сообщение о том, что корзина пуста.

   set total(total: number): Устанавливает и отображает общую стоимость элементов в корзине.

   set button(value: boolean): устанавливает состояние кнопки.

2. class Success
   Класс Success наследует класс Component и предназначен для отображения экрана успешного завершения заказа.

   Интерфейс ISuccess описывает представление для класса Success и содержит свойство total.

   Интерфейс ISuccessActions описывает действия, которые могут быть выполнены на странице успеха.

   Свойства класса:

   \_close: свойство, передающее кнопку, которая закрывает модальное окно.

   \_description: свойство, которое передает описание покупки.

   Конструктор инициализирует элементы \_close и \_description для отображения сообщения об успехе и кнопки закрытия. Также на свойство \_close навешиваем обработчик событий, который генерирует событие, которое закрывает модальное окно.

   Метод класса:

   Метод set description устанавливает текст сообщения об успешном списании средств.

# Главный файл src/index.ts, который является точкой входа приложения, связывает компоненты представления и модели данный

Здесь описываются обработчики событий, которые отвечают за различные аспекты взаимодействия пользователя с приложением, такие как отправка заказа, управление корзиной, отображение информации о товарах и управление модальными окнами.

1. Запрос на получение списка товаров с сервера: с помощью класса api и метода getProductList() подается get запрос на получение данных о карточках каталога. Затем с помощью метода setCatalog() класса appData эти данные сохраняются и генерируется событие 'items:changed'.
2. Обработчик события 'items:changed': когда происходит это событие, формируются представители класса Card и получив данные с сервера, отображают карточки продуктов в каталоге(page.catalog). Также отображается счетчик с колличеством товаров в корзине.Также устанавливаю состояние кнопки "Оформить" в корзине.
3. Обработчик события 'item:changed': Это событие происходит, когда карточку продукта добавляют или удаляют из корзины, в обработчике формируется экземпляр класса Card, находится индекс данных об этой карточке и в классе Page по индексу находится выбранная карточка отрисовывается.
4. Обработчик события 'card:select': при наступлении данного события в модель данных поступает экземпляр класса ProductItem и вызывается метод, который установливает предпросмотр продукта
5. Обработчик события 'preview:changed': при наступлении события происходит получение информации о товаре с сервера, создается экземпляр класса CardOpened и рендерится открытая карточка в модальном окне.
6. Обработчики событий 'modal:open' и 'modal:close': при открытии модального окна устанавливается блокировка страницы, а при закрытии модального окна страница разблокируется.
7. Обработчик события 'basket:changed': при добавлении или удалении товара в корзину или при клике на иконку корзины вызывается обработчик этого события. Если с вызовом события потупили данные о карточке, то данные в модели обновляются. Также обновляется массив карточек в корзине, для отображения создаются экземпляры класса CardBasket, затем они рендерятся. Затем обновляется счетчик количества товаров и сумма заказа. Последним шагом устанавливаю состояние кнопки "Оформить" в корзине.
8. Обработчик события 'card:delete': при вызове этого события, карточка из корзины удаляется. При этом вызывается методы changeCatalog и toggleOrderedProduct, которые удаляют данные карточки из списков заказа и меняют статус. Также вызывается событие 'basket:changed'.
9. Обработчик события 'basket:open': при срабатывании события открывается модальное окно modal.render() и в нем рендерится содержимое корзины basket.render()
10. Обработчик события 'order:open': cобытие происходит при клике кнопки "Оформить". Перед вызовом компоненты представления modal и его метода render проверяется, есть ли данные о карточках в корзине с помощью метода модели данных getProductInBasket
11. Обработчик события 'order:click-button_alt': при срабатывании этого события меняется вид выбранной пользователем кнопки способы оптаты с помощью вызова метода order.setPayMethod и обновление данных в моделе.
12. Обработчик события 'contact:open': при срабатывании события с помощью экземпляра класса modal и метода render окрывается форма(также рендерится)для заполения контактных данных.
13. Обработчик события /^(order)?(contacts)?\..\*:change/: это регулярное выражение принимает либо 'order\. change' либо 'contacts\. change'. Это событие происходит при изменении любого поля ввода в формах, при этом вызывается метод setOrderField для установки значения поля заказа и проверки полей на валидность.
14. Обработчик события 'formErrors:change': это событие в зависимости от данных показывает или скрывает ошибки валидации. По данным ошибок выбирается, в какой форме нужно показать ошибку и она отображается. Если же данные errors оказались пустями то контейнеру(либо order либо contact) присвоивается свойство valid = true и ошибки не выдаются.
15. Обработчик события 'contacts:submit': при отправке контактной информации происходит расчет общей суммы заказа (с помощью экземпляра класса appData и метода getTotal), если в заказ добавлен товар с нулевой суммой, то id этого заказа удаляется из массива данных, которые отправляются на сервер. Дальше данные отправляются на сервер, с помощью api формируется POST запрос.В случае успешного выполнения запроса создается экземпляр класса Success для отображения сообщения об успешном заказе. После этого происходит рендеринг модального окна с сообщением об успешном заказе. При закрывании модального окна любым способом очищается корзина и генерируется событие 'basket:changed'.
