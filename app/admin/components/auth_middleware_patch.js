// /**
//  * FILE: src/middleware/auth.middleware.js  (PATCH — chỉ thay đổi hàm authenticate)
//  *
//  * Vấn đề: Browser EventSource không cho phép đặt custom header.
//  * Giải pháp: Cho phép đọc JWT từ ?token=... trong query string,
//  *            dùng riêng cho SSE endpoint /admin/scraper/progress.
//  *
//  * CHỈ THAY THẾ phần đầu của hàm authenticate() — từ dòng lấy authHeader
//  * xuống đến dòng jwt.verify(token, ...). Phần còn lại giữ nguyên.
//  *
//  * ── TRƯỚC (giữ nguyên) ──────────────────────────────────────────────────
//  *   const authHeader = req.headers.authorization;
//  *   if (!authHeader || !authHeader.startsWith('Bearer ')) {
//  *     return res.status(401).json({ ... });
//  *   }
//  *   const token = authHeader.substring(7);
//  *
//  * ── SAU (thay bằng đoạn này) ────────────────────────────────────────────
//  */

// // Lấy token từ Authorization header hoặc query param (dùng cho SSE)
// async authenticate(req, res, next) {
//   try {
//     let token = null;

//     const authHeader = req.headers.authorization;
//     if (authHeader && authHeader.startsWith('Bearer ')) {
//       // Cách thông thường
//       token = authHeader.substring(7);
//     } else if (req.query && req.query.token) {
//       // Fallback cho SSE (EventSource không hỗ trợ custom header)
//       token = req.query.token;
//     }

//     if (!token) {
//       return res.status(HTTP_STATUS.UNAUTHORIZED).json({
//         success: false,
//         message: 'No token provided',
//         code: 'MISSING_TOKEN',
//       });
//     }

//     // ... (phần còn lại của hàm authenticate giữ nguyên từ jwt.verify trở xuống)
//     const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
//     // ...
//   }
// }

// /**
//  * Tương tự, cập nhật optionalAuth để cũng đọc req.query.token:
//  *
//  *   const authHeader = req.headers.authorization;
//  *   const rawToken = (authHeader && authHeader.startsWith('Bearer '))
//  *     ? authHeader.substring(7)
//  *     : (req.query?.token ?? null);
//  *
//  *   if (rawToken) {
//  *     const decoded = jwt.verify(rawToken, process.env.JWT_SECRET || 'secret');
//  *     ...
//  *   }
//  */
