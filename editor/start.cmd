del editor.zip
rmdir /s /q editor
md editor
copy index.html editor
xcopy /s /e data editor\data\
"C:\Program Files\7-Zip\7z" a -tzip editor.zip package.json ..\3dengine editor\index.html editor\data\shaders editor\data\textures
rmdir /s /q editor
..\3rdparty\nw\nw.exe editor.zip
