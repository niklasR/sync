<?php
require("local/privconf.php");
$conf = array();
$conf["dbUser"] = "sync";
$conf["dbPass"] = $privConf["dbPass"];
$conf["dbName"] = "sync";