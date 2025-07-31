const fs = require("fs");
const path = require("path");

const run = () => {
  try {
    // 현재 디렉토리의 모든 파일과 폴더를 읽기
    let items = fs.readdirSync(".");

    // 숫자 폴더를 큰 숫자부터 정렬
    items = items.sort((a, b) => {
      const numA = parseInt(a);
      const numB = parseInt(b);

      // 둘 다 숫자인 경우 숫자 순으로 정렬 (내림차순)
      if (!isNaN(numA) && !isNaN(numB)) {
        return numB - numA;
      }

      // 둘 다 숫자가 아닌 경우 알파벳 순으로 정렬
      if (isNaN(numA) && isNaN(numB)) {
        return a.localeCompare(b);
      }

      // 숫자가 아닌 것이 앞으로 오도록
      if (isNaN(numA)) return -1;
      if (isNaN(numB)) return 1;

      return 0;
    });

    console.log("=== 모든 폴더 목록 ===");

    // 제목들을 저장할 배열
    const titles = [];

    // 각 아이템이 폴더인지 확인하고 폴더 안의 HTML 파일들 출력
    items.forEach((item) => {
      const itemPath = path.join(".", item);
      const stats = fs.statSync(itemPath);

      if (stats.isDirectory()) {
        try {
          // 폴더 안의 모든 파일 읽기
          const files = fs.readdirSync(itemPath);

          // HTML 파일들만 필터링
          const htmlFiles = files.filter((file) => file.endsWith(".html"));

          if (htmlFiles.length > 0) {
            htmlFiles.forEach((htmlFile) => {
              try {
                // HTML 파일명에서 .html 확장자 제거
                let title = htmlFile.replace(".html", "");

                // 제목 정리: 특수문자 제거 및 하이픈으로 변경
                title = title
                  .replace(/[\[\](){}?!]/g, "") // 대괄호, 소괄호, 중괄호, 물음표, 느낌표 제거
                  .replace(/[;\s,:|]/g, "-") // 세미콜론, 띄어쓰기, 콤마, 콜론, 파이프를 하이픈으로 변경
                  .replace(/-+/g, "-") // 연속된 하이픈을 하나로 변경
                  .replace(/^-|-$/g, "") // 앞뒤 하이픈 제거
                  .trim();

                console.log(`📄 ${title}`);

                // 제목을 배열에 추가 (폴더 번호 포함)
                titles.push(`${item} https://devupbox.com/entry/${title}`);
              } catch (error) {
                console.log(`📄 ${htmlFile} - (파일명 처리 오류)`);
              }
            });
          } else {
            console.log(`  (HTML 파일 없음)`);
          }
        } catch (error) {
          console.log(`  ❌ 폴더 읽기 오류: ${error.message}`);
        }
      }
    });

    // 제목들을 title.txt 파일로 저장
    const titleContent = titles.join("\n");
    fs.writeFileSync("title.txt", titleContent, "utf8");
    console.log(
      `\n📝 ${titles.length}개의 제목이 title.txt 파일로 저장되었습니다.`
    );

    console.log("===================");
  } catch (error) {
    console.error("오류 발생:", error.message);
  }
};

run();
