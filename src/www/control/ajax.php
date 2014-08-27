<?php
require("../../main_include.php");

$result = array("success"=>false);

if (isset($_POST['action'])) {
	$action = $_POST['action'];
	$sessionId = session_id();
	
	if ($action === "save") {
		$data = $_POST['data'];
		
		$q = $pdo->prepare("SELECT count(id) AS count FROM sessions WHERE id=?");	
		$q->execute(array($data['id']));
		$r = $q->fetch();
		if ($r["count"] > 0) {
			$q = $pdo->prepare("UPDATE sessions SET name=?, offset_time=?, instruction=?, countdown_to=? WHERE id=? AND save=1");	
			$q->execute(array($data['name'], $data['offset'] === ""?null:$data['offset'], $data['instruction'], $data['countdownTo'] === ""?null:$data['countdownTo'], $data['id']));
			if ($q->rowCount() > 0) {
				$result['success'] = true;
			}
		}
	}
	else if ($action === "setFlashTime") {
		$data = $_POST['data'];
		
		$q = $pdo->prepare("SELECT count(id) AS count FROM sessions WHERE id=?");	
		$q->execute(array($data['id']));
		$r = $q->fetch();
		if ($r["count"] > 0) {
			$q = $pdo->prepare("UPDATE sessions SET flash_time=? WHERE id=? AND save=1");	
			$q->execute(array($data['flashTime'] === ""?null:$data['flashTime'], $data['id']));
			if ($q->rowCount() > 0) {
				$result['success'] = true;
			}
		}
	}
}


echo(json_encode($result));