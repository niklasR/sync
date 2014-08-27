<?php
require("../main_include.php");


?>
<html lang="en">
	<head>
		<meta charset="utf-8">
		<title>XTV Sync</title>
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<meta name="description" content="">
		<meta name="author" content="">
		<meta name="robots" content="noindex, nofollow">
		<link href="assets/css/bootstrap.min.css"  rel="stylesheet" type="text/css">
		<link href="assets/css/custom.css" rel="stylesheet" type="text/css">
		<script src="assets/js/jquery-1.1.1.min.js" ></script>
		<script src="assets/js/bootstrap.js" ></script>
		<script src="assets/js/synchronised-time.js" ></script>
		<script src="assets/js/main.js" ></script>
	</head>
	<body data-baseurl="<?=e("http://".$_SERVER['SERVER_NAME'])?>">
		<div id="main-container" class="container">
			<h1 class="heading">XTV Sync</h1>
			<div><span class="code-outer">&bull; <span class="code"></span> &bull;</span></div>
			<div><span class="time-outer">Virtual time: <span class="time"></span></span></div>
			<div><span class="instruction">Loading javascript...</span></div>
			<div><span class="countdown"></span></div>
			<div><small>Based on sync from LA1:TV</small></div>
		</div>
	</body>
</html>
