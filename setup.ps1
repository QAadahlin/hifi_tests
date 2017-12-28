$client = new-object System.Net.WebClient
$client.DownloadFile("https://hifi-content.s3.amazonaws.com/nissim/autoTester/Release.exe", "autoTester/Release.exe")

$client.DownloadFile("https://hifi-content.s3.amazonaws.com/nissim/autoTester/resources/moon rocks_texture8k.ktx", "autoTester/Resources/moon rocks_texture8k.ktx")
$client.DownloadFile("https://hifi-content.s3.amazonaws.com/nissim/autoTester/resources/Nevada-Moon-Rocks.baked.fbx", "autoTester/Resources/Nevada-Moon-Rocks.baked.fbx")
$client.DownloadFile("https://hifi-content.s3.amazonaws.com/nissim/autoTester/resources/Sky_Day-Sun-Mid-photo.ktx", "autoTester/Resources/Sky_Day-Sun-Mid-photo.ktx")
$client.DownloadFile("https://hifi-content.s3.amazonaws.com/nissim/autoTester/resources/PalmTree.fbx", "autoTester/Resources/PalmTree.fbx")
$client.DownloadFile("https://hifi-content.s3.amazonaws.com/nissim/autoTester/resources/hifi_opacityV_albedoM_ao.fbx", "autoTester/Resources/hifi_opacityV_albedoM_ao.fbx")
$client.DownloadFile("https://hifi-content.s3.amazonaws.com/nissim/autoTester/resources/FullMoon1024Compressed.jpg", "autoTester/Resources/FullMoon1024Compressed.jpg")
$client.DownloadFile("https://hifi-content.s3.amazonaws.com/nissim/autoTester/resources/ThickCloudsWater2.jpg", "autoTester/Resources/ThickCloudsWater2.jpg")
