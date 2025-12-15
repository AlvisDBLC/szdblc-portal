export async function onRequest(context) {
  const url = new URL(context.request.url);

  // 放行静态资源（可按需精简/扩展）
  const path = url.pathname;
  const allow = [
    "/favicon.ico"
  ];
  if (allow.includes(path)) return context.next();

  // 校验登录态：把用户的 Cookie 透传给 auth.szdblc.cn/session
  const cookie = context.request.headers.get("Cookie") || "";
  const check = await fetch("https://auth.szdblc.cn/session", {
    method: "GET",
    headers: { "Cookie": cookie }
  });

  if (check.ok) {
    return context.next(); // 已登录，放行
  }

  // 未登录：跳转回门户登录页
  return Response.redirect("https://szdblc.cn", 302);
}
