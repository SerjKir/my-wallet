# my-wallet
Посилання на розгорнутий проект https://my-wallet-321.herokuapp.com/
Для запуску проєкта локально потрібно створити БД монго, створити файл .env в корні проекту та вказати там MONGODB_URI: <посилання на базу>
, та PORT для прослуховування(по замовчування будет 5000), встановити модулі npm i. В папці frontend встановити необхідні модулі npm i та зробити новий білд npm run build.
Запускаемо командою npm run start. Переходимо на http://localhost:5000/.
Реалізував весь базовий функціонал + базовий backend з реєстрацією.
З додаткого що хотів зробити але забракло часу -> typesript(зараз вивчаю), більше перевірок введених данних на фронті та на беку + ввивід помилок з беку на фронті нотіфікейшинами,
адаптив та привабливий дизайн (робив акцент на функціонал).
Технології які використовував для беку це MongoDB, express та додаткові модулі(bcrypt,binlookup,cors,dotenv,jsonwebtoken,mongoose,path).
Для фронту react, react-router-dom, набір material, axios, sass, react-hook-form, date-fns(datepicker).
Взагалом розробка була цікавою, хотілося би дещо переробити та ще багато чого додати :)
