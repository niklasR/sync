<?php
require("conf.php");
session_start();

$pdo = new PDO("mysql:host=localhost;dbname=".$conf['dbName'], $conf['dbUser'], $conf['dbPass']);
registerSession();
removeOldRecords();


// register session in database and get id
function registerSession() {
	
	global $pdo;

	$sessionId = session_id();
	
	$q = $pdo->prepare("SELECT count(id) AS count FROM sessions WHERE session_id=?");	
	$q->execute(array($sessionId));
	$r = $q->fetch();
	if ($r["count"] > 0) {
		return;
	}
	
	while(true) {
		$code = rand(0, 9999);
		$q = $pdo->prepare("SELECT count(id) AS count FROM sessions WHERE code=?");	
		$q->execute(array($code));
		$r = $q->fetch();
		if ($r["count"] <= 0) {
			break;
		}
	}
	
	$q = $pdo->prepare("INSERT INTO sessions(session_id,code,time_seen) VALUES (?,?,?)");
	$q->execute(array($sessionId, $code, time()));
}

function getAddedRecords() {
	global $pdo;

	$q = $pdo->prepare("SELECT * FROM sessions WHERE save=1 ORDER BY name");	
	$q->execute();
	return $q->fetchAll();
}

function saveRecord($code) {
	global $pdo;
	
	$q = $pdo->prepare("SELECT count(id) AS count FROM sessions WHERE code=? AND save=0");	
	$q->execute(array($code));
	$r = $q->fetch();
	if ($r['count'] <= 0) {
		return false;
	}
	$q = $pdo->prepare("UPDATE sessions SET save=1 WHERE code=?");	
	$q->execute(array($code));
	return true;
}

function removeOldRecords() {
	global $pdo;
	// update time seen
	$q = $pdo->prepare("UPDATE sessions SET time_seen=? WHERE session_id=?");	
	$q->execute(array(time(), session_id()));
	// remove old records
	$oldestTime = time() - (60*6);
	$q = $pdo->prepare("DELETE FROM sessions WHERE save=0 AND time_seen < ?");	
	$q->execute(array($oldestTime));
}

function deleteRecord($id) {
	global $pdo;
	$q = $pdo->prepare("UPDATE sessions SET save=0,instruction=NULL,countdown_to=NULL,flash_time=NULL WHERE id=?");	
	$q->execute(array($id));
}

function formatDateForInput($time) {
	return Date("Y-m-d\TH:i:s", intVal($time, 10));
}

function e($a) {
	return htmlentities($a);
}