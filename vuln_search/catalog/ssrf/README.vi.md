# Server-Side Request Forgery (SSRF)

> Máy chủ bị ép thực hiện request tới các đích nội bộ do kẻ tấn công chỉ định. **Tài liệu chuyên
> sâu:** [`Troubleshooting_Guide/ssrf.md`](../../../../Troubleshooting_Guide/ssrf.md) ·
> **Skill:** [`ai_framework/skills/`](../../../ai_framework/skills/README.md)

**Tên gọi khác / OWASP:** SSRF · A10:2021 Server-Side Request Forgery
**Ngôn ngữ:** [English](README.md) · Tiếng Việt
**Trạng thái:** hoàn chỉnh

## Là gì (What it is)
SSRF xảy ra khi ứng dụng nhận một URL (hoặc host/IP) từ người dùng và tự thực hiện request đó ở phía
máy chủ, cho phép kẻ tấn công trỏ request tới các hệ thống mà máy chủ truy cập được nhưng họ thì
không — dịch vụ nội bộ, endpoint metadata của cloud, hoặc giao diện loopback.

## Cơ chế hoạt động (How it works)
Một tính năng như "import từ URL", webhook, trình render PDF, hoặc tải ảnh nhận vào một URL. Kẻ tấn
công cung cấp `http://169.254.169.254/…` (metadata cloud), `http://127.0.0.1:6379/` (Redis nội bộ),
hoặc scheme `file://`. Máy chủ thực hiện request với vị trí mạng — và thường là thông tin xác thực —
của chính nó. SSRF mù (blind) được phát hiện qua callback out-of-band.

## Tác động (Impact)
Đọc thông tin xác thực của instance cloud (kinh điển: đánh cắp metadata IMDSv1 → chiếm tài khoản),
truy cập trang quản trị và cơ sở dữ liệu nội bộ, quét cổng mạng nội bộ, gọi các API nội bộ không xác
thực, và đôi khi leo thang thành RCE đối với dịch vụ nội bộ.

## Cách phát hiện (How to detect)
- Bất kỳ tham số nào chứa URL, hostname, hoặc IP mà máy chủ sau đó đi tải.
- Tương tác out-of-band (Burp Collaborator / log DNS của bạn) khi trỏ tới một domain bạn kiểm soát —
  chứng minh SSRF mù.
- Khác biệt phản hồi/độ trễ giữa cổng nội bộ truy cập được và không truy cập được.

## Khai thác (tóm tắt) (Exploitation)
Xác nhận việc fetch bằng một "canary" out-of-band, rồi liệt kê các đích nội bộ (loopback, dải
RFC1918, IP metadata). Vượt bộ lọc yếu bằng mã hóa thay thế, redirect, DNS rebinding, `[::]`, IP
dạng thập phân/bát phân, hoặc mẹo `@` trong phần authority. Leo thang qua các dịch vụ truy cập được.
Kỹ thuật đầy đủ nằm trong tài liệu chuyên sâu.

## Phòng chống (Defenses)
1. **Danh sách cho phép (allow-list)** host/scheme đích; mặc định từ chối.
2. Phân giải và kiểm tra IP *sau* khi DNS, chặn dải private/link-local (và kiểm tra lại khi có
   redirect để chống rebinding/TOCTOU).
3. Tắt các scheme không dùng (`file://`, `gopher://`, `dict://`).
4. Bắt buộc IMDSv2 / loại bỏ phụ thuộc vào instance metadata; phân vùng mạng nội bộ.

## Tìm CVE từ đầu (Finding CVEs from scratch)
- **NVD** — https://nvd.nist.gov/vuln/search?query=Server-Side+Request+Forgery
- **CVE.org** — https://www.cve.org/CVERecord/SearchResults?query=SSRF
- **Exploit-DB** — https://www.exploit-db.com/search?q=SSRF
- **GitHub Advisories** — https://github.com/advisories?query=ssrf
- **OSV** — https://osv.dev/list?q=ssrf
- **Cộng đồng** — r/netsec, HackerOne (`weakness:"Server-Side Request Forgery (SSRF)"`), blog
  bảo mật cloud (lạm dụng metadata).
- _Mẹo tìm kiếm: nhắm vào các tính năng tải URL và gateway:_ `"<sản phẩm>" SSRF metadata`.

## Các CVE tiêu biểu (Notable CVEs)
_Mang tính minh họa — hãy kiểm chứng lại trên NVD trước khi trích dẫn._
- `CVE-2021-26855` — SSRF "ProxyLogon" trong Microsoft Exchange, không cần xác thực, nối chuỗi tới
  RCE; bị khai thác hàng loạt.
- `CVE-2021-22054` — SSRF trong VMware Workspace ONE UEM.
- _Sự cố kinh điển: vụ rò rỉ Capital One năm 2019 lạm dụng SSRF để đọc thông tin xác thực AWS IMDS._

## Tham khảo (References)
- PortSwigger Web Security Academy — SSRF.
- OWASP — Server-Side Request Forgery Prevention Cheat Sheet.
