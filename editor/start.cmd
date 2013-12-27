@echo off
del editor.zip
"C:\Program Files\7-Zip\7z" a -tzip editor.zip *.html *.json *.js ..\3dengine\*.js data\shaders\*.shader data\meshes\*.json data\textures\*.*
..\3rdparty\nw\nw.exe editor.zip
