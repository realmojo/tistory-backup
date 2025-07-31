const fs = require("fs");
const path = require("path");

const run = () => {
  try {
    console.log("=== sitemap.xml 파일 읽기 ===");

    // sitemap.xml 파일 읽기
    const sitemapPath = path.join(".", "sitemap.xml");

    if (!fs.existsSync(sitemapPath)) {
      console.log("❌ sitemap.xml 파일을 찾을 수 없습니다.");
      return;
    }

    const sitemapContent = fs.readFileSync(sitemapPath, "utf8");

    // XML 파싱 (간단한 정규식 사용)
    const urlMatches = sitemapContent.match(/<url[^>]*>[\s\S]*?<\/url>/g);

    if (!urlMatches) {
      console.log("📄 sitemap.xml 내용:");
      console.log(sitemapContent);
      return;
    }

    console.log(
      `📄 sitemap.xml에서 ${urlMatches.length}개의 URL을 찾았습니다:\n`
    );

    // URL들을 저장할 배열
    const urls = [];

    urlMatches.forEach((urlBlock, index) => {
      // loc 태그에서 URL 추출
      const locMatch = urlBlock.match(/<loc[^>]*>(.*?)<\/loc>/i);
      let url = locMatch ? locMatch[1].trim() : "URL 없음";

      // URL 디코딩 (한글 등이 인코딩된 경우)
      try {
        url = decodeURIComponent(url);
      } catch (error) {
        // 디코딩 실패 시 원본 URL 유지
      }

      // lastmod 태그에서 날짜 추출
      const lastmodMatch = urlBlock.match(/<lastmod[^>]*>(.*?)<\/lastmod>/i);
      const lastmod = lastmodMatch ? lastmodMatch[1].trim() : "날짜 없음";

      // changefreq 태그에서 변경 빈도 추출
      const changefreqMatch = urlBlock.match(
        /<changefreq[^>]*>(.*?)<\/changefreq>/i
      );
      const changefreq = changefreqMatch
        ? changefreqMatch[1].trim()
        : "빈도 없음";

      // priority 태그에서 우선순위 추출
      const priorityMatch = urlBlock.match(/<priority[^>]*>(.*?)<\/priority>/i);
      const priority = priorityMatch
        ? priorityMatch[1].trim()
        : "우선순위 없음";

      console.log(url);

      // URL을 배열에 추가
      urls.push(url);
    });

    // URL들을 sitemap.txt 파일로 저장
    const urlContent = urls.join("\n");
    fs.writeFileSync("sitemap.txt", urlContent, "utf8");
    console.log(
      `\n📝 ${urls.length}개의 URL이 sitemap.txt 파일로 저장되었습니다.`
    );

    console.log("===================");
  } catch (error) {
    console.error("❌ 오류 발생:", error.message);
  }
};

run();
