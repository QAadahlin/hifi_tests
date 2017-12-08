$client = new-object System.Net.WebClient
$client.DownloadFile("https://hifi-content.s3.amazonaws.com/nissim/autoTester/Release.exe", "autoTester/Release.exe")

$client.DownloadFile("https://hifi-content.s3.amazonaws.com/nissim/autoTester/resources/moon rocks_texture8k.ktx", "autoTester/resources/moon rocks_texture8k.ktx")
$client.DownloadFile("https://hifi-content.s3.amazonaws.com/nissim/autoTester/resources/Nevada-Moon-Rocks.baked.fbx", "autoTester/resources/Nevada-Moon-Rocks.baked.fbx")
$client.DownloadFile("https://hifi-content.s3.amazonaws.com/nissim/autoTester/resources/Sky_Day-Sun-Mid-photo.ktx", "autoTester/resources/Sky_Day-Sun-Mid-photo.ktx")
