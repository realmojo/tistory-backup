const fs = require("fs");
const path = require("path");

const run = () => {
  try {
    console.log("=== title.txt와 sitemap.txt 파일 비교 ===");

    // 파일 존재 확인
    const titlePath = path.join(".", "title.txt");
    const sitemapPath = path.join(".", "sitemap.txt");

    if (!fs.existsSync(titlePath)) {
      console.log("❌ title.txt 파일을 찾을 수 없습니다.");
      return;
    }

    if (!fs.existsSync(sitemapPath)) {
      console.log("❌ sitemap.txt 파일을 찾을 수 없습니다.");
      return;
    }

    // 파일 읽기
    const titleContent = fs.readFileSync(titlePath, "utf8");
    const sitemapContent = fs.readFileSync(sitemapPath, "utf8");

    // 줄 단위로 분리
    const titleLines = titleContent
      .split("\n")
      .filter((line) => line.trim() !== "");
    const sitemapLines = sitemapContent
      .split("\n")
      .filter((line) => line.trim() !== "");

    // title.txt에서 URL과 숫자 추출
    const titleData = titleLines.map((line) => {
      const numberMatch = line.match(/^(\d+)/);
      const urlMatch = line.match(/https:\/\/[^\s]+/);
      return {
        number: numberMatch ? numberMatch[1] : "",
        url: urlMatch ? urlMatch[0] : line,
      };
    });

    const titleUrls = titleData.map((item) => item.url);

    console.log(`📄 title.txt: ${titleUrls.length}개 항목`);
    console.log(`📄 sitemap.txt: ${sitemapLines.length}개 항목\n`);

    // title.txt에만 있는 항목 찾기
    const onlyInTitle = titleUrls.filter(
      (titleUrl) => !sitemapLines.some((sitemap) => sitemap.includes(titleUrl))
    );

    // sitemap.txt에만 있는 항목 찾기
    const onlyInSitemap = sitemapLines.filter(
      (sitemap) => !titleUrls.some((titleUrl) => sitemap.includes(titleUrl))
    );

    // 공통 항목 찾기 (숫자 정보 포함)
    const commonItems = titleData.filter((titleItem) =>
      sitemapLines.some((sitemap) => sitemap.includes(titleItem.url))
    );

    // 유사한 URL 매칭 함수
    const findSimilarUrl = (sitemapUrl, titleUrls) => {
      // URL에서 도메인과 경로 부분 추출
      const sitemapPath = sitemapUrl.replace("https://devupbox.com/entry/", "");

      for (const titleItem of titleUrls) {
        const titlePath = titleItem.url.replace(
          "https://devupbox.com/entry/",
          ""
        );

        // 한글만 남기고 나머지 모두 제거 후 비교
        const cleanSitemap = sitemapPath.replace(/[^가-힣]/g, "");
        const cleanTitle = titlePath.replace(/[^가-힣]/g, "");

        // 앞의 5자리만 비교
        const sitemapPrefix = cleanSitemap.substring(0, 5);
        const titlePrefix = cleanTitle.substring(0, 5);

        if (sitemapPrefix === titlePrefix && sitemapPrefix.length >= 5) {
          return titleItem;
        }
      }
      return null;
    };

    // onlyInSitemap의 URL들을 기준으로 유사한 title 찾기
    const additionalCommonItems = [];
    const matchedTitles = new Set();

    onlyInSitemap.forEach((sitemapUrl) => {
      const similarTitle = findSimilarUrl(sitemapUrl, titleData);
      if (similarTitle && !matchedTitles.has(similarTitle.number)) {
        additionalCommonItems.push({
          number: similarTitle.number,
          url: sitemapUrl, // 원문 URL 사용
        });
        matchedTitles.add(similarTitle.number);
      }
    });

    // 추가된 공통 항목들을 commonItems에 합치기
    commonItems.push(...additionalCommonItems);

    console.log("=== 비교 결과 ===");
    console.log(`✅ 공통 항목: ${commonItems.length}개`);
    console.log(`📝 title.txt에만 있는 항목: ${onlyInTitle.length}개`);
    console.log(`🌐 sitemap.txt에만 있는 항목: ${onlyInSitemap.length}개\n`);

    // 상세 결과 출력
    if (onlyInTitle.length > 0) {
      console.log("📝 title.txt에만 있는 항목들:");
      onlyInTitle.forEach((item, index) => {
        console.log(`  ${index + 1}. ${item}`);
      });
      console.log("");
    }

    if (onlyInSitemap.length > 0) {
      console.log("🌐 sitemap.txt에만 있는 항목들:");
      onlyInSitemap.forEach((item, index) => {
        console.log(`  ${index + 1}. ${item}`);
      });
      console.log("");
    }

    if (commonItems.length > 0) {
      console.log("✅ 공통 항목들 (처음 10개):");
      commonItems.slice(0, 10).forEach((item, index) => {
        console.log(`  ${index + 1}. ${item.number} ${item.url}`);
      });
      if (commonItems.length > 10) {
        console.log(`  ... 그리고 ${commonItems.length - 10}개 더`);
      }
      console.log("");
    }

    // 결과를 파일로 저장
    const comparisonResult = {
      summary: {
        totalTitle: titleLines.length,
        totalSitemap: sitemapLines.length,
        common: commonItems.length,
        onlyInTitle: onlyInTitle.length,
        onlyInSitemap: onlyInSitemap.length,
      },
      onlyInTitle: onlyInTitle,
      onlyInSitemap: onlyInSitemap,
      commonItems: commonItems,
    };

    fs.writeFileSync(
      "comparison_result.json",
      JSON.stringify(comparisonResult, null, 2),
      "utf8"
    );
    console.log("📝 비교 결과가 comparison_result.json 파일로 저장되었습니다.");

    console.log("===================");
  } catch (error) {
    console.error("❌ 오류 발생:", error.message);
  }
};

run();
