<?php
$source = '';
if(isset($_POST['append'])){
	$source = file_get_contents(dirname(__FILE__).'/src-function/'.$_POST['append'].'.txt');
}else{
	die('bad request');
}
if($source !== false){
	echo $source;
}else{
	echo 'bad request';
}
