const fs = require("fs");
const path = require("path");

const run = () => {
  try {
    // 현재 디렉토리의 모든 파일과 폴더를 읽기
    let items = fs.readdirSync(".");
    let htmlFiles = [];
    let processedFiles = 0;

    items.forEach((item) => {
      const itemPath = path.join(".", item);
      const stats = fs.statSync(itemPath);

      if (stats.isDirectory()) {
        try {
          // 폴더 내의 모든 파일 읽기
          const files = fs.readdirSync(itemPath);

          // HTML 파일만 필터링
          const htmlFilesInDir = files.filter((file) => file.endsWith(".html"));

          if (htmlFilesInDir.length > 0) {
            console.log(`📁 ${item} 폴더:`);
            htmlFilesInDir.forEach((htmlFile) => {
              console.log(`  📄 ${htmlFile}`);
              htmlFiles.push({
                folder: item,
                file: htmlFile,
                fullPath: path.join(item, htmlFile),
              });

              // HTML 파일 내용 읽기
              const htmlFilePath = path.join(itemPath, htmlFile);
              let htmlContent = fs.readFileSync(htmlFilePath, "utf8");

              // ./img를 절대경로로 변경
              const absoluteUrl = `https://devupbox.com/tistory/${item}/img`;
              const originalContent = htmlContent;

              // 여러 패턴으로 이미지 경로 변경
              htmlContent = htmlContent.replace(
                /src="\.\/img\//g,
                `src="${absoluteUrl}/`
              );
              htmlContent = htmlContent.replace(
                /src="img\//g,
                `src="${absoluteUrl}/`
              );
              htmlContent = htmlContent.replace(
                /href="\.\/img\//g,
                `href="${absoluteUrl}/`
              );
              htmlContent = htmlContent.replace(
                /href="img\//g,
                `href="${absoluteUrl}/`
              );

              // 변경사항이 있으면 파일에 저장
              if (htmlContent !== originalContent) {
                fs.writeFileSync(htmlFilePath, htmlContent, "utf8");
                console.log(`    ✅ 이미지 경로 변경 완료`);
                processedFiles++;
              } else {
                console.log(`    ℹ️ 변경사항 없음`);
              }
            });
            console.log(`  총 ${htmlFilesInDir.length}개의 HTML 파일\n`);
          }
        } catch (error) {
          console.log(`  ❌ 폴더 읽기 오류: ${error.message}`);
        }
      }
    });

    console.log(`\n📝 총 ${items.length}개의 항목 처리 완료`);
    console.log(`📄 총 ${htmlFiles.length}개의 HTML 파일 발견`);
    console.log(`🔄 총 ${processedFiles}개의 파일에서 이미지 경로 변경 완료`);

    // 결과를 JSON 파일로 저장
    fs.writeFileSync("html_files.json", JSON.stringify(htmlFiles, null, 2));
    console.log(`💾 HTML 파일 목록이 html_files.json에 저장되었습니다.`);
  } catch (error) {
    console.error("오류 발생:", error.message);
  }
};

run();
