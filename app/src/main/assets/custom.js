window.addEventListener("DOMContentLoaded",()=>{const t=document.createElement("script");t.src="https://www.googletagmanager.com/gtag/js?id=G-W5GKHM0893",t.async=!0,document.head.appendChild(t);const n=document.createElement("script");n.textContent="window.dataLayer = window.dataLayer || [];function gtag(){dataLayer.push(arguments);}gtag('js', new Date());gtag('config', 'G-W5GKHM0893');",document.body.appendChild(n)});// 更健壮的全局新窗口跳转拦截
const interceptBlankLinks = (e) => {
    // 找到点击的<a>标签
    const link = e.target.closest('a');
    if (!link || !link.href) return; // 非有效链接直接返回
    
    // 判断是否是新窗口打开的场景
    const isBlankTarget = link.target === '_blank' || 
                          document.querySelector('head base[target="_blank"]');
    
    if (isBlankTarget) {
        e.preventDefault();
        // 增加异常处理：避免无效URL导致的错误
        try {
            // 保留原链接的跳转方式（比如_blank改_self，但不强制location.href）
            window.location.assign(link.href);
        } catch (err) {
            console.error('跳转失败:', err);
        }
    }
};

// 覆盖所有可能的新窗口打开方式
const overrideNewWindowMethods = () => {
    // 重写window.open
    const originalOpen = window.open;
    window.open = function(url, target, features) {
        if (target === '_blank' || !target) {
            try {
                window.location.assign(url);
                // 返回一个伪窗口对象，避免调用方报错
                return { close: () => {}, focus: () => {} };
            } catch (err) {
                console.error('window.open 跳转失败:', err);
                // 兜底：调用原生方法
                return originalOpen.call(window, url, target, features);
            }
        }
        return originalOpen.call(window, url, target, features);
    };

    // 拦截form表单的target="_blank"提交
    document.addEventListener('submit', (e) => {
        const form = e.target.closest('form');
        if (form && form.target === '_blank') {
            form.target = '_self';
        }
    }, { capture: true });
};

// 初始化
document.addEventListener('click', interceptBlankLinks, { capture: true });
overrideNewWindowMethods();