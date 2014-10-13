<?php
$path = file_get_contents(dirname(__FILE__).'/src-sample/'.$_POST['sample'].'/';
$source = array();
if(isset($_POST['sample'])){
	if(file_exists($path.'html.txt')){
		$source['html']       = $path.'html.txt');
		$source['javascript'] = $path.'javascript.txt');
		$source['vs']         = $path.'vs.txt');
		$source['fs']         = $path.'fs.txt');
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
