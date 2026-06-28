# Cross-Site Scripting (XSS)

> Mã script của kẻ tấn công thực thi trong trình duyệt của người dùng khác, trong phạm vi origin
> của ứng dụng. **Tài liệu chuyên sâu:**
> [`Troubleshooting_Guide/xss.md`](../../../../Troubleshooting_Guide/xss.md) ·
> **Skill:** [`ai_framework/skills/`](../../../ai_framework/skills/README.md)

**Tên gọi khác / OWASP:** XSS · A03:2021 Injection
**Ngôn ngữ:** [English](README.md) · Tiếng Việt
**Trạng thái:** hoàn chỉnh

## Là gì (What it is)
XSS xảy ra khi ứng dụng đưa dữ liệu do kẻ tấn công kiểm soát vào trang mà không escape đúng theo
ngữ cảnh, khiến trình duyệt thực thi nó như script. Mã của kẻ tấn công khi đó chạy với phiên của
nạn nhân, trong origin của ứng dụng.

## Cơ chế hoạt động (How it works)
Ba dạng kinh điển:
- **Reflected** — payload trong request bị phản chiếu thẳng vào phản hồi (ví dụ từ khóa tìm kiếm),
  thực thi với bất kỳ ai mở liên kết được dàn dựng.
- **Stored / lưu trữ** — payload được lưu lại (bình luận, hồ sơ) và chạy với mọi người xem.
- **DOM-based** — JS phía client đọc một nguồn (`location.hash`, `document.URL`) và ghi vào một
  sink nguy hiểm (`innerHTML`, `eval`) mà không làm sạch. Xem thêm `dom_based`.

## Tác động (Impact)
Đánh cắp phiên/cookie, chiếm tài khoản, thu thập thông tin đăng nhập qua form giả, đánh cắp token
CSRF, ghi phím, thực hiện hành động thay nạn nhân, và lây lan kiểu sâu (worm) với stored XSS.

## Cách phát hiện (How to detect)
- Một dấu hiệu phản chiếu (`'"><svg onload=…>`) xuất hiện chưa được escape trong HTML, thuộc tính,
  hoặc ngữ cảnh script.
- Đầu vào được render vào `innerHTML`/template literal phía client.
- Khác biệt giữa các ngữ cảnh (thân HTML, thuộc tính, chuỗi JS, URL) — mỗi loại cần payload và cách
  escape riêng.

## Khai thác (tóm tắt) (Exploitation)
Xác định ngữ cảnh phản chiếu, thoát khỏi ngữ cảnh đó, rồi thực thi (`<script>`, event handler, URI
`javascript:`, hoặc thoát chuỗi JS). Vượt bộ lọc bằng mẹo hoa/thường, mã hóa, và thẻ/sự kiện thay
thế. Dùng PoC vô hại `alert(document.domain)`; chỉ leo thang sang đánh cắp phiên trong phạm vi cho
phép. Payload đầy đủ nằm trong tài liệu chuyên sâu.

## Phòng chống (Defenses)
1. **Mã hóa đầu ra theo ngữ cảnh** (HTML, thuộc tính, JS, URL) — giải pháp chính.
2. **Content-Security-Policy** chặt chẽ làm lớp phòng thủ bổ sung (`script-src` dùng nonce/hash).
3. Tận dụng auto-escaping của framework; tránh `innerHTML`/`dangerouslySetInnerHTML`; làm sạch bằng
   thư viện đã kiểm chứng (DOMPurify) khi buộc phải render HTML thô.
4. Cookie `HttpOnly` để giảm thiểu việc đánh cắp token.

## Tìm CVE từ đầu (Finding CVEs from scratch)
- **NVD** — https://nvd.nist.gov/vuln/search?query=Cross-Site+Scripting
- **CVE.org** — https://www.cve.org/CVERecord/SearchResults?query=Cross-Site+Scripting
- **Exploit-DB** — https://www.exploit-db.com/search?q=XSS
- **GitHub Advisories** — https://github.com/advisories?query=xss (rất nhiều cho plugin npm/WordPress)
- **OSV** — https://osv.dev/list?q=xss
- **Cộng đồng** — r/netsec, HackerOne (`weakness:"Cross-site Scripting (XSS)"` — loại được báo cáo
  nhiều nhất), WPScan cho plugin WordPress.
- _Mẹo tìm kiếm: plugin WordPress/Drupal và trang quản trị là nơi giàu lỗ hổng nhất:_
  `"<plugin> <phiên bản>" stored XSS`.

## Các CVE tiêu biểu (Notable CVEs)
_Mang tính minh họa — hãy kiểm chứng lại trên NVD trước khi trích dẫn._
- `CVE-2023-37580` — Reflected XSS trong Zimbra Collaboration, bị khai thác thực tế.
- `CVE-2019-11358` — Prototype pollution trong jQuery thường được nối chuỗi để dẫn tới XSS (xem
  `prototype_pollution`).
- _Ví dụ kinh điển thời chưa có CVE: sâu "Samy" trên MySpace năm 2005 (stored XSS, tự lây lan)._

## Tham khảo (References)
- PortSwigger Web Security Academy — Cross-site scripting.
- OWASP — XSS Prevention & DOM-based XSS Prevention Cheat Sheets.
