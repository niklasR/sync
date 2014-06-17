<?php
require("../../main_include.php");

$addError = null;

if ($_POST['form_submitted'] === "1") {
	if ($_POST['action'] === "add") {
		$addError = !saveRecord(intval($_POST['code'], 10));
	}
	else if ($_POST['action'] === "delete") {
		deleteRecord(intval($_POST['id'], 10));
	}
}

?>
<html lang="en">
	<head>
		<meta charset="utf-8">
		<title>LA1:TV Sync Control</title>
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
		<meta name="description" content="">
		<meta name="author" content="">
		<meta name="robots" content="noindex, nofollow">
		<link href="../assets/css/bootstrap.min.css"  rel="stylesheet" type="text/css">
		<link href="../assets/css/control/custom.css" rel="stylesheet" type="text/css">
		<script src="../assets/js/jquery-1.1.1.min.js" ></script>
		<script src="../assets/js/bootstrap.js" ></script>
		<script src="../assets/js/synchronised-time.js" ></script>
		<script src="../assets/js/control/main.js" ></script>
	</head>
	<body data-baseurl="<?=e("http://".$_SERVER['SERVER_NAME'])?>">
		<div id="main-container" class="container">
			<h1 class="heading">LA1:TV Sync Control</h1>
			<?php if (!is_null($addError)): ?>
			<p class="bg-<?=$addError ? "danger" : "success"?>"><?=$addError ? "Could not find record." : "Record has been added!"?></p>
			<?php endif; ?>
			<div>
				<p>Current time: <span class="data-currenttime"></span></p>
			</div>
			<div class="add-from-code">
				<form method="post" action="">
					<label>Add from code: <input type="number" class="form-input" name="code"></label> <button type="submit" class="btn btn-sm btn-primary">Add</button>
					<input type="hidden" name="action" value="add">
					<input type="hidden" name="form_submitted" value="1">
				</form>
			</div>
			<table class="main-table table table-bordered table-striped table-hover">
				<thead>
					<tr>
						<th>Code</th>
						<th>Name</th>
						<th>Instruction</th>
						<th>Offset Time (ms)</th>
						<th>Countdown To</th>
						<th>Options</th>
						<th>Calculate Offset</th>
						<th>Calculate Countdown (s)</th>
					</tr>
				</thead>
				<tbody>
				<?php foreach(getAddedRecords() as $a): ?>
					<tr data-id="<?=e($a['id']);?>">
						<td><?=e(str_pad($a['code'], 4, "0", STR_PAD_LEFT));?></td>
						<td><input type="text" class="form-control data-name" value="<?=e($a['name']);?>"></td>
						<td><input type="text" class="form-control data-instruction" value="<?=e($a['instruction']);?>"></td>
						<td><input type="number" class="form-control data-offset" value="<?=e($a['offset_time']);?>"></td>
						<td><input type="datetime-local" class="form-control data-countdownto" step="1" value="<?=is_null($a['countdown_to']) ? "" : e(formatDateForInput($a['countdown_to']));?>"><span><span class="data-countdowntxt">?</span> seconds</span></td>
						<td><button type="button" class="btn btn-sm btn-primary data-savebtn">Save</button> <button type="button" class="btn btn-sm btn-danger data-delbtn">Del</button></td>
						<td><button type="button" class="btn btn-sm btn-info data-startbtn">?</button><button type="button" class="btn btn-sm btn-default data-cancelbtn">Cancel</button></td>
						<td><input type="number" class="form-control data-calculatecountdown" min="0" value=""></td>
					</tr>
				<?php endforeach; ?>
				</tbody>
			</table>
		</div>
	</body>
</html>