@echo off
"C:\Program Files\7-Zip\7z" a -tzip editor.zip *.html *.json *.js ..\engine\*.js ..\3dengine\*.js data\shaders\*.shader data\meshes\*.json data\textures\*.*
..\3rdparty\nw\nw.exe editor.zip
