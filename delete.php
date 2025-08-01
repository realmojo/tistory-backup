<?php
$filename = "tistory";
 
if (file_exists($filename)) {
    $cmd = "rm -rf $filename";
    @exec($cmd);
    echo "파일 삭제 완료.";
} else {
    echo "파일이 없습니다.";
}
?>