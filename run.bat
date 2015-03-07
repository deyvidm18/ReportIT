FOR /F "usebackq" %%i IN (`hostname`) DO SET PC=%%i

IF %PC% == CMEDC000050 (
    SETX NODE_ENV dev && node app.js
)
ELSE (
    SETX NODE_ENV production && node app.js
)