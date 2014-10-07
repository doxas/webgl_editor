<?php
$source = '';
if(isset($_POST['append'])){
	$source = file_get_contents($_POST['append'].'.txt');
}else{
	die('bad request');
}
if($source !== false){echo $source;}
