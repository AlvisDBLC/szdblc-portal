export async function onRequest(context) {
  const url = new URL(context.request.url);
  const path = url.pathname;

  // 允许未登录访问的路径（门户本身）
  const publicPaths = [
    "/",
    "/index.html",
    "/favicon.ico"
  ];

  if (publicPaths.includes(path)) {
    return context.next();
  }

  // 校验登录态（把 Cookie 传给 auth-api）
  const cookie = context.request.headers.get("Cookie") || "";
  const check = await fetch("https://auth.szdblc.cn/session", {
    method: "GET",
    headers: { "Cookie": cookie }
  });

  if (check.ok) {
    return context.next(); // 已登录
  }

  // 未登录 → 回到门户首页
  return Response.redirect("https://szdblc.cn", 302);
}
