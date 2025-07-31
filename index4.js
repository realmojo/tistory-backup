const fs = require("fs");
const path = require("path");

const run = () => {
  try {
    console.log("=== comparison_result.json 파일 읽기 ===");

    // comparison_result.json 파일 읽기
    const jsonPath = path.join(".", "comparison_result.json");

    if (!fs.existsSync(jsonPath)) {
      console.log("❌ comparison_result.json 파일을 찾을 수 없습니다.");
      return;
    }

    const jsonContent = fs.readFileSync(jsonPath, "utf8");
    const data = JSON.parse(jsonContent);

    // commonItems 출력 및 HTML 파일 이름 변경
    console.log("=== HTML 파일 이름 변경 시작 ===");

    let successCount = 0;
    let errorCount = 0;

    data.commonItems.forEach((item, index) => {
      console.log(`${item.number} ${item.url}`);

      try {
        const folderPath = path.join(".", item.number);
        const oldHtmlFile = path.join(folderPath, `${item.number}.html`);

        // item.url이 이미 제목이므로 그대로 사용
        const title = item.url;
        const newHtmlFile = path.join(folderPath, `${title}.html`);

        // 파일이 존재하는지 확인
        if (fs.existsSync(oldHtmlFile)) {
          // 파일 이름 변경
          fs.renameSync(oldHtmlFile, newHtmlFile);
          console.log(
            `✅ ${item.number}/${item.number}.html → ${item.number}/${title}.html`
          );
          successCount++;
        }
      } catch (error) {
        console.log(`❌ 오류 발생 (${item.number}): ${error.message}`);
        errorCount++;
      }
    });

    console.log(`\n📝 총 ${data.commonItems.length}개의 항목 처리 완료`);
    console.log(`✅ 성공: ${successCount}개`);
    console.log(`❌ 실패: ${errorCount}개`);
  } catch (error) {
    console.error("오류 발생:", error.message);
  }
};

run();
