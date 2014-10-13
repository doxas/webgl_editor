<?php
$path = dirname(__FILE__).'/src-sample/'.$_POST['sample'].'/';
$source = array();
if(isset($_POST['sample'])){
	if(file_exists($path.'html.txt')){
		$source['html']       = file_get_contents($path.'html.txt');
		$source['javascript'] = file_get_contents($path.'javascript.txt');
		$source['vs']         = file_get_contents($path.'vs.txt');
		$source['fs']         = file_get_contents($path.'fs.txt');
	}
}else{
	die('bad request');
}
if(count($source) > 0){
	header('Content-Type: application/json; charset=utf-8');
	echo json_encode($source);
}else{
	echo 'bad request';
}
