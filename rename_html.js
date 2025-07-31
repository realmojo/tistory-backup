const fs = require("fs");
const path = require("path");

const run = () => {
  try {
    console.log("=== HTML 파일 이름 변경 시작 ===\n");

    // comparison_result.json 파일 읽기
    const jsonPath = path.join(".", "comparison_result.json");

    if (!fs.existsSync(jsonPath)) {
      console.log("❌ comparison_result.json 파일을 찾을 수 없습니다.");
      return;
    }

    const jsonContent = fs.readFileSync(jsonPath, "utf8");
    const data = JSON.parse(jsonContent);

    let successCount = 0;
    let errorCount = 0;

    // commonItems의 HTML 파일들 이름 변경
    data.commonItems.forEach((item) => {
      try {
        const folderPath = path.join(".", item.number);
        const oldHtmlFile = path.join(folderPath, `${item.number}.html`);
        const newHtmlFile = path.join(folderPath, `${item.url}.html`);

        if (fs.existsSync(oldHtmlFile)) {
          fs.renameSync(oldHtmlFile, newHtmlFile);
          console.log(
            `✅ ${item.number}/${item.number}.html → ${item.number}/${item.url}.html`
          );
          successCount++;
        } else {
          // 기존 파일이 없으면 "number-title.html" 형태의 파일 찾기
          const files = fs.readdirSync(folderPath);
          const htmlFiles = files.filter((file) => file.endsWith(".html"));

          // "number-title.html" 형태의 파일 찾기
          const targetFile = htmlFiles.find((file) => {
            const fileName = file.replace(".html", "");
            return fileName.startsWith(`${item.number}-`);
          });

          if (targetFile) {
            const oldFile = path.join(folderPath, targetFile);
            const newFile = path.join(folderPath, `${item.url}.html`);

            fs.renameSync(oldFile, newFile);
            console.log(
              `✅ ${item.number}/${targetFile} → ${item.number}/${item.url}.html`
            );
            successCount++;
          } else {
            console.log(
              `❌ 파일 없음: ${item.number} 폴더에서 ${item.number}.html 또는 ${item.number}-*.html`
            );
            errorCount++;
          }
        }
      } catch (error) {
        console.log(
          `❌ 이름 변경 실패: ${item.number}/${item.number}.html - ${error.message}`
        );
        errorCount++;
      }
    });

    console.log(`\n📊 이름 변경 결과:`);
    console.log(`✅ 성공: ${successCount}개`);
    console.log(`❌ 실패: ${errorCount}개`);
    console.log(`📝 총 처리된 항목: ${data.commonItems.length}개`);
  } catch (error) {
    console.error("오류 발생:", error.message);
  }
};

run();
