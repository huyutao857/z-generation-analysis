// Cloudflare Worker反向代理Vercel前端的核心代码
export default {
  // fetch是Worker的核心方法，拦截所有对Worker域名的请求
  async fetch(request, env, ctx) {
    // ========== 关键配置：替换为你的Vercel部署域名 ==========
    // 示例：const VERCEL_DOMAIN = "z-generation-analysis-xxx.vercel.app";
    const VERCEL_DOMAIN = "z-generation-analysis.vercel.app";

    // 1. 解析当前请求的URL（比如用户访问你的自定义域名https://front.xxx.com/index.html）
    const url = new URL(request.url);
    // 2. 将请求的目标域名替换为Vercel域名（核心：反向代理的本质）
    url.hostname = VERCEL_DOMAIN;

    // 3. 构造转发到Vercel的请求（保留原请求的方法、头、参数、请求体）
    const proxyRequest = new Request(url, {
      method: request.method, // 保留GET/POST等请求方法
      headers: request.headers, // 保留Cookie、Authorization等请求头
      body: request.body, // 保留POST请求的请求体（如表单/JSON数据）
      redirect: "follow" // 自动跟随Vercel的重定向
    });

    // 4. 发送请求到Vercel，获取Vercel返回的前端页面/数据
    let response = await fetch(proxyRequest);

    // 5. 处理跨域问题（前端调用后端接口必配，避免跨域报错）
    response = new Response(response.body, response); // 复制原响应
    // 生产环境建议替换为你的自定义域名（如"https://front.xxx.com"），更安全
    response.headers.set("Access-Control-Allow-Origin", "*");
    response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

    // 6. 返回代理后的响应（用户最终看到的是Vercel的前端页面）
    return response;
  },
};
