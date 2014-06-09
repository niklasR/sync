<?php
require("../main_include.php");

$result = array("success"=>false);

if (isset($_POST['action'])) {
	$action = $_POST['action'];
	$sessionId = session_id();
	
	if ($action === "getTime") {
		$result['payload'] =  floor(microtime(true)*1000);
		$result['success'] = true;
	}
	else if ($action === "getData") {
		$q = $pdo->prepare("SELECT * FROM sessions WHERE session_id=?");	
		$q->execute(array($sessionId));
		if ($q->rowCount() >= 1) {
			$row = $q->fetch();
			$payload = array(
				"code"			=> str_pad($row['code'], 4, "0", STR_PAD_LEFT),
				"offsetTime"	=> is_null($row['offset_time']) ? null : intval($row['offset_time'], 10),
				"instruction"	=> $row['instruction'],
				"countdownTo"	=> is_null($row['countdown_to']) ? null : intval($row['countdown_to'], 10),
				"flashTime"		=> is_null($row['flash_time']) ? null : intval($row['flash_time'], 10)
			);
			$result['payload'] = $payload;
			$result['success'] = true;
		}
	}
}


echo(json_encode($result));