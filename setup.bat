REM @ECHO OFF

REM delete any existing autoTester
IF EXIST tools\autoTester\NUL (
    RMDIR /S /Q tools\autoTester
)

REM get autoTester executable zip from Amazon S3 (called Release.exe
cd tools
mkdir autoTester
cd autoTester
mkdir resources
cd ..

PowerShell.exe -ExecutionPolicy Bypass -Command "& '%~dpn0.ps1'"

REM extract autoTester
cd autoTester
Release.exe
del Release.exe
